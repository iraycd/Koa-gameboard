module.exports = function registerRoutes(router)
{
    router.resource('get', '/user', 'UserController@index')
}