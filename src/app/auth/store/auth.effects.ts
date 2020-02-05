import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import * as RecipesActions from '../../recipes/store/recipe.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user.model';
import {AuthService} from '../auth.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;

}
const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email, userId, token, expirationDate, redirect: true
  });

};

const handleError = (errorRes: any) => {
  let errorMessage = 'Unknown error occur!!!';
  if (!errorRes || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS': errorMessage = 'This email exists already!!!';
                         break;
    case 'EMAIL_NOT_FOUND': errorMessage = 'Email not found!!!';
                            break;
    case 'INVALID_PASSWORD': errorMessage = 'The entered password is incorrect!!!';
                             break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));

};
@Injectable()
export class AuthEffects {
 @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIkey,
        {email: signupAction.payLoad.email, password: signupAction.payLoad.password, returnSecureToken: true}
      ).pipe(tap(resData => {
        this.authService.setLogOutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);

        }),
        catchError(errorRes => {
          return handleError(errorRes);

        }));

    })
  );
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    tap(() => {
     // this.actions$.pipe(ofType(RecipesActions.FETCH_RECIPES));
      // return this.store.dispatch(new RecipesActions.FetchRecipes());
    }),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIkey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(tap(resData => {
           this.authService.setLogOutTimer(+resData.expiresIn * 1000);
      }),
        map(resData => {
          // this.actions$.pipe(ofType(RecipesActions.FETCH_RECIPES));

          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);

        }));
    })
  );
  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payLoad.redirect) {
        this.router.navigate(['/']);
      }
      this.store.dispatch(new RecipesActions.FetchRecipes());
    })
  );
  @Effect()
  autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'Dummy'};
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogOutTimer(expirationDuration);
        // this.user.next(loadedUser);
        return new AuthActions.AuthenticateSuccess({email: loadedUser.email,
          userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false});
        // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogOut(expirationDuration);
        // // console.log(userData);
        //  this.dsService.fetchRecipes().subscribe();
      }
      return {type: 'Dummy'};
    })
    );
 @Effect({dispatch: false})
 authLogout = this.actions$.pipe(ofType(AuthActions.LOG_OUT), tap(() => {
   this.router.navigate(['/auth']);
   this.authService.clearLogoutTimer();
   localStorage.removeItem('userData');


 }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {}
}
