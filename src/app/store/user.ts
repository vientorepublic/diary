import { create } from "zustand";
import { IUserInfo } from "../types";

const value: IUserInfo = {
  id: 0,
  user_id: "",
  email: "",
  profile_image: "",
  created_at: 0,
  permission: 0,
};

interface User extends IUserInfo {
  loading: boolean;
  setLoading: (state: boolean) => void;
  setUser: (data: IUserInfo) => void;
  removeUser: () => void;
}

export const UserStore = create<User>((set) => ({
  loading: true,
  ...value,
  setUser: (data) => {
    set(() => ({
      id: data.id,
      user_id: data.user_id,
      email: data.email,
      profile_image: data.profile_image,
      created_at: data.created_at,
      permission: data.permission,
    }));
  },
  removeUser: () => {
    set(() => ({
      ...value,
    }));
  },
  setLoading: (state: boolean) => {
    set(() => ({
      loading: state,
    }));
  },
}));
