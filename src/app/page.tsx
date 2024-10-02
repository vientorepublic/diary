"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import type { IPhrase, IPhraseData } from "./types";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [phrase, setPhrase] = useState<IPhraseData>({
    text: "",
    author: "",
  });
  useEffect(() => {
    async function getPhrase() {
      try {
        const res = await axios.get<IPhrase>("/phrase.json");
        const randomIndex = Math.floor(Math.random() * res.data.length);
        setPhrase(res.data[randomIndex]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    getPhrase();
  }, []);
  return (
    <section className="px-10 text-center">
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12">
          <div className="mb-8 text-3xl sm:text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl">
            <div className="flex flex-col gap-10 text-center">
              <div className="relative">
                <div className="absolute inset-0 animated-background bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.50] bg-red-500 rounded-full blur-3xl" />
                <h1 className="relative px-4 py-8 text-gray-100">오늘 하루는 어땠나요?</h1>
              </div>
              <h1 className="bg-gradient-to-r from-blue-200 to-cyan-200 text-transparent bg-clip-text">당신의 이야기를 써내려 보세요.</h1>
            </div>
          </div>
          <hr className="my-10 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
        </div>
        <div className="phrase-text text-2xl my-10">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>
              {phrase.text} - {phrase.author}
            </p>
          )}
        </div>
        <Link
          href="/write"
          className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
        >
          새 글 작성하기
          <FontAwesomeIcon icon={faPencil} className="ml-2" />
        </Link>
      </div>
    </section>
  );
}
