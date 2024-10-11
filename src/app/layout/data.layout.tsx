"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { ReactNode, useEffect } from "react";
import { fetcher } from "../utility/fetcher";
import { UserStore } from "../store/user";
import type { IUserInfo } from "../types";
import toast from "react-hot-toast";

export function DataLayout({ children }: { children: ReactNode }) {
  const { setUser, removeUser, setLoading, user_id } = UserStore();
  const token = getCookie("access_token");
  useEffect(() => {
    async function getUser() {
      try {
        const user = await fetcher.get<IUserInfo>("/auth/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser({
          id: user.data.id,
          user_id: user.data.user_id,
          email: user.data.email,
          profile_image: user.data.profile_image,
          created_at: user.data.created_at,
          permission: user.data.permission,
        });
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        const cookie = getCookie("access_token");
        if (cookie) {
          removeUser();
          deleteCookie("access_token");
          toast("세션이 만료 되었습니다. 다시 로그인 해주세요.");
        }
        setLoading(false);
      }
    }
    if (token) getUser();
    else setLoading(false);
  }, [removeUser, setLoading, setUser, token, user_id]);
  return children;
}
