/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import type { IPaginationData, IPhraseData, IPostPreview } from "./types";
import { faCode, faList, faPencil } from "@fortawesome/free-solid-svg-icons";
import Spotlight, { SpotlightCard } from "./components/spotlight.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PostCard } from "./components/card.component";
import { Alert } from "./components/alert.component";
import { swrFetcher } from "./utility/fetcher";
import { useEffect, useState } from "react";
import { UserStore } from "./store/user";
import { Utility } from "./utility";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";

const utility = new Utility();

export default function Home() {
  const [fetching, setFetching] = useState<boolean>(true);
  // @ts-ignore
  const { data, error, isLoading } = useSWR<IPaginationData<IPostPreview[]>>(
    {
      url: `${process.env.NEXT_PUBLIC_API_URL}/post/posts?page=1`,
    },
    swrFetcher,
    {
      refreshInterval: 5000,
    }
  );
  const [phrase, setPhrase] = useState<IPhraseData>();
  const { user_id, loading } = UserStore();
  useEffect(() => {
    async function getPhrase() {
      try {
        const res = await axios.get<IPhraseData[]>("/phrase.json");
        const randomIndex = Math.floor(Math.random() * res.data.length);
        setPhrase(res.data[randomIndex]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
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
              <div className="relative">
                <div className="absolute inset-0 animated-background bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.50] bg-red-500 rounded-full blur-3xl" />
                <h1 className="relative px-4 py-8 text-gray-100">오늘 하루는 어땠나요?</h1>
              </div>
              <div className="flex flex-row justify-center items-center">
                <h1 className="text-gray-100">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">당신의 이야기</span>를 써내려 보세요.
                </h1>
              </div>
            </div>
          </div>
          <hr className="my-10 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
        </div>
        <div className="phrase-text text-2xl my-10">
          {fetching ? (
            <p>Loading...</p>
          ) : (
            phrase && (
              <p>
                {phrase.text} - {phrase.author}
              </p>
            )
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
          {isLoading ? (
            <div className="flex flex-col gap-5 py-20 justify-center items-center">
              <div className="dots-loader-white"></div>
              <p className="phrase-text text-2xl">게시글을 불러오고 있어요...</p>
            </div>
          ) : error ? (
            <div className="flex py-20 justify-center items-center">
              <Alert>{error.response.data.message}</Alert>
            </div>
          ) : (
            <div className="grid grid-wrap lg:grid-cols-3 gap-5 py-10">
              {data &&
                data.data.map((e, i) => {
                  return (
                    <PostCard
                      title={utility.shortenString(10, e.title)}
                      text={utility.shortenString(50, e.preview)}
                      author={utility.shortenString(10, e.author)}
                      isPublic={true}
                      profileImage={e.profile_image}
                      createdAt={e.created_at}
                      buttonLink={`/posts/${e.id}`}
                      key={i}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
