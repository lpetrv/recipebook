import {Component, OnInit, OnDestroy} from '@angular/core';
import { Recipe } from '../recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[];
  recipeSubscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.recipeSubscription = this.store.select('recipes').
    pipe(map(recipesState => {
      return recipesState.recipes;
    })).
    subscribe(
    (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );

  }
  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});

  }

  // onRecipeSelected(recipe: Recipe) {
  //   this.recipeWasSelected.emit(recipe);
  //
  // }
  ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
  }

}