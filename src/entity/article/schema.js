import { Schema, mongoose } from 'mongoose';
const article = new Schema({
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
    type: mongoose.ObjectId,
    required: true,
  },
}, {
  typePojoToMixed: false,
  versionKey: false,
});

export default article;