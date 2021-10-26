import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Getting all recipes', () => {
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

  describe('get all recipes success', () => {
    it('it should return recipes',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get('/recipe/0/10');
      const { entities, total } = res.body;

      expect(entities).to.have.lengthOf(1);
      expect(total).to.equal(1);
    });
  });

  describe('get all recipes failed', () => {
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
