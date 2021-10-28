import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Deleting category', () => {
  let categoryFirst;
  let categorySecond;
  let categoryThird;
  let recipe1;
  let recipe2;
  let recipe3;
  let article2;
  let article3;

  before(async () => {
    const first = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryControl = await require('entity/category/control').default;

    categoryFirst = await categoryControl.create(first);
    categoryFirst._id = categoryFirst._id.toString();

    const second = {
      name: 'TestCategory',
      parentCategoryId: categoryFirst._id,
    };
    categorySecond = await categoryControl.create(second);
    categorySecond._id = categorySecond._id.toString();

    const third = {
      name: 'TestCategory',
      parentCategoryId: categorySecond._id,
    };
    categoryThird = await categoryControl.create(third);
    categoryThird._id = categoryThird._id.toString();

    const recipeModel = await require('entity/recipe/model').default;
    const recipeObj1 = {
      title: 'sdfsdf',
      description: 'werwer',
      categoryId: categoryFirst._id,
    };
    const recipeObj2 = {
      title: 'sdfsdf',
      description: 'werwer',
      categoryId: categorySecond._id,
    };
    const recipeObj3 = {
      title: 'sdfsdf',
      description: 'werwer',
      categoryId: categoryThird._id,
    };
    recipe1 = await recipeModel.create(recipeObj1);
    recipe2 = await recipeModel.create(recipeObj2);
    recipe3 = await recipeModel.create(recipeObj3);

    const articleControl = await require('entity/article/control').default;

    const articleObj2 = {
      title: 'wewer',
      description: 'rewrew',
      mainText: 'rewerwer',
      categoryId: categorySecond._id,
    };

    const articleObj3 = {
      title: 'wewer',
      description: 'rewrew',
      mainText: 'rewerwer',
      categoryId: categoryThird._id,
    };

    article2 = await articleControl.add(articleObj2);
    article3 = await articleControl.add(articleObj3);


  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const categoryWithCountModel = await require('entity/categoryWithCount/model').default;
    const recipeModel = await require('entity/recipe/model').default;
    const articleModel = await require('entity/article/model').default;

    await categoryModel.model.deleteOne({ _id: categoryFirst._id });
    await categoryModel.model.deleteOne({ _id: categorySecond._id });
    await categoryModel.model.deleteOne({ _id: categoryThird._id });

    await categoryWithCountModel.model.deleteOne({ _id: categoryFirst._id });
    await categoryWithCountModel.model.deleteOne({ _id: categorySecond._id });
    await categoryWithCountModel.model.deleteOne({ _id: categoryThird._id });

    await recipeModel.model.deleteOne({ _id: recipe1._id });
    await recipeModel.model.deleteOne({ _id: recipe2._id });
    await recipeModel.model.deleteOne({ _id: recipe3._id });

    await articleModel.model.deleteOne({ _id: article2._id });
    await articleModel.model.deleteOne({ _id: article3._id });

  });

  describe('delete category success', () => {
    it('it should delete category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .del(`/category/${categorySecond._id}`)
        .send({});
      const { name, parentCategoryId } = res.body;

      expect(name).to.equal(categorySecond.name);
      expect(parentCategoryId).to.equal(categoryFirst._id);

      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;
      const categoryCount = await categoryWithCountModel.model.find({ _id: categorySecond._id });

      expect(categoryCount[0].name).to.equal(name);
      expect(categoryCount[0].parentCategoryId.toString()).to.equal(parentCategoryId);
      expect(categoryCount[0].isDeleted).to.equal(true);
    });

    it('it should get category with parentCategoryId categoryFirst',  async () => {
      const res = await chai.request('http://localhost:4001')
        .get(`/category/${categoryThird._id}`);
      const { name, parentCategoryId } = res.body;

      expect(name).to.equal(categoryThird.name);
      expect(parentCategoryId).to.equal(categoryFirst._id);

      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;
      const categoryCount = await categoryWithCountModel.model.find({ _id: categoryThird._id });

      expect(categoryCount[0].name).to.equal(categoryThird.name);
      expect(categoryCount[0].parentCategoryId.toString()).to.equal(categoryFirst._id);
      expect(categoryCount[0].isDeleted).to.equal(false);
    });

    it('it should not get recipe, was deleted category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/recipe/${recipe2._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such recipe');
    });

    it('it should get recipe after delete category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/recipe/${recipe3._id}`);

      const { title, description, categoryId } = res.body;

      expect(title).to.equal(recipe3.title);
      expect(description).to.equal(recipe3.description);
      expect(categoryId).to.equal(categoryThird._id);
    });

    it('it should not get article, was deleted category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/article/${article2._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such article');
    });

    it('it should get article after delete category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/article/${article3._id}`);

      const { title, description, mainText, categoryId } = res.body;

      expect(title).to.equal(article3.title);
      expect(description).to.equal(article3.description);
      expect(mainText).to.equal(article3.mainText);
      expect(categoryId).to.equal(categoryThird._id);
    });
  });

  describe('delete category failed', () => {

    it('it delete category with an incorrect _id',  async () => {
      const categoryObj = {
        _id: '61695b60dd6fe636c1a78db1',
        name: 'wewer',
        parentCategoryId: '61695b60dd6fe636c1a78db0',
      };

      const res = await chai.request('http://localhost:4001')
        .del(`/category/${categoryObj._id}`)
        .send({});

      const { status, body: [{ message }] } = res;

      expect(status).to.equal(404);
      expect(message).to.equal('There is no such category');
    });

    it('it delete category with _id which not ObjectId',  async () => {
      const categoryObj = {
        _id: '61695b60dd6fe636c1a78db',
        name: 'wewer',
        parentCategoryId: '61695b60dd6fe636c1a78db0',
      };

      const res = await chai.request('http://localhost:4001')
        .del(`/category/${categoryObj._id}`)
        .send({});
      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such category');
    });
  });
});
