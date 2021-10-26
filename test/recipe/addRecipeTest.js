import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Adding recipe', () => {
  let category;
  let addRecipe;
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
    const recipeModel = await require('entity/recipe/model').default;

    await categoryModel.model.deleteOne({ _id: category._id });
    await recipeModel.model.deleteOne({ _id: addRecipe.body._id });
  });

  describe('add recipe success', () => {
    it('it should add recipe',  async () => {
      const recipe = {
        title: 'wewer',
        description: 'rewrew',
        categoryId: category._id,
      };

      addRecipe = await chai.request('http://localhost:4001')
        .post('/recipe')
        .send(recipe);

      const { title, description, categoryId } = addRecipe.body;

      expect(title).to.equal(recipe.title);
      expect(description).to.equal(recipe.description);
      expect(categoryId).to.equal(category._id);
    });
  });

  describe('add recipe failed', () => {
    it('it add recipe without description',  async () => {
      const recipe = {
        title: 'wewer',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/recipe')
        .send(recipe);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'description\' field is required.');
    });

    it('it add recipe without title',  async () => {
      const recipe = {
        description: 'rewrew',
        categoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/recipe')
        .send(recipe);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'title\' field is required.');
    });


    it('it add recipe without categoryId',  async () => {
      const recipe = {
        title: 'wewer',
        description: 'rewrew',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/recipe')
        .send(recipe);

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field is required.');
      expect(sort[1].message).to.equal('There is no such category');
    });

    it('it adding recipe with an incorrect categoryId',  async () => {
      const recipe = {
        title: 'wewer',
        mainText: 'rewerwer',
        description: 'rewrew',
        categoryId: '6130dfe75436a11e872603c3',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/recipe')
        .send(recipe);

      const { status, body: [{ message }] } = res;

      expect(status).to.equal(404);
      expect(message).to.equal('There is no such category');
    });
  });
});
