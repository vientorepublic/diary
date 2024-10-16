/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IPaginationData, IPostPreview } from "../types";
import { PostCard } from "../components/card.component";
import { Alert } from "../components/alert.component";
import { useSearchParams } from "next/navigation";
import { swrFetcher } from "../utility/fetcher";
import { useEffect, useState } from "react";
import { Utility } from "../utility";
import React from "react";
import useSWR from "swr";

const utility = new Utility();

export default function PostPage() {
  const params = useSearchParams();
  const pageIndex = params.get("page");
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (pageIndex) setPage(Number(pageIndex));
  }, [pageIndex]);
  const {
    data: pageData,
    isLoading,
    error,
  } = useSWR<IPaginationData<IPostPreview[]>>(
    {
      url: `${process.env.NEXT_PUBLIC_API_URL}/post/posts?page=${page}`,
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
            <p className="text-xl">게시글을 불러오고 있어요...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 justify-center items-center h-screen">
            {/* stack,message,name,code,config,request,response,status */}
            <Alert>{error.response ? error.response.data.message : error.message}</Alert>
          </div>
        ) : (
          <div className="text-left py-20">
            <div className="text-gray-100 mb-10">
              <h1 className="text-4xl">모든 게시글</h1>
              <h2 className="text-xl mt-2">게시글은 가장 최근에 게시된 순서로 정렬됩니다.</h2>
            </div>
            <div className="grid grid-wrap lg:grid-cols-3 gap-5">
              {pageData &&
                pageData.data &&
                pageData.data.map((e, i) => {
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
            {pageData && pageData.data && (
              <div className="flex flex-col gap-4 justify-center items-center mt-10">
                <p className="">
                  {pageData.pagination.currentPage} / {pageData.pagination.lastPageNumber}
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
                    disabled={page === pageData.pagination.lastPageNumber}
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
