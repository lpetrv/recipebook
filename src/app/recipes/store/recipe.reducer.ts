import {Recipe} from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}
const initialState: State = {
  recipes: []
}


export function recipeReducer(state = initialState, action: RecipesActions.RecipesActions) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payLoad]
      };
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payLoad]
      };
    case RecipesActions.EDIT_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payLoad.index],
        ...action.payLoad.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payLoad.index] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes

      };
    case  RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payLoad;
        })
      };
    default:
      return state;

  }

}
