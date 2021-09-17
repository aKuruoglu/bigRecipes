import { Schema } from 'mongoose';

const category = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
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

}, {
  typePojoToMixed: false,
  versionKey: false,
});



export default category;
