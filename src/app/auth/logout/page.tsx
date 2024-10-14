"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { UserStore } from "@/app/store/user";
import { Cookie } from "@/app/constants";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function LogoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { removeUser } = UserStore();
  const { name } = Cookie;
  const token = getCookie(name);
  const redirect = params.get("redirect_to");
  useEffect(() => {
    if (token) {
      removeUser();
      deleteCookie(name);
      toast.success("로그아웃 되었습니다.");
      if (redirect) {
        return router.push(redirect);
      }
    } else {
      return router.push("/");
    }
  }, [name, redirect, removeUser, router, token]);
}
