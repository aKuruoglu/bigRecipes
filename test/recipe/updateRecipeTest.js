import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Updating recipe', () => {
  let category;
  let recipe;

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
    recipe = await recipeModel.create(recipeObj);

    category._id = category._id.toString();
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    await categoryModel.model.deleteOne({ _id: category._id });
    await recipeModel.model.deleteOne({ _id: recipe._id });
  });

  describe('Update recipe success', () => {
    it('it should update recipe',  async () => {
      const toUpdateObj = {
        ...recipe,
        description: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/${recipe._id}`)
        .send(toUpdateObj);

      const { title, description, categoryId, _id } = res.body;

      expect(title).to.equal(toUpdateObj.title);
      expect(description).to.equal(toUpdateObj.description);
      expect(categoryId).to.equal(category._id);
      expect(_id).to.equal(toUpdateObj._id.toString());
    });
  });

  describe('update recipe failed', () => {
    it('it won\'t update recipe category with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put('/recipe/12');

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such recipe');
    });

    it('it won\'t update recipe category not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put('/recipe/6137674024ced5b9481fef5e');

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such recipe');
    });

    it('it won\'t update recipe category not found',  async () => {
      const recipeModel = await require('entity/recipe/model').default;
      await recipeModel.delete(recipe._id);

      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/${recipe._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such recipe');
    });
  });
});
