import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Updating category', () => {
  let categoryFirst;
  let categorySecond;
  let categoryThird;
  let categoryFourth;

  before(async () => {
    const categoryObj = {
      name: 'TestCategory',
      parentCategoryId: null,
    };

    const categoryModel = await require('entity/category/model').default;

    categoryFirst = await categoryModel.create(categoryObj);
    categoryFirst._id = categoryFirst._id.toString();

    const categoryObjSecond = {
      name: 'TestCategory',
      parentCategoryId: categoryFirst._id,
    };
    categorySecond = await categoryModel.create(categoryObjSecond);
    categorySecond._id = categorySecond._id.toString();

    const categoryObjThird = {
      name: 'TestCategory',
      parentCategoryId: categorySecond._id,
    };
    categoryThird = await categoryModel.create(categoryObjThird);
    categoryThird._id = categoryThird._id.toString();

    categoryFourth = await categoryModel.create(categoryObjThird);
    categoryFourth._id = categoryFourth._id.toString();
    await categoryModel.delete(categoryFourth._id);
  });

  after(async () => {
    const categoryModel = await require('entity/category/model').default;

    await categoryModel.model.deleteOne({ _id: categoryFirst._id });
    await categoryModel.model.deleteOne({ _id: categorySecond._id });
    await categoryModel.model.deleteOne({ _id: categoryThird._id });
    await categoryModel.model.deleteOne({ _id: categoryFourth._id });
  });

  describe('Update category success', () => {
    it('it should update category',  async () => {
      const toUpdateObj = {
        ...categoryFirst,
        name: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/category/${categoryFirst._id}`)
        .send(toUpdateObj);

      const { name, parentCategoryId, _id } = res.body;

      expect(name).to.equal(toUpdateObj.name);
      expect(parentCategoryId).to.equal(toUpdateObj.parentCategoryId);
      expect(_id).to.equal(toUpdateObj._id.toString());
    });

    it('it should update parent category',  async () => {
      const toUpdateObj = {
        ...categorySecond,
        parentCategoryId: categoryFirst._id,
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/category/${categorySecond._id}`)
        .send(toUpdateObj);

      const { name, parentCategoryId, _id } = res.body;

      expect(name).to.equal(toUpdateObj.name);
      expect(parentCategoryId).to.equal(toUpdateObj.parentCategoryId);
      expect(_id).to.equal(toUpdateObj._id.toString());
    });
  });

  describe('update category failed', () => {
    it('it won\'t update category with id which not ObjectId',  async () => {
      const toUpdateObj = {
        ...categoryFirst,
        name: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put('/category/12')
        .send(toUpdateObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(2);
      expect(message).to.equal('The \'_id\' field must be an valid ObjectID');
    });

    it('it won\'t update category not found',  async () => {
      const toUpdateObj = {
        ...categoryFirst,
        name: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put('/category/6137674024ced5b9481fef5e')
        .send(toUpdateObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });

    it('it won\'t update category not found',  async () => {
      const toUpdateObj = {
        ...categoryFirst,
        name: '111',
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/category/${categoryFourth._id}`)
        .send(toUpdateObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(404);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('There is no such category');
    });

    it('it won\'t update parent category',  async () => {
      const toUpdateObj = {
        ...categorySecond,
        parentCategoryId: categoryThird._id,
      };

      const res = await chai.request('http://localhost:4001')
        .put(`/category/${categorySecond._id}`)
        .send(toUpdateObj);

      const { status, body: [{ message }], body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.lengthOf(1);
      expect(message).to.equal('Sorry you cannot change to the given parent category as it is a child category');
    });
  });
});
