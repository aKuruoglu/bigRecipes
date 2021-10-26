import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Updating article', () => {
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

    await categoryModel.model.deleteOne({ _id: category._id });
    await articleModel.model.deleteOne({ _id: article._id });
  });

  describe('Update article success', () => {
    it('it should update article',  async () => {
      const toUpdateObj = {
        ...article,
        mainText: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/article/${article._id}`)
        .send(toUpdateObj);

      const { title, description, mainText, categoryId, _id } = res.body;

      expect(title).to.equal(toUpdateObj.title);
      expect(description).to.equal(toUpdateObj.description);
      expect(mainText).to.equal(toUpdateObj.mainText);
      expect(categoryId).to.equal(category._id);
      expect(_id).to.equal(toUpdateObj._id.toString());
    });
  });

  describe('update article failed', () => {
    it('it won\'t update article category with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put('/article/12');

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);

      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such article');
    });

    it('it won\'t update article category not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put('/article/6137674024ced5b9481fef5e');

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });

    it('it won\'t update article category not found',  async () => {
      const articleModel = await require('entity/article/model').default;
      await articleModel.delete(article._id);

      const res = await chai.request('http://localhost:4001')
        .put(`/article/${article._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });
  });
});
