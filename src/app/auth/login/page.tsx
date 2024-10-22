"use client";
import type { ILoginAuthForm, ILoginResponse, IUserInfo } from "@/app/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useReCaptcha } from "next-recaptcha-v3";
import { fetcher } from "@/app/utility/fetcher";
import { UserStore } from "@/app/store/user";
import { useForm } from "react-hook-form";
import { setCookie } from "cookies-next";
import { Cookie } from "@/app/constants";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import React from "react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { register, handleSubmit } = useForm<ILoginAuthForm>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const { executeRecaptcha } = useReCaptcha();
  const { setUser } = UserStore();
  async function submit(data: ILoginAuthForm) {
    setDisabled(true);
    try {
      const token = await executeRecaptcha("login");
      const result = await fetcher.post<ILoginResponse>("/auth/login", {
        ...data,
        g_recaptcha_response: token,
      });
      // Set token cookie
      const { name, secure, maxAge, sameSite, path } = Cookie;
      const { access_token } = result.data.data;
      setCookie(name, access_token, {
        secure,
        maxAge,
        sameSite,
        path,
      });
      // Init user profile
      const user = await fetcher.get<IUserInfo>("/auth/user/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
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
      setDisabled(false);
      toast.success(result.data.message);
      // Check redirect path
      const redirect = params.get("redirect_to");
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      setDisabled(false);
      if (isAxiosError(err)) {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
  }
  return (
    <div className="min-h-screen py-6 flex flex-col justify-center">
      <div className="relative sm:max-w-xl sm:mx-auto">
        <div className="relative bg-white shadow-lg shadow-xl sm:rounded-2xl p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-blue-300 inline-block text-transparent bg-clip-text mb-3">Hello!</h1>
            <h2 className="text-2x text-gray-700">다시 돌아오셔서 정말 반가워요</h2>
            <form onSubmit={handleSubmit(submit)}>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col gap-5">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      type="text"
                      {...register("user_id")}
                      required
                      autoFocus
                      disabled={disabled}
                      className="disabled:bg-gray-200 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="User ID"
                    />
                    <label
                      htmlFor="user_id"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      아이디 또는 이메일 주소
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      type="password"
                      {...register("passphrase")}
                      required
                      disabled={disabled}
                      className="disabled:bg-gray-200 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="passphrase"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      비밀번호
                    </label>
                  </div>
                  {disabled ? (
                    <div className="flex justify-center items-center mt-8">
                      <div className="dots-loader-black"></div>
                    </div>
                  ) : (
                    <div className="flex rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg mt-8">
                      <input
                        type="submit"
                        value="Login"
                        className="disabled:bg-gray-200 flex-1 font-bold bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="flex gap-1">
            <p className="text-gray-700">처음 오셨나요?</p>
            <Link href="/auth/register?redirect_to=/auth/login" className="text-sky-500">
              계정 만들기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
