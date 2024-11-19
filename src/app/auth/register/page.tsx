"use client";
import { isEmail, isPassword, isUserId } from "@/app/utility/regex";
import type { IRegisterAuthForm } from "@/app/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useReCaptcha } from "next-recaptcha-v3";
import { axios } from "@/app/utility/http";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterAuthForm>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const { executeRecaptcha } = useReCaptcha();
  async function submit(data: IRegisterAuthForm) {
    if (!data.agree_terms) {
      toast.error("회원가입을 완료하려면 약관을 동의하셔야 합니다.");
      return;
    }
    setDisabled(true);
    try {
      const token = await executeRecaptcha("register");
      const { data: result } = await axios.post("/auth/register", {
        ...data,
        g_recaptcha_response: token,
      });
      toast.success(result.message);
      const redirect = params.get("redirect_to");
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          setDisabled(false);
          toast.error(err.response.data.message);
        }
      }
    }
  }
  return (
    <div className="min-h-screen py-6 mt-10 flex flex-col justify-center sm:py-20">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg shadow-xl sm:rounded-2xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-blue-300 inline-block text-transparent bg-clip-text mb-3">
                Hello!
              </h1>
              <h2 className="text-2x text-gray-700">아래 절차를 완료하고 계정을 만들어 보세요.</h2>
            </div>
            <form onSubmit={handleSubmit(submit)}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col gap-5">
                    <div className="relative">
                      <input
                        autoComplete="off"
                        type="id"
                        {...register("user_id", {
                          required: "* 아이디를 입력해주세요.",
                          pattern: {
                            value: isUserId,
                            message: "* 아이디 형식이 올바르지 않습니다.",
                          },
                        })}
                        disabled={disabled}
                        className="disabled:bg-gray-200 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Account ID"
                      />
                      {errors.user_id && <p className="text-sm text-red-500 mt-2">{errors.user_id.message}</p>}
                      <label
                        htmlFor="user_id"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        계정 아이디
                      </label>
                      <p className="text-sm text-gray-500 mt-3">
                        아이디는 알파벳 소문자, 숫자, 언더스코어로 최소 3글자, 최대 32글자 까지 사용할 수 있습니다.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        type="email"
                        {...register("email", {
                          required: "* 이메일 주소를 입력해주세요.",
                          pattern: {
                            value: isEmail,
                            message: "* 이메일 주소 형식이 올바르지 않습니다.",
                          },
                        })}
                        disabled={disabled}
                        className="disabled:bg-gray-200 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Your Email Address"
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>}
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        이메일 주소
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autoComplete="off"
                        type="password"
                        {...register("passphrase", {
                          required: "* 비밀번호를 입력해주세요.",
                          pattern: {
                            value: isPassword,
                            message: "* 비밀번호 형식이 올바르지 않습니다.",
                          },
                        })}
                        disabled={disabled}
                        className="disabled:bg-gray-200 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Your Password"
                      />
                      {errors.passphrase && <p className="text-sm text-red-500 mt-2">{errors.passphrase.message}</p>}
                      <label
                        htmlFor="passphrase"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        5~40자리 사이의 비밀번호
                      </label>
                      <p className="text-sm text-gray-500 mt-3">
                        비밀번호는 알파벳 대소문자, 숫자, 일부 특수문자로 최소 5글자, 최대 40글자 까지 사용할 수 있습니다.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        id="default-checkbox"
                        type="checkbox"
                        value=""
                        disabled={disabled}
                        {...register("agree_terms", {
                          required: "* 약관에 동의해야 합니다.",
                        })}
                        className="disabled:bg-gray-200 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray">
                        사용자 약관에 동의합니다.
                      </label>
                      {errors.agree_terms && <p className="text-sm text-red-500 mt-2">{errors.agree_terms.message}</p>}
                    </div>
                    {disabled ? (
                      <div className="flex justify-center items-center mt-8">
                        <div className="dots-loader-black"></div>
                      </div>
                    ) : (
                      <div className="flex rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg mt-8">
                        <input
                          type="submit"
                          value="Register"
                          className="disabled:bg-gray-200 flex-1 font-bold bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="flex gap-1">
            <p className="text-gray-700">이미 계정이 있으신가요?</p>
            <Link href="/auth/login" className="text-sky-500">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
