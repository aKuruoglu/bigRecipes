import { cleanData } from '../utils';

class Query {
  constructor ( model ) {
    this.model = model;
  }

  async create ( body ) {
    const object = await this.model.create( body );
    return cleanData( object.toJSON() );
  }

  delete ( _id ) {
    return this.model.findOneAndUpdate( { _id }, { isDeleted: true }, {
      returnOriginal: false,
      fields: { isDeleted: 0 },
    } ).lean();
  }

  getById ( _id ) {
    return this.model.findOne( { _id, isDeleted: false }, {
      isDeleted: 0,
    } ).lean();
  }

  update ( _id, toUpdate ) {
    return this.model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    },
    toUpdate,
    {
      returnOriginal: false,
      fields: {
        isDeleted: 0,
      },
    } ).lean();
  }


  async isExist ( _id ) {
    const existEntity = await this.getById( _id );
    return !!existEntity;
  }
}

export default Query;