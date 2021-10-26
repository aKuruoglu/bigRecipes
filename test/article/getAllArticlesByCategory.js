import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Getting articles by category', () => {
  let category;
  let article1;
  let article2;
  let article3;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    category = await categoryModel.create(categoryObj);

    const articleObj = {
      title: 'wewer',
      description: 'rewrew',
      mainText: 'rewerwer',
      categoryId: category._id,
    };

    article1 = await articleModel.create(articleObj);
    article2 = await articleModel.create(articleObj);
    article3 = await articleModel.create(articleObj);

    category._id = category._id.toString();
    article1._id = article1._id.toString();
    article2._id = article2._id.toString();
    article3._id = article3._id.toString();

    await articleModel.delete(article2._id);
    await articleModel.delete(article3._id);
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    await categoryModel.model.deleteOne({ _id: category._id });
    await articleModel.model.deleteOne({ _id: article1._id });
    await articleModel.model.deleteOne({ _id: article2._id });
    await articleModel.model.deleteOne({ _id: article3._id });
  });

  describe('get articles by category success', () => {
    it('it should return articles by category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/article/category/${category._id}/0/10`);
      const { entities, total } = res.body;

      expect(entities).to.have.lengthOf(1);
      expect(total).to.equal(1);
    });
  });

  describe('get article failed', () => {
    it('it get article with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/article/category/12/0/10');

      const { status, body } = res;
      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such category');
    });

    it('it get article not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/article/category/6137674024ced5b9481fef5e/0/10');

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });

    it('it won\'t return deleted articles',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/article/0/10');
      const { entities, total } = res.body;

      expect(entities).to.have.lengthOf(1);
      expect(total).to.equal(1);
    });

    it('it won\'t return articles, page < 0',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/article/-1/10');

      const { body:[{ message }] } = res;

      expect(message).to.equal('Page cannot be less than 0');
    });

    it('it won\'t return articles, limit < 1',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/article/0/0');

      const { body:[{ message }] } = res;

      expect(message).to.equal('Limit cannot be less than 1');
    });
  });
});
