"use client";
import type { IPaginationData, IPostPreview, IUserActivityProps } from "../types";
import { swrHttp } from "../utility/fetcher";
import { PostCard } from "./card.component";
import { Alert } from "./alert.component";
import { Utility } from "../utility";
import useSWR from "swr";

const utility = new Utility();

export function UserActivity(props: IUserActivityProps) {
  const { id } = props;
  const { data, isLoading, error } = useSWR<IPaginationData<IPostPreview[]>>(
    {
      url: `/search?type=user_id&page=1&sort=latest&query=${id}`,
    },
    swrHttp,
    {}
  );
  return isLoading ? (
    <div className="flex flex-col gap-5 py-20 justify-center items-center">
      <div className="dots-loader-white"></div>
      <p className="text-xl">게시글을 불러오고 있어요...</p>
    </div>
  ) : error ? (
    <div className="flex py-20 justify-center items-center">
      <Alert>{error.response ? error.response.data.message : error.message}</Alert>
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
  );
}
