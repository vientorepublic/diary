"use client";
import { Alert } from "@/app/components/alert.component";
import { fetcher } from "@/app/utility/fetcher";
import type { IPostData } from "@/app/types";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Utility } from "@/app/utility";
import { isAxiosError } from "axios";
import Markdown from "markdown-to-jsx";
import Image from "next/image";
import dayjs from "dayjs";

const utility = new Utility();

export default function ViewPrivatePostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const token = getCookie("access_token");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [post, setPost] = useState<IPostData>();
  useEffect(() => {
    async function getPrivatePost() {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const res = await fetcher.get<IPostData>("/post/viewPrivate", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(res.data);
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    }
    getPrivatePost();
  }, [id, token]);
  return (
    <section className="flex flex-col items-center justify-center px-10">
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
        post && (
          <div className="py-40 w-full lg:w-4/5">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="flex flex-row gap-2 mt-2">
              <Image className="w-6 h-6 rounded-full" src={post.profile_image} width={6} height={6} alt="" />
              <span className="text-gray-100 text-base">{post.author}</span>
            </div>
            <p className="text-gray-500 text-base mt-2">{dayjs(post.created_at).format("YYYY.MM.DD HH:mm:ss")}</p>
            <hr className="border-gray-700 my-5" />
            <pre className="pretendard text-wrap overflow-hidden">
              <Markdown
                options={{
                  overrides: {
                    h1: { props: { className: "text-3xl font-bold mb-4 text-gray-100" } },
                    h2: { props: { className: "text-2xl font-semibold mb-3 mt-6 text-gray-200" } },
                    h3: { props: { className: "text-xl font-semibold mb-2 mt-4 text-gray-200" } },
                    h4: { props: { className: "text-lg font-semibold mb-2 mt-4 text-gray-200" } },
                    p: { props: { className: "mb-4 text-gray-300" } },
                    a: { props: { className: "hover:underline text-blue-500" } },
                    ul: { props: { className: "list-disc pl-5 mb-4 text-gray-300" } },
                    ol: { props: { className: "list-decimal pl-5 mb-4 text-gray-300" } },
                    li: { props: { className: "mb-1" } },
                    code: { props: { className: "bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-200" } },
                    pre: { props: { className: "bg-gray-800 rounded p-4 mb-4 overflow-x-auto" } },
                  },
                }}
              >
                {utility.escapeHTML(post.text)}
              </Markdown>
            </pre>
          </div>
        )
      )}
    </section>
  );
}
