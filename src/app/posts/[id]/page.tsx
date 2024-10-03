"use client";
import { IPostData, IViewPostParams } from "@/app/types";
import { fetcher } from "@/app/utility/fetcher";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export default function ViewPostPage({ params }: { params: IViewPostParams }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<IPostData>();
  const [error, setError] = useState<string>("");
  const { id } = params;
  useEffect(() => {
    async function getPost(id: string) {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const res = await fetcher.get<IPostData>("/post/getPost", {
          params,
        });
        setPost(res.data);
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
    getPost(id);
  }, [id]);
  return (
    <section className="flex flex-row items-center justify-center px-10 py-20">
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        post && (
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p>{post.text}</p>
          </div>
        )
      )}
    </section>
  );
}
