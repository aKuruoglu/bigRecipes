import { Schema, mongoose } from 'mongoose';
const category = new Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategoryId: {
    type: mongoose.ObjectId,
    required: true,
  },
}, {
  typePojoToMixed: false,
  versionKey: false,
});

export default category;
