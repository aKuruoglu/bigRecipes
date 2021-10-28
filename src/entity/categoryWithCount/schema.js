import { Schema } from 'mongoose';
import idValidator from 'mongoose-id-validator';

import db from '../../components/db';

const categoryWithCount = new Schema( {
  _id: {
    type: Schema.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  parentCategoryId: {
    type: Schema.ObjectId,
    index: true,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  articlesCount: {
    type: Number,
    required: true,
    default: 0,
  },
  recipesCount: {
    type: Number,
    required: true,
    default: 0,
  },

}, {
  typePojoToMixed: false,
  versionKey: false,
} );

categoryWithCount.plugin( idValidator, {
  connection: db.db,
  allowDuplicates: true,
} );
categoryWithCount.index( { title: 1 } );

export default categoryWithCount;
