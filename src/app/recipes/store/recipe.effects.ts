import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()

export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(ofType(RecipesActions.FETCH_RECIPES),
    switchMap(fetchAction => {
      return this.http.get<Recipe[]>('https://myrecipebook-9863d.firebaseio.com/recipes.json');
    }),
    map( responseData => {
      return responseData.map( rec => {
        return {...rec, ingredients: rec.ingredients ? rec.ingredients : []};
      });

    }),
    map(recipes => {
       return new RecipesActions.SetRecipes(recipes);
    })
  );
  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://myrecipebook-9863d.firebaseio.com/recipes.json',
        recipesState.recipes);

    }));


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
