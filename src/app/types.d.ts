/* eslint-disable @typescript-eslint/no-empty-object-type */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    }
  }
}

export interface IPhraseData {
  text: string;
  author: string;
}

export interface IPhrase extends Array<IPhraseData> {}

export interface DefaultResponse {
  message: string;
}

export interface IssueTokenResponse extends DefaultResponse {
  data: {
    access_token: string;
    expires_at: number;
  };
}

export interface IUserInfo {
  id: number;
  user_id: string;
  email: string;
  profile_image: string;
  created_at: number;
  permission: number;
}

export interface ILoginAuthForm {
  user_id: string;
  passphrase: string;
}

export interface IRegisterAuthForm {
  user_id: string;
  email: string;
  passphrase: string;
  agree: boolean;
}
