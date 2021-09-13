import { cleanData } from 'components/utils';

class QueryBuilder {
  constructor ( model ) {
    this.model = model;
  }

  async entityCreate ( body ) {
    const object = await this.model.create( body );
    return cleanData( object.toJSON() );
  }

  entityDelete ( _id ) {
    return this.model.findOneAndUpdate( { _id }, { isDeleted: true }, {
      returnOriginal: false,
      fields: { isDeleted: 0 },
    } ).lean();
  }

  entityGetByCategory ( categoryId ) {
    return this.model.find( { categoryId, isDeleted: false }, {
      isDeleted: 0,
    } ).lean();
  }

  entityGetById ( _id ) {
    return this.model.findOne( { _id, isDeleted: false }, {
      isDeleted: 0,
    } ).lean();
  }

  entityUpdateCategory ( { categoryId, _id } ) {
    return this.model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    }, { categoryId }, { returnOriginal: false, fields: { isDeleted: 0 } } ).lean();
  }

  entityUpdate ( _id, toUpdate ) {
    return this.model.findOneAndUpdate( {
      _id,
      isDeleted: false,
    }, toUpdate, { returnOriginal: false, fields: { isDeleted: 0 } } ).lean();
  }

  async entityExist ( _id ) {
    const existEntity = await this.model.findOne( { _id, isDeleted: false } ).exec();
    return !!existEntity;
  }


}

export default QueryBuilder;