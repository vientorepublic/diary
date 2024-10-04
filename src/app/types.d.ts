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

export interface IWritePost {
  title: string;
  text: string;
}

export interface IPost {
  id: number;
  title: string;
  author: string;
  profile_image: string;
  created_at: number;
}

export interface IDraftPost {
  title: string;
  text: string;
}

export interface IPostPreview extends IPost {
  preview: string;
}

export interface IPostData extends IPost {
  text: string;
}
export interface IPaginationInfo {
  totalItemCount: number;
  lastPageNumber: number;
  currentPage: number;
  pageSize: number;
}

export interface IPaginationData<T> {
  data: T;
  pagination: IPaginationInfo;
}

export interface IFetcherParams {
  url: string;
  token?: string;
  params?: URLSearchParams;
}

export interface DefaultResponse {
  message: string;
}

export interface IViewPostParams {
  id: string;
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

export interface ICardParams {
  title: string;
  text: string;
  author: string;
  profileImage: string;
  createdAt: number;
  buttonLink: string;
  className?: string;
}
