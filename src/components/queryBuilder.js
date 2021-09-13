import { cleanData } from 'components/utils';

class QueryBuilder {
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

  deleteAllByCategoryId ( categoryId ) {
    return this.model.updateMany( { categoryId }, { isDeleted: true } );
  }

  getByCategory ( categoryId ) {
    return this.model.find( {
      categoryId,
      isDeleted: false,
    },
    {
      isDeleted: 0,
    } ).lean();
  }

  getById ( _id ) {
    return this.model.findOne( { _id, isDeleted: false }, {
      isDeleted: 0,
    } ).lean();
  }

  updateCategory ( { categoryId, _id } ) {
    return this.model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    },
    {
      categoryId,
    },
    {
      returnOriginal: false,
      fields: {
        isDeleted: 0,
      },
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

  async checkExist ( _id ) {
    const existEntity = await this.getById( _id ).exec();
    return !!existEntity;
  }


}

export default QueryBuilder;