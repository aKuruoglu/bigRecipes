import { Schema } from 'mongoose';
import category from '../category/schema';

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
    $ref: [category],
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

recipe.index( { title: 1 } );

export default recipe;
