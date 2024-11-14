"use client";
import type { IPagination, IPostPreview, IRecentPostProps } from "../types";
import { swrHttp } from "../utility/fetcher";
import { PostCard } from "./card.component";
import { Warning } from "./alert.component";
import { Utility } from "../utility";
import useSWR from "swr";

const utility = new Utility();

export function RecentPosts(props: IRecentPostProps) {
  const { refresh } = props;
  const { data, error, isLoading } = useSWR<IPagination<IPostPreview[]>>(
    {
      url: `/post/posts?page=1&sort=latest`,
    },
    swrHttp,
    {
      refreshInterval: refresh ? 5000 : undefined,
    }
  );
  return isLoading ? (
    <div className="flex flex-col gap-5 py-20 justify-center items-center">
      <div className="dots-loader-white"></div>
      <p className="text-xl">게시글을 불러오고 있어요...</p>
    </div>
  ) : error ? (
    <div className="flex py-20 justify-center items-center">
      <Warning>{error.response ? error.response.data.message : error.message}</Warning>
    </div>
  ) : (
    <div className="grid grid-wrap lg:grid-cols-3 gap-5">
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
