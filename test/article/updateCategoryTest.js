import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Updating article category', () => {
  let categoryFirst;
  let categorySecond;
  let categoryThird;
  let article;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    categoryFirst = await categoryModel.create(categoryObj);
    categorySecond = await categoryModel.create(categoryObj);
    categoryThird = await categoryModel.create(categoryObj);

    const articleObj = {
      title: 'wewer',
      description: 'rewrew',
      mainText: 'rewerwer',
      categoryId: categoryFirst._id,
    };
    article = await articleModel.create(articleObj);

    categoryFirst._id = categoryFirst._id.toString();
    categorySecond._id = categorySecond._id.toString();
    categoryThird._id = categoryThird._id.toString();

    await categoryModel.delete(categoryThird._id);

    article._id = article._id.toString();
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;

    await categoryModel.model.deleteOne({ _id: categoryFirst._id });
    await categoryModel.model.deleteOne({ _id: categorySecond._id });
    await categoryModel.model.deleteOne({ _id: categoryThird._id });
    await articleModel.model.deleteOne({ _id: article._id });
  });

  describe('Update article category success', () => {
    it('it should update article category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/article/${article._id}/change-category/${categorySecond._id}`);

      const { title, description, mainText, categoryId, _id } = res.body;

      expect(title).to.equal(article.title);
      expect(description).to.equal(article.description);
      expect(mainText).to.equal(article.mainText);
      expect(categoryId).to.equal(categorySecond._id);
      expect(_id).to.equal(article._id);
    });
  });

  describe('update article category failed', () => {
    it('it won\'t update article with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/article/12/change-category/${categorySecond._id}`);

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);

      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such article');
    });

    it('it won\'t update article  not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/article/6137674024ced5b9481fef5e/change-category/${categorySecond._id}`);
      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });

    it('it won\'t update article category not found',  async () => {
      const res = await chai.request('http://localhost:4001')
        .put(`/article/${article._id}/change-category/${categoryThird._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });
  });
});
