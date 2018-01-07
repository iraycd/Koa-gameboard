class UserController {

    constructor({UserRepository}) {
        this.UserRepository = UserRepository;
    }

    async index(ctx)
    {
        ctx.body = {
            message: 'ok'
        };
    }

}

module.exports = UserController;