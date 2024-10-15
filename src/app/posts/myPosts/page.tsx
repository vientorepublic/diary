/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IMyPost, IPaginationData } from "@/app/types";
import { PostCard } from "@/app/components/card.component";
import { Alert } from "@/app/components/alert.component";
import { swrFetcher } from "@/app/utility/fetcher";
import { getCookie } from "cookies-next";
import { Cookie } from "@/app/constants";
import { Utility } from "@/app/utility";
import React, { useState } from "react";
import useSWR from "swr";

const utility = new Utility();

export default function PrivatePostPage() {
  const { name } = Cookie;
  const token = getCookie(name);
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading } = useSWR<IPaginationData<IMyPost[]>>(
    {
      url: `${process.env.NEXT_PUBLIC_API_URL}/post/myPosts?page=${page}`,
      token,
    },
    // @ts-ignore
    swrFetcher
  );
  return (
    <section className="flex flex-col items-center justify-center px-10">
      <div className="py-10 w-full lg:w-4/5">
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-screen">
            <div className="dots-loader-white"></div>
            <p className="phrase-text text-2xl">게시글을 불러오고 있어요...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 justify-center items-center h-screen">
            {/* stack,message,name,code,config,request,response,status */}
            <Alert>{error.response ? error.response.data.message : error.message}</Alert>
          </div>
        ) : (
          <div className="text-left py-20">
            <div className="phrase-text text-gray-100 mb-10">
              <h1 className="text-4xl">나의 게시글</h1>
              <h2 className="text-2xl mt-2">게시글을 모두 확인할 수 있습니다. 비공개 게시글을 포함합니다.</h2>
            </div>
            <div className="grid grid-wrap lg:grid-cols-3 gap-5">
              {data &&
                data.data &&
                data.data.map((e, i) => {
                  return (
                    <PostCard
                      title={utility.shortenString(10, e.title)}
                      text={utility.shortenString(50, e.preview)}
                      author={utility.shortenString(10, e.author)}
                      isPublic={e.public_post}
                      profileImage={e.profile_image}
                      createdAt={e.created_at}
                      buttonLink={`/posts/myPosts/${e.id}`}
                      key={i}
                    />
                  );
                })}
            </div>
            {data && data.data && (
              <div className="flex flex-col gap-4 justify-center items-center mt-10">
                <p className="">
                  {data.pagination.currentPage} / {data.pagination.lastPageNumber}
                </p>
                <div className="flex flex-row gap-4 justify-center items-center">
                  <button
                    className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Previous
                  </button>
                  <button
                    className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                    disabled={page === data.pagination.lastPageNumber}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
