import RecipeModel from 'entity/recipe/model';
import RecipeCheck from 'entity/recipe/validateSchema';
import CategoryCheck from 'entity/category/validateSchema';

class RecipeControl {
  async create (body = {}) {
    const { categoryId } = body;
    await CategoryCheck.existId(categoryId);
    await RecipeCheck.create(body);
    return RecipeModel.create(body);
  }

  async delete ({ _id }) {
    await RecipeCheck.existId(_id);
    return RecipeModel.delete(_id);
  }

  async getByCategory ({ categoryId, page, limit  }) {
    await CategoryCheck.existId(categoryId);
    await RecipeCheck.paginate(page, limit);
    const count = await RecipeModel.getCountEntityByCategory(categoryId);
    const entities = await RecipeModel.getByCategory(categoryId, +page, +limit);
    return {
      entities,
      total: count,
    };
  }

  async getAll ({ page, limit }) {
    await RecipeCheck.paginate(page, limit);
    const count = await RecipeModel.getCountEntity();
    const entities = await RecipeModel.getAllOfEntity(+page, +limit);
    return {
      entities,
      total: count,
    };
  }

  async getById ({ _id }) {
    await RecipeCheck.existId(_id);
    return RecipeModel.getById(_id);
  }

  async updateCategory ({ _id, categoryId } = {}) {
    await RecipeCheck.existId(_id);
    await CategoryCheck.existId(categoryId);
    return RecipeModel.updateCategory({ _id, categoryId });
  }

  async update ({ _id } = {}, body = {}) {
    await RecipeCheck.update({ _id, ...body });
    return RecipeModel.update(_id, body);
  }

}

export default new RecipeControl();
