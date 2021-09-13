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
}, {
  typePojoToMixed: false,
  versionKey: false,
});



export default category;
