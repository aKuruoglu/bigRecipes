import { cleanData } from '../utils';

class Query {
  constructor (model) {
    this.model = model;
  }

  async create (body) {
    const object = await this.model.create(body);
    return cleanData(object.toJSON());
  }

  delete (_id) {
    return this.model.findOneAndUpdate({ _id }, { isDeleted: true }, {
      returnOriginal: false,
      fields: { isDeleted: 0 },
    }).lean();
  }

  getById (_id) {
    return this.model.findOne({ _id, isDeleted: false }, {
      isDeleted: 0,
    }).lean();
  }

  update (_id, toUpdate) {
    return this.model.findOneAndUpdate({
      _id,
      isDeleted: false,
    },
    toUpdate,
    {
      returnOriginal: false,
      fields: {
        isDeleted: 0,
      },
    }).lean();
  }

  getCountEntity () {
    return this.model.count({
      type: '_id',
      isDeleted: false,
    });
  }

  getAllOfEntity (page = 0, limit) {
    // if (page < 0) {
    //   page = 0;
    // }
    const skip = page * limit;

    return this.model.find({
      isDeleted: false,
    },
    {
      isDeleted: 0,
    },
    {
      skip, limit,
    },
    );
  }


  async isExist (_id) {
    const existEntity = await this.getById(_id);
    return !!existEntity;
  }
}

export default Query;