"use client";
import type { IPaginationData, IPostPreview, IUserActivityProps } from "../types";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { swrHttp } from "../utility/fetcher";
import { PostCard } from "./card.component";
import { Alert } from "./alert.component";
import { Utility } from "../utility";
import { useState } from "react";
import useSWR from "swr";

const utility = new Utility();

export function UserActivity(props: IUserActivityProps) {
  const { id, sort } = props;
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useSWR<IPaginationData<IPostPreview[]>>(
    {
      url: `/search?type=user_id&page=${page}&sort=${sort}&query=${id}`,
    },
    swrHttp,
    {
      shouldRetryOnError: false,
    }
  );
  return isLoading ? (
    <div className="flex flex-col gap-5 py-20 justify-center items-center">
      <div className="dots-loader-white"></div>
      <p className="text-xl">게시글을 불러오고 있어요...</p>
    </div>
  ) : error ? (
    <div className="flex py-20 justify-center items-center">
      <Alert>{error.response.status === 404 ? "계정 활동 기록이 없습니다." : error.message}</Alert>
    </div>
  ) : (
    <>
      <div className="grid grid-wrap lg:grid-cols-3 gap-5 py-10">
        {data &&
          data.data.map((e, i) => {
            return (
              <PostCard
                title={utility.shortenString(10, e.title)}
                text={utility.shortenString(50, e.preview)}
                author={utility.shortenString(10, e.author)}
                userId={e.author}
                isPublic={true}
                profileImage={e.profile_image}
                createdAt={e.created_at}
                buttonLink={`/post/${e.id}`}
                key={i}
              />
            );
          })}
      </div>
      {data && data.data && (
        <div className="flex flex-col gap-4 justify-center items-center">
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
  );
}
