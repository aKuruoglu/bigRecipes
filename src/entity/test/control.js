import testModel from 'entity/test/model';

class TestControl {
  create ({ test = '' } = {}) {
    return testModel.create({ test });
  }
}

export default new TestControl();
