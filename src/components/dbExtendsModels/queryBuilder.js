import Query from 'components/dbExtendsModels/Query';

class QueryBuilder extends Query {
  constructor ( model ) {
    super( model );
    this.model = model;
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

  getAll () {
    return this.model.find( {
      isDeleted: false,
    },
    {
      isDeleted: 0,
    } ).lean();
  }
}


export default QueryBuilder;