import restify from 'components/restify';
import ArticleControl from 'entity/article/control';

restify.server.get( '/article/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.getById( req.params ) );
    },
  },
] ) );

restify.server.get( '/article/category/:categoryId', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.getByCategory( req.params ) );
    },
  },
] ) );

restify.server.post( '/article', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.add( req.body ) );
    },
  },
] ) );

restify.server.del( '/article/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      await ArticleControl.remove( req.params );
      res.send( 200, { message: 'Successfully deleted' } );
    },
  },
] ) );

restify.server.put( '/article/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.update( { ...req.body, ...req.params } ) );
    },
  },
] ) );

restify.server.put( '/article/:_id/change-category/:categoryId', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.updateCategory( req.params ) );
    },
  },
] ) );
