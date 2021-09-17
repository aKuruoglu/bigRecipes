import { Schema } from 'mongoose';
import idValidator from 'mongoose-id-validator';

import db from '../../components/db';

const recipe = new Schema( {
  title: {
    type: String,
    required: true,
  },
  description: {
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

recipe.plugin( idValidator, {
  connection: db.db,
  allowDuplicates: true,
} );
recipe.index( { title: 1 } );

export default recipe;
