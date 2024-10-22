import type { IUserInfo, User } from "../types";
import { create } from "zustand";

const value: IUserInfo = {
  id: 0,
  user_id: "",
  email: "",
  profile_image: "",
  created_at: 0,
  permission: 0,
};

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
