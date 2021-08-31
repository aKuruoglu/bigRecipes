import restify from 'components/restify';
import testControl from 'entity/test/control';

restify.server.post('/test', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      res.send(200, await testControl.create(req.body));
    },
  },
]));
