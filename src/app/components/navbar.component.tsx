"use client";
import { UserStore } from "../store/user";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const { user_id, email, profile_image, permission, loading } = UserStore();
  const [isOpen, setOpen] = useState<boolean>(false);
  function toggleDropdown() {
    setOpen((old) => !old);
  }
  function closeDropdown() {
    setOpen(false);
  }
  return (
    <nav className="bg-gray-800 fixed w-full z-20 top-0 start-0 border-gray-600 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <span className="text-3xl font-bold phrase-text">글귀저장소</span>
        </Link>
        <div className="flex md:order-2 space-x-2 rtl:space-x-reverse">
          {loading ? (
            <div className="max-w-sm animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
            </div>
          ) : user_id ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown()}
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-600"
                type="button"
              >
                <Image className="w-8 h-8 rounded-full" src={profile_image} width={30} height={30} alt="" />
              </button>
              {isOpen && (
                <div className="absolute z-30 mt-5 divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600 top-full right-0">
                  <div className="px-4 py-3 text-sm text-white">
                    <div>{permission === 1 ? <span className="text-green-500">{user_id}</span> : user_id}</div>
                    <div className="font-medium truncate">{email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
                    <li>
                      <Link href="/write" onClick={() => closeDropdown()} className="block px-4 py-2 hover:bg-gray-600 text-white">
                        새 글 쓰기
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/account" onClick={() => closeDropdown()} className="block px-4 py-2 hover:bg-gray-600 text-white">
                        계정 설정
                      </Link>
                    </li>
                  </ul>
                  <div className="py-2">
                    <Link
                      href="/auth/logout"
                      onClick={() => closeDropdown()}
                      className="block px-4 py-2 hover:bg-gray-600 text-sm text-gray-200 text-white"
                    >
                      로그아웃
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-700 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
