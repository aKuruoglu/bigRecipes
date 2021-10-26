import { omit } from 'lodash';

const toDelete = ['isDeleted'];
export const cleanData =  ( obj ) => omit(obj, toDelete);
