import Query from 'components/dbExtendsModels/Query';

class QueryBuilder extends Query {
  constructor ( model ) {
    super( model );
    this.model = model;
  }

  deleteAllByCategoryId ( categoryId ) {
    return this.model.updateMany( { categoryId }, { isDeleted: true } );
  }

  getCountEntityByCategory (categoryId) {
    return this.model.count({
      isDeleted: false,
      categoryId,
    });
  }

  getByCategory ( categoryId, page = 0, limit ) {
    const skip = page * limit;
    return this.model.find( {
      categoryId,
      isDeleted: false,
    },
    {
      isDeleted: 0,
    },
    {
      skip,
      limit,
    },
    );
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