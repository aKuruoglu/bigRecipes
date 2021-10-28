import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Adding category', () => {
  let category;
  let categoryCount;


  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    const categoryWithCountModel = await require('entity/categoryWithCount/model').default;
    await categoryModel.model.deleteOne({ _id: category.body._id });
    await categoryWithCountModel.model.deleteOne({ _id: category.body._id });
  });

  describe('add category success', () => {
    it('it should add category',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: null,
      };
      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;

      category = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);

      const { name, parentCategoryId, _id } = category.body;

      expect(name).to.equal(categoryObj.name);
      expect(parentCategoryId).to.equal(categoryObj.parentCategoryId);

      categoryCount = await categoryWithCountModel.model.findOne({ _id });

      expect(categoryCount.name).to.equal(name);
      expect(categoryCount.parentCategoryId).to.equal(parentCategoryId);
      expect(categoryCount._id.toString()).to.equal(_id);
      expect(categoryCount.articlesCount).to.equal(0);
      expect(categoryCount.recipesCount).to.equal(0);


    });
  });

  describe('add category failed', () => {
    it('it add category without name',  async () => {
      const categoryObj = {
        parentCategoryId: category._id,
      };
      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'name\' field is required.');

      categoryCount = await categoryWithCountModel.model.find({});
      expect(categoryCount).to.have.lengthOf(1);
    });

    it('it adding category with an incorrect parentCategoryId',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: '61695b60dd6fe636c1a78db0',
      };
      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);
      const { status, body: [{ message }] } = res;

      expect(status).to.equal(404);
      expect(message).to.equal('There is no such category');

      categoryCount = await categoryWithCountModel.model.find({});
      expect(categoryCount).to.have.lengthOf(1);
    });

    it('it add category with parentCategoryId which not ObjectId',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: '42',
      };
      const categoryWithCountModel = await require('entity/categoryWithCount/model').default;

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);
      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such category');

      categoryCount = await categoryWithCountModel.model.find({});
      expect(categoryCount).to.have.lengthOf(1);
    });
  });
});
