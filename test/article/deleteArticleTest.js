import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Deleting article', () => {
  let category;
  let article;

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
    article = await articleModel.create(articleObj);

    category._id = category._id.toString();
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    await articleModel.model.deleteOne({ _id: article._id });
    await categoryModel.model.deleteOne({ _id: category._id });
  });

  describe('delete article success', () => {
    it('it should delete article',  async () => {
      const articleModel = await require('entity/article/model').default;

      const res = await chai.request('http://localhost:4001')
        .del(`/article/${article._id}`)
        .send({});

      const { title, description, mainText, categoryId, _id } = res.body;

      expect(title).to.equal(article.title);
      expect(description).to.equal(article.description);
      expect(mainText).to.equal(article.mainText);
      expect(categoryId).to.equal(category._id);
      expect(_id).to.equal(article._id.toString());

      const deletedArticle = await articleModel.model.find({ _id: article._id });
      const { isDeleted } = deletedArticle[0];
      expect(isDeleted).to.equal(true);
    });
  });

  describe('delete article failed', () => {
    it('it delete article with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .del('/article/12')
        .send({});

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such article');
    });

    it('it delete article not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .del('/article/6137674024ced5b9481fef5e')
        .send({});

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });

    it('it won\'t get deleted article not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/article/${article._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });
  });
});
