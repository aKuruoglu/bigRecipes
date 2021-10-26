import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Adding article', () => {
  let category;
  let addArticle;
  before(async () => {
    const data = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const model = await require('entity/category/model').default;
    category = await model.create(data);

    category._id = category._id.toString();
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    await articleModel.model.deleteOne({ _id: addArticle._id });
    await categoryModel.model.deleteOne({ _id: category._id });
  });

  describe('add article success', () => {
    it('it should add article',  async () => {
      const article = {
        title: 'wewer',
        description: 'rewrew',
        mainText: 'rewerwer',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);
      addArticle = res.body;

      const { title, description, mainText, categoryId } = addArticle;

      expect(title).to.equal(article.title);
      expect(description).to.equal(article.description);
      expect(mainText).to.equal(article.mainText);
      expect(categoryId).to.equal(category._id);
    });
  });

  describe('add article failed', () => {
    it('it add article without mainText',  async () => {
      const article = {
        title: 'wewer',
        description: 'rewrew',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'mainText\' field is required.');
    });

    it('it add article without title',  async () => {
      const article = {
        description: 'rewrew',
        mainText: 'rewerwer',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'title\' field is required.');
    });

    it('it add article without description',  async () => {
      const article = {
        title: 'wewer',
        mainText: 'rewerwer',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'description\' field is required.');
    });

    it('it add article without categoryId',  async () => {
      const article = {
        title: 'wewer',
        mainText: 'rewerwer',
        description: 'rewrew',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field is required.');
      expect(sort[1].message).to.equal('There is no such category');
    });

    it('it adding article with an incorrect categoryId',  async () => {
      const article = {
        title: 'wewer',
        mainText: 'rewerwer',
        description: 'rewrew',
        categoryId: '6130dfe75436a11e872603c3',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/article')
        .send(article);

      const { status, body: [{ message }] } = res;

      expect(status).to.equal(404);
      expect(message).to.equal('There is no such category');
    });
  });
});
