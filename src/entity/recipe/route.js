import restify from 'components/restify';
import RecipeControl from 'entity/recipe/control';

restify.server.post( '/recipe', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      console.log(req.body);
      res.send( 200, await RecipeControl.recipeCreate( req.body ) );
    },
  },
] ) );

restify.server.del( '/recipe/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.recipeDelete( req.params ) );
    },
  },
] ) );

restify.server.get( '/recipe/category/:categoryId', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.getAllByCategory( req.params ) );
    },
  },
] ) );

restify.server.get( '/recipe/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.getOneById( req.params ) );
    },
  },
] ) );

restify.server.put( '/recipe/:_id/change-category/:categoryId', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.updateCategory( req.params ) );
    },
  },
] ) );

restify.server.put( '/recipe/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.updateRecipe( { ...req.body, ...req.params } ) );
    },
  },
] ) );


