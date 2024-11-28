"use client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { IMyPost, IPagination, SortOptions } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PostCard } from "@/app/components/card.component";
import { Alert } from "@/app/components/alert.component";
import { fetcher } from "@/app/utility/http";
import { getCookie } from "cookies-next";
import { Cookie } from "@/app/config";
import { Utility } from "@/app/utility";
import { useState } from "react";
import useSWR from "swr";

const utility = new Utility();

export default function PrivatePostPage() {
  const { name } = Cookie;
  const token = getCookie(name);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<SortOptions>("latest");
  const { data, error, isLoading } = useSWR<IPagination<IMyPost[]>>(
    {
      url: `/post/myPosts?page=${page}&sort=${sort}`,
      token,
    },
    fetcher,
    {}
  );
  return (
    <section className="flex flex-col items-center justify-center text-left px-10">
      <div className="py-40 w-full lg:w-4/5">
        <div className="text-gray-100 mb-10">
          <h1 className="text-4xl">나의 게시글</h1>
          <h2 className="text-xl mt-2">게시글을 모두 확인할 수 있습니다. 비공개 게시글을 포함합니다.</h2>
          <form className="mt-2">
            <input
              id="radio-latest"
              type="radio"
              value="latest"
              defaultChecked
              onChange={() => setSort("latest")}
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="radio-latest" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
              내림차순
            </label>
            <input
              id="radio-oldest"
              type="radio"
              value="oldest"
              onChange={() => setSort("oldest")}
              name="default-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="radio-oldest" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
              오름차순
            </label>
          </form>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-4 justify-center items-center py-20">
            <div className="dots-loader-white"></div>
            <p className="text-xl">게시글을 불러오고 있어요...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 justify-center items-center py-20">
            <Alert>{error.response ? error.response.data.message : error.message}</Alert>
          </div>
        ) : (
          <>
            <div className="grid grid-wrap lg:grid-cols-3 gap-5">
              {data &&
                data.data &&
                data.data.map((e, i) => {
                  return (
                    <PostCard
                      title={utility.shortenString(10, e.title)}
                      text={utility.shortenString(50, e.preview)}
                      author={utility.shortenString(10, e.author)}
                      userId={e.author}
                      isPublic={e.public_post}
                      profileImage={e.profile_image}
                      createdAt={e.created_at}
                      buttonLink={`/post/myPost/view?id=${e.id}`}
                      key={i}
                    />
                  );
                })}
            </div>
            {data && data.data && (
              <div className="flex flex-col gap-4 justify-center items-center mt-10">
                <p>
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
          </>
        )}
      </div>
    </section>
  );
}
