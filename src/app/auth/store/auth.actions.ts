import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] LOGIN_START';
export const  AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = '[AUTH] LOGIN_FAIL';
export const SIGNUP_START = '[Auth] SIGNUP_START';
export const  LOG_OUT = '[Auth] LOG_OUT';
export const CLEAR_ERROR = '[Auth] CLEAR_ERROR';
export const AUTO_LOGIN = 'AUTO_LOGIN';


export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(public payLoad: {
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }) {}
}
export class LogOut implements Action {
  readonly type = LOG_OUT;
}
export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: {email: string; password: string}) {}
}
export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}
export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payLoad: string) {}
}
export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payLoad: {email: string; password: string}) {}
}
export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}


export type AuthActions =
  AuthenticateSuccess |
  LogOut |
  LoginStart |
  AuthenticateFail |
  SignupStart |
  ClearError |
  AutoLogin;
