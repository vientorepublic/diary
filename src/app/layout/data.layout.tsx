"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { ReactNode, useEffect } from "react";
import { fetcher } from "../utility/fetcher";
import { UserStore } from "../store/user";
import type { IUserInfo } from "../types";
import { Cookie } from "../constants";
import toast from "react-hot-toast";

export function DataLayout({ children }: { children: ReactNode }) {
  const { name } = Cookie;
  const { setUser, removeUser, setLoading } = UserStore();
  const token = getCookie(name);
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await fetcher.get<IUserInfo>("/auth/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        const cookie = getCookie(name);
        if (cookie) {
          removeUser();
          deleteCookie(name);
          toast("세션이 만료 되었습니다. 다시 로그인 해주세요.");
        }
      } finally {
        setLoading(false);
      }
    }
    if (token) getUser();
    else setLoading(false);
  }, [name, removeUser, setLoading, setUser, token]);
  return children;
}
