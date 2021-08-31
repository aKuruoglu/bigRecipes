import db from 'components/db';

const model = db.models.test;

class TestModel {
  create ({ test }) {
    return model.create({ test });
  }
}

export default new TestModel();