import { Schema, mongoose } from 'mongoose';
const recipe = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.ObjectId,
    required: true,
  },
}, {
  typePojoToMixed: false,
  versionKey: false,
});

export default recipe;
