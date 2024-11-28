import type { ReactNode } from "react";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      INTERNAL_API_URL: string;
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
      NEXT_PUBLIC_BRAND_NAME: string;
    }
  }
}

export interface IPhrase {
  text: string;
  author: string;
}

export interface IMessage {
  message: string;
}

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
  edited_at?: number;
}

export interface IWritePostPayload extends IWritePost {
  g_recaptcha_response: string;
  public_post: boolean;
}

export interface IEditPostPayload extends IWritePostPayload {
  id: number;
}

export interface IMyPost extends IPost {
  public_post: boolean;
  preview: string;
}

export interface IPostPreview extends IPost {
  preview: string;
}

export interface IPostData extends IPost {
  text: string;
}

export type PostSearchTypes = "title" | "text" | "user_id";
export type SortOptions = "latest" | "oldest";

export interface ISearchQuery {
  type: PostSearchTypes;
  page: number;
  sort: SortOptions;
  query: string;
}

export interface IPaginationInfo {
  totalItemCount: number;
  lastPageNumber: number;
  currentPage: number;
  pageSize: number;
}

export interface IPagination<T> {
  data: T;
  pagination: IPaginationInfo;
}

export interface IFetcherParams {
  url: string;
  token?: string;
}

export interface DefaultResponse {
  message: string;
}

export interface ILoginResponse extends DefaultResponse {
  data: {
    access_token: string;
    expires_at: number;
  };
}

export interface IUser {
  id: number;
  user_id: string;
  profile_image: string;
  created_at: number;
  permission: number;
}

export interface IUserInfo extends IUser {
  email: string;
}

export interface IUserStats {
  postCount: number;
  lastActivityDate: number;
}

export interface IUserProfile extends IUser {
  verified: boolean;
  stats: IUserStats;
}

export interface IUserActivityProps {
  sort: SortOptions;
  id: string;
}

export interface User extends IUserInfo {
  loading: boolean;
  setLoading: (state: boolean) => void;
  setUser: (data: IUserInfo) => void;
  removeUser: () => void;
}

export interface IPostProps {
  params: Promise<{ id: string }>;
}

export interface ILoginAuthForm {
  user_id: string;
  passphrase: string;
}

export interface IRegisterAuthForm {
  user_id: string;
  email: string;
  passphrase: string;
  agree_terms: boolean;
}

export interface ICardProps {
  title: string;
  text: string;
  author: string;
  userId: string;
  isPublic: boolean;
  profileImage: string;
  createdAt: number;
  buttonLink: string;
}

export interface HTMLEscapeChars {
  [key: string]: string;
}

export type SpotlightProps = {
  children: ReactNode;
  className?: string;
};

export type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

export interface IMousePosition {
  x: number;
  y: number;
}

export interface IContainerSize {
  w: number;
  h: number;
}

export interface ICookie {
  name: string;
  secure: boolean;
  maxAge: number;
  sameSite: boolean | "strict" | "lax" | "none";
  path: string;
}

export interface IConfirmModalProps {
  title: string;
  message: string;
  callback: () => void;
}

export interface IRecentPostProps {
  refresh?: boolean;
}
