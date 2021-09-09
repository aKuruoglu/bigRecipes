import restify from 'components/restify';
import CategoryControl from 'entity/category/control';

restify.server.post('/category/create', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      res.send(200, await CategoryControl.create(req.body));
    },
  },
]));

restify.server.del('/category', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      res.send(200, await CategoryControl.delete(req.body));
    },
  },
]));

restify.server.put('/category', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      res.send(200, await CategoryControl.delete(req.body));
    },
  },
]));

