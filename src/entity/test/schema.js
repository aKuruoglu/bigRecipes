import { Schema } from 'mongoose';

const test = new Schema({
  test: {
    type: String,
    required: true,
  },
}, {
  typePojoToMixed: false,
  versionKey: false,
});

export default test;
