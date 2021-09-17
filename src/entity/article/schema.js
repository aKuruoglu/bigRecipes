import { Schema } from 'mongoose';
import idValidator from 'mongoose-id-validator';

import db from 'components/db';

const article = new Schema( {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mainText: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.ObjectId,
    ref: 'category',
    required: true,
    index: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  typePojoToMixed: false,
  versionKey: false,
} );

article.plugin( idValidator, {
  connection: db.db,
  allowDuplicates: true,
} );

article.index( { title: 1, description: 1, isDeleted: 1 } );

export default article;