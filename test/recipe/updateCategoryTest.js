import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Updating recipe category', () => {
  let categoryFirst;
  let categorySecond;
  let categoryThird;
  let recipe;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    categoryFirst = await categoryModel.create(categoryObj);
    categorySecond = await categoryModel.create(categoryObj);
    categoryThird = await categoryModel.create(categoryObj);

    const recipeObj = {
      title: 'wewer',
      description: 'rewrew',
      categoryId: categoryFirst._id,
    };
    recipe = await recipeModel.create(recipeObj);

    categoryFirst._id = categoryFirst._id.toString();
    categorySecond._id = categorySecond._id.toString();
    categoryThird._id = categoryThird._id.toString();
    recipe._id = recipe._id.toString();

    await categoryModel.delete(categoryThird._id);
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    await categoryModel.model.deleteOne({ _id: categoryFirst._id });
    await categoryModel.model.deleteOne({ _id: categorySecond._id });
    await categoryModel.model.deleteOne({ _id: categoryThird._id });
    await recipeModel.model.deleteOne({ _id: recipe._id });
  });

  describe('Update recipe category success', () => {
    it('it should update recipe category',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/${recipe._id}/change-category/${categorySecond._id}`);

      const { title, description, categoryId, _id } = res.body;

      expect(title).to.equal(recipe.title);
      expect(description).to.equal(recipe.description);
      expect(categoryId).to.equal(categorySecond._id);
      expect(_id).to.equal(recipe._id);
    });
  });

  describe('update recipe category failed', () => {
    it('it won\'t update recipe with id which not ObjectId',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/12/change-category/${categorySecond._id}`);

      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such recipe');
    });

    it('it won\'t update recipe not found',  async () => {

      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/6137674024ced5b9481fef5e/change-category/${categorySecond._id}`);
      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such recipe');
    });

    it('it won\'t update recipe category not found',  async () => {
      const res = await chai.request('http://localhost:4001')
        .put(`/recipe/${recipe._id}/change-category/${categoryThird._id}`);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });
  });
});
