import {User} from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}


const initialState: State = {
  user: null,
  authError: null,
  loading: false

};


export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(action.payLoad.email, action.payLoad.userId, action.payLoad.token, action.payLoad.expirationDate);
      return {
        ...state,
        authError: null,
        user: user,
      };
    case AuthActions.LOG_OUT:
      return {
        ...state,
        user: null,

      };
    // case AuthActions.LOGIN_START:
    //   return {
    //     ...state,
    //     authError: null,
    //     loading: true
    //   };
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payLoad,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;


  }

}
