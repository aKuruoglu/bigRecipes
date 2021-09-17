import { omit } from 'lodash';

const toDelete = ['isDeleted'];
export const cleanData =  ( obj ) => omit(obj, toDelete);


export const buildCategoryTree = (array) => {
  const categoriesMap = new Map(array.map((item) => [String(item._id), item]));
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (!item.parentCategoryId) {
      result.push(item);
      continue;
    }

    if (!categoriesMap.has(String(item.parentCategoryId))) {
      continue;
    }

    const parent = categoriesMap.get(String(item.parentCategoryId));
    parent.children = parent.children || [];
    parent.children.push(item);
  }

  return result;
};