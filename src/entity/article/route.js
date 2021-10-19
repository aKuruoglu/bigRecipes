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

restify.server.get( '/article/:page/:limit', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.getAll( req.params ) );
    },
  },
] ) );

restify.server.get( '/article/category/:categoryId/:page/:limit', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.getByCategory( req.params ) );
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
      res.send( 200, await ArticleControl.remove( req.params ));
    },
  },
] ) );

restify.server.put( '/article/:_id', restify.version( [
  {
    version: '0.0.1',
    handler: async ( req, res ) => {
      res.send( 200, await ArticleControl.update(req.params, req.body) );
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
