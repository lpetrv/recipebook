import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  collapsed = true;
  isAuthenticated = false;
  // @Output() featureSelected = new EventEmitter<string>();
  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

  constructor( private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select('auth').pipe(map(authState => {
      return authState.user;
    })).subscribe( user => {
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });

  }
  onSaveData() {
    // this.dsService.storeRecipes();
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }
  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  onLogOut() {
    this.store.dispatch(new AuthActions.LogOut());

  }

}
