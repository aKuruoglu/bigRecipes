import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Adding category', () => {
  let category;

  after(async () => {
    const categoryModel = await require('entity/category/model').default;
    await categoryModel.model.deleteOne({ _id: category.body._id });
  });

  describe('add category success', () => {
    it('it should add category',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: null,
      };

      category = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);

      const { name, parentCategoryId } = category.body;

      expect(name).to.equal(categoryObj.name);
      expect(parentCategoryId).to.equal(categoryObj.parentCategoryId);
    });
  });

  describe('add category failed', () => {
    it('it add category without name',  async () => {
      const categoryObj = {
        parentCategoryId: category._id,
      };

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('The \'name\' field is required.');
    });

    it('it adding category with an incorrect parentCategoryId',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: '61695b60dd6fe636c1a78db0',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);
      const { status, body: [{ message }] } = res;

      expect(status).to.equal(404);
      expect(message).to.equal('There is no such category');
    });

    it('it add category with parentCategoryId which not ObjectId',  async () => {
      const categoryObj = {
        name: 'wewer',
        parentCategoryId: '42',
      };

      const res = await chai.request('http://localhost:4001')
        .post('/category')
        .send(categoryObj);
      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      const sort = body.sort((a, b) => a.message - b.message);
      expect(sort[0].message).to.equal('The \'_id\' field must be an valid ObjectID');
      expect(sort[1].message).to.equal('There is no such category');
    });
  });
});
