"use client";
import { RenderMarkdown } from "@/app/components/markdown.component";
import { PostOption } from "@/app/components/option.component";
import { Warning } from "@/app/components/alert.component";
import type { IPostData, IPostProps } from "@/app/types";
import { useEffect, useState } from "react";
import { axios } from "@/app/utility/http";
import { getCookie } from "cookies-next";
import { Cookie } from "@/app/config";
import { Utility } from "@/app/utility";
import { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

const utility = new Utility();

export default function ViewPrivatePostPage({ params }: IPostProps) {
  const { id } = params;
  const { name } = Cookie;
  const token = getCookie(name);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [post, setPost] = useState<IPostData>();
  useEffect(() => {
    async function getPrivatePost() {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const { data } = await axios.get<IPostData>("/post/viewPrivate", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(data);
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          setError(err.response.data.message);
        }
      } finally {
        setFetching(false);
      }
    }
    getPrivatePost();
  }, [id, token]);
  return (
    <section className="flex flex-col items-center justify-center px-10">
      {fetching ? (
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
          <div className="dots-loader-white"></div>
          <p className="text-xl">게시글을 불러오고 있어요...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
          <Warning>{error}</Warning>
        </div>
      ) : (
        post && (
          <div className="py-40 w-full lg:w-4/5">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <Link className="flex flex-row gap-2 mt-3" href={`/user/${post.author}`}>
              <Image className="w-6 h-6 rounded-full" src={post.profile_image} width={6} height={6} alt="" />
              <span className="text-gray-100 text-base">{post.author}</span>
            </Link>
            <p className="text-gray-500 text-base mt-2">{dayjs(post.created_at).format("YYYY.MM.DD HH:mm:ss")} 게시됨</p>
            {post.edited_at !== 0 && <p className="text-gray-500 text-base">{dayjs(post.edited_at).format("YYYY.MM.DD HH:mm:ss")} 수정됨</p>}
            <PostOption postId={post.id} />
            <hr className="border-gray-700 my-5" />
            <pre className="pretendard text-wrap overflow-hidden">
              <RenderMarkdown>{utility.escapeHTML(post.text)}</RenderMarkdown>
            </pre>
          </div>
        )
      )}
    </section>
  );
}
