"use client";
import { useEffect, useState } from "react";
import { PostCard } from "../components/card.component";
import { IPaginationData, IPostData } from "../types";
import { fetcher } from "../utility/fetcher";
import { isAxiosError } from "axios";
import { Alert } from "../components/alert.component";

export default function PostPage() {
  const [posts, setPosts] = useState<IPaginationData<IPostData[]>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    async function getPosts() {
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        const res = await fetcher.get<IPaginationData<IPostData[]>>("/post/getPosts", {
          params,
        });
        setPosts(res.data);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data.message);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, []);
  return (
    <section className="flex flex-col items-center justify-center px-10 py-20">
      <div className="py-10 w-full lg:w-4/5">
        {loading ? (
          <div className="flex flex-col gap-4 justify-center items-center h-screen">
            <div className="dots-loader-white"></div>
            <p className="phrase-text text-2xl">게시글을 불러오고 있어요...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 justify-center items-center h-screen">
            <Alert>{error}</Alert>
          </div>
        ) : (
          <div className="grid grid-wrap lg:grid-cols-2 gap-5">
            {posts &&
              posts.data.map((e, i) => {
                return <PostCard title={e.title} text={e.text} profileImage={e.profile_image} buttonLink="/" key={i} />;
              })}
          </div>
        )}
      </div>
    </section>
  );
}
