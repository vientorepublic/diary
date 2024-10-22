/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { faCode, faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import Spotlight, { SpotlightCard } from "./components/spotlight.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecentPosts } from "./components/recent.component";
import { useEffect, useState } from "react";
import type { IPhraseData } from "./types";
import { UserStore } from "./store/user";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const { user_id, loading } = UserStore();
  const [phrase, setPhrase] = useState<IPhraseData>({
    text: "",
    author: "",
  });
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  useEffect(() => {
    async function getPhrase() {
      try {
        const res = await axios.get<IPhraseData[]>("/phrase.json");
        const randomIndex = Math.floor(Math.random() * res.data.length);
        setPhrase(res.data[randomIndex]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError(true);
      } finally {
        setFetching(false);
      }
    }
    getPhrase();
  }, []);
  return (
    <section className="px-10 text-center">
      {/* Main Section */}
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12">
          <div className="mb-8 text-3xl sm:text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl">
            <div className="flex flex-col gap-10 text-center">
              <h1 className="relative px-4 py-4 text-gray-100">오늘 하루는 어땠나요?</h1>
              <div className="flex flex-row justify-center items-center">
                <h1 className="text-gray-100">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">당신의 이야기</span>를 써내려 보세요.
                </h1>
              </div>
            </div>
          </div>
          <hr className="my-10 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
        </div>
        <div className="text-xl my-10">
          {fetching ? (
            <p>Loading...</p>
          ) : error ? (
            // Fallback
            <p>성공이란 한 걸음씩 앞으로 나아가며 가치 있는 이상을 실현하는 것이다. - 나이팅게일</p>
          ) : (
            // Random Phrase
            <p>
              {phrase.text} - {phrase.author}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:w-auto w-full sm:flex-row gap-3">
          {loading ? (
            <div className="px-6 py-3 mb-2 text-lg text-white bg-gray-400 rounded-2xl sm:w-auto sm:mb-0">
              <FontAwesomeIcon icon={faPencil} className="mr-2" />
              사용자 확인 중...
            </div>
          ) : (
            <Link
              href={user_id ? "/write" : "/auth/login?redirect_to=/write"}
              className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
            >
              <FontAwesomeIcon icon={faPencil} className="mr-2" />새 글 작성하기
            </Link>
          )}
          <Link
            href="/posts"
            className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
          >
            <FontAwesomeIcon icon={faList} className="mr-2" />
            모든 게시글 보기
          </Link>
        </div>
      </div>
      {/* Main Content - Spolight Cards */}
      <div className="flex flex-col items-center justify-center">
        <div className="py-10 w-full lg:w-4/5">
          <h1 className="text-5xl font-bold">자유로운 소통의 공간</h1>
          <Spotlight className="flex flex-col lg:flex-row py-10 gap-5 w-full mx-auto grid gap-6 lg:grid-cols-3 items-start lg:max-w-none group">
            <SpotlightCard>
              <div className="relative h-full bg-slate-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
                <div className="flex flex-col h-full items-center text-center">
                  <div className="grow mb-5">
                    <h2 className="text-2xl text-slate-200 font-bold mt-2 mb-2">당신의 이야기를 투고하세요.</h2>
                    <p className="text-lg text-slate-500">
                      평범하고 재미없어 보이는 서사라도 괜찮습니다. 하루를 마무리하며 오늘 있었던 사소한 일들을 공유해 보세요.
                    </p>
                  </div>
                  <Link
                    className="inline-flex justify-center items-center whitespace-nowrap rounded-lg bg-slate-800 hover:bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150"
                    href={user_id ? "/write" : "/auth/login?redirect_to=/write"}
                  >
                    <FontAwesomeIcon icon={faPencil} className="mr-2" />
                    새로운 글 작성하기
                  </Link>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="relative h-full bg-slate-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
                <div className="flex flex-col h-full items-center text-center">
                  <div className="grow mb-5">
                    <h2 className="text-2xl text-slate-200 font-bold mt-2 mb-2">나만의 작업 공간으로 활용하세요.</h2>
                    <p className="text-lg text-slate-500">작성한 글을 비공개로 전환하여 개인적으로 사용할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard>
              <div className="relative h-full bg-slate-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
                <div className="flex flex-col h-full items-center text-center">
                  <div className="grow mb-5">
                    <h2 className="text-2xl text-slate-200 font-bold mt-2 mb-2">함께 만들어갑니다.</h2>
                    <p className="text-lg text-slate-500">이 프로젝트는 오픈소스 입니다. 누구나 자유롭게 수정하거나 기여할 수 있습니다.</p>
                  </div>
                  <a
                    className="inline-flex justify-center items-center whitespace-nowrap rounded-lg bg-slate-800 hover:bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150"
                    href="https://github.com/vientorepublic/diary"
                  >
                    <FontAwesomeIcon icon={faCode} className="mr-2" />더 알아보기
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </Spotlight>
        </div>
      </div>
      {/* Recent Posts */}
      <div className="flex flex-col items-center justify-center">
        <div className="py-10 w-full lg:w-4/5">
          <h1 className="text-5xl font-bold">최근 게시글</h1>
          <div className="mt-10">
            <RecentPosts refresh />
          </div>
        </div>
      </div>
    </section>
  );
}
