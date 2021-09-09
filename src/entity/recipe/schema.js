import { Schema } from 'mongoose';

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
