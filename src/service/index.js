import path from 'path';
import koaStatic from 'koa-static';
import KoaRouter from 'koa-router';
import Server from 'boardgame.io/server';
import orm from 'orm';
import * as awilix from 'awilix';
import Game from '../../src/client/tic-tac-toe/components/game';
import RegisterRoutes from '../../src/service/routes';

const CONTROLLERS_DIR = path.resolve(__dirname, 'controllers')
const REPOSITORIES_DIR = path.resolve(__dirname, 'repositories')
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

orm.connect("mysql://root:@localhost/game", function (err, db) {
    if (err) throw err;

    container.register({
        db: awilix.asValue(db)
    });

    container.register({
        connected: awilix.asValue(0),
        clients: awilix.asValue({})
    });

    container.loadModules([CONTROLLERS_DIR+'/**/*.js', REPOSITORIES_DIR+'/**/*.js']);

    let connected = [];
    let clients = {};

    const app = new Server({
        game: Game
    });

    app._io.on('connection', function(socket){
        if (socket.client && socket.client.id && !clients[socket.client.id])
        {
            let clientId = socket.client.id;
            clients[clientId] = socket.client;
            connected.push(clientId);

            socket.on('disconnect', function(){
                if (clients[clientId])
                {
                    delete clients[clientId];
                    connected.splice(connected.indexOf(clientId), 1);
                }
            });
        }
    });

    const router =  new KoaRouter();
    router.resource = function(sMethod, sPath, sController)
    {
        let aControllerPats = sController.split('@');
        let sControllerClass = aControllerPats[0];
        let sControllerMethod = aControllerPats[1] || 'index';

        router[sMethod].call(router, sPath, container.resolve(sControllerClass)[sControllerMethod]);
    }

    RegisterRoutes(router);

    router.get('/api/test', async (ctx) => {
        ctx.body = {
            playerID: connected.length
        };
    });

    app.use(router.routes());
    app.use(koaStatic('./build'));

    const port = 4000;

    app.listen(port, () => {
        console.log(`Service started on port ${port}`);
    });
});

