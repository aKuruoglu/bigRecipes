import restify from 'components/restify';
import RecipeControl from 'entity/recipe/control';

restify.server.post( '/recipe', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.create( req.body ) );
    },
  },
] ) );

restify.server.del( '/recipe/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.delete( req.params ) );
    },
  },
] ) );

restify.server.get( '/recipe/category/:categoryId', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.getByCategory( req.params ) );
    },
  },
] ) );

restify.server.get( '/recipe/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await RecipeControl.getById( req.params ) );
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
      res.send( 200, await RecipeControl.update( req.params, req.body ) );
    },
  },
] ) );



