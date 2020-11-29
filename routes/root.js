'use strict'
const Users = require('../controllers/Users');
const Search = require('../lib/Search');

const userInstance = new Users();


module.exports = async function (fastify, opts) {
  fastify.decorate('search', '');

  fastify.addHook('onRequest', (request, reply, done) => {
    fastify.search = new Search(userInstance.list());
    done();
  })

  fastify.get('/', async function (request, reply) {
    return reply.view('index.ejs', { users: userInstance.list() });
  })

  fastify.post('/', async function (request, reply) {
    const data = {
      fname: request.body.fname,
      lname: request.body.lname,
      email: request.body.email,
      description: request.body.description,
    }
    userInstance.save(data);
    // create indices and save in memory
    // redirect to home page
    reply.redirect('/');
  })

  fastify.get('/search', async function (request, reply) {
    const { q } = request.query
    return fastify.search.query(q);
  });

}
