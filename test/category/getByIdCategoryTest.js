import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Getting category by id', () => {
  let category;
  let article;
  let recipe;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;
    category = await categoryModel.create(categoryObj);
    category._id = category._id.toString();

    const articleObj = {
      title: 'wewer',
      description: 'rewrew',
      mainText: 'rewerwer',
      categoryId: category._id,
    };
    const articleModel = await require('entity/article/model').default;
    article = await articleModel.create(articleObj);

    const recipeObj = {
      title: 'wewer',
      description: 'rewrew',
      categoryId: category._id,
    };
    const recipeModel = await require('entity/recipe/model').default;
    recipe = await recipeModel.create(recipeObj);
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const articleModel = await require('entity/article/model').default;
    const recipeModel = await require('entity/recipe/model').default;

    await categoryModel.model.deleteOne({ _id: category._id });
    await articleModel.model.deleteOne({ _id: article._id });
    await recipeModel.model.deleteOne({ _id: recipe._id });
  });

  describe('get category success', () => {
    it('it should return category by id',  async () => {

      const res = await chai.request('http://localhost:4001')
        .get(`/category/${category._id}`);

      const { _id, name, parentCategoryId, recipesCount, articlesCount } = res.body;

      expect(_id).to.equal(category._id);
      expect(name).to.equal(category.name);
      expect(parentCategoryId).to.equal(category.parentCategoryId);
      expect(recipesCount).to.equal(1);
      expect(articlesCount).to.equal(1);
    });
  });

});
