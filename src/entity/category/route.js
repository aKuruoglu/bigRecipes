import restify from 'components/restify';
import CategoryControl from 'entity/category/control';

restify.server.post( '/category', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await CategoryControl.create( req.body ) );
    },
  },
] ) );

restify.server.del( '/category/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await CategoryControl.delete( req.params ) );
    },
  },
] ) );


restify.server.get( '/category', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await CategoryControl.getCategories( req.body ) );
    },
  },
] ) );

restify.server.get( '/category/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await CategoryControl.getById( req.params ) );
    },
  },
] ) );

restify.server.put( '/category/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await CategoryControl.update( req.params, req.body ) );
    },
  },
] ) );





