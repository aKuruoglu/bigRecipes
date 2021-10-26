import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Getting recipes by category', () => {
  let category;
  let recipe1;
  let recipe2;
  let recipe3;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    category = await categoryModel.create(categoryObj);

    const recipeObj = {
      title: 'wewer',
      description: 'rewrew',
      categoryId: category._id,
    };

    recipe1 = await recipeModel.create(recipeObj);
    recipe2 = await recipeModel.create(recipeObj);
    recipe3 = await recipeModel.create(recipeObj);

    category._id = category._id.toString();
    recipe1._id = recipe1._id.toString();
    recipe2._id = recipe2._id.toString();
    recipe3._id = recipe3._id.toString();

    await recipeModel.delete(recipe2._id);
    await recipeModel.delete(recipe3._id);
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    await categoryModel.model.deleteOne({ _id: category._id });
    await recipeModel.model.deleteOne({ _id: recipe1._id });
    await recipeModel.model.deleteOne({ _id: recipe2._id });
    await recipeModel.model.deleteOne({ _id: recipe3._id });
  });

  describe('get recipes by category success', () => {
    it('it should return recipes by category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/recipe/category/${category._id}/0/10`);
      const { entities, total } = res.body;

      expect(entities).to.have.lengthOf(1);
      expect(total).to.equal(1);
    });
  });

  describe('get recipe failed', () => {
    it('it get recipe with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/category/12/0/10');

      const { status, body } = res;
      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such category');
    });

    it('it get recipe not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/category/6137674024ced5b9481fef5e/0/10');

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });

    it('it won\'t return deleted recipes',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/0/10');
      const { entities, total } = res.body;

      expect(entities).to.have.lengthOf(1);
      expect(total).to.equal(1);
    });

    it('it won\'t return recipes, page < 0',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/-1/10');

      const { body:[{ message }] } = res;

      expect(message).to.equal('Page cannot be less than 0');
    });

    it('it won\'t return recipes, limit < 1',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/0/0');

      const { body:[{ message }] } = res;

      expect(message).to.equal('Limit cannot be less than 1');
    });
  });
});
