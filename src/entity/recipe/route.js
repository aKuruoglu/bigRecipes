import restify from 'components/restify';
import RecipeControl from 'entity/recipe/control';

restify.server.post('/recipe', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res ) => {
      res.send(200, await RecipeControl.recipeCreate(req.body));
    },
  },
]));


