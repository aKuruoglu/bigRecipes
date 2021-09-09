import restify from 'components/restify';
import ArticleControl from 'entity/article/control';

restify.server.get('/article/:articleId', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res ) => {
      res.send(200, await ArticleControl.getArticleById(req.params));
    },
  },
]));

restify.server.get('/article/category/:categoryId', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res ) => {
      res.send(200, await ArticleControl.getAllArticleByCategory(req.params));
    },
  },
]));

restify.server.post('/article', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res ) => {
      res.send(200, await ArticleControl.articleCreate(req.body));
    },
  },
]));

restify.server.del('/article/:articleId', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      await ArticleControl.articleDelete(req.params);
      res.send( 200, { message: 'Successfully deleted' } );
    },
  },
]));

restify.server.put('/article', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      res.send( 200, await ArticleControl.updateArticle(req.body));
    },
  },
]));

restify.server.put('/article/category-update', restify.version([
  {
    version: '0.0.1',
    handler: async (req, res) => {
      await ArticleControl.updateCategory(req.body);
      res.send( 200, { message: 'Successfully update category' });
    },
  },
]));
