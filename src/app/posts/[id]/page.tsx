import type { IPostData, IPostProps } from "@/app/types";
import { OpenGraph } from "@/app/opengraph";
import { Utility } from "@/app/utility";
import { Metadata } from "next";
import Markdown from "markdown-to-jsx";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";

const utility = new Utility();

async function getPost(id: string): Promise<IPostData | null> {
  try {
    const params = new URLSearchParams();
    params.append("id", id);
    const res = await axios.get<IPostData>(`${process.env.NEXT_PUBLIC_API_URL}/post/view`, {
      params,
    });
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: IPostProps): Promise<Metadata> {
  const { id } = params;

  const post = await getPost(id);

  if (post) {
    const text = post.text.replace(/\n/g, "");
    return {
      title: post.title,
      description: utility.shortenString(50, text),
    };
  } else {
    return {
      title: OpenGraph.title,
      description: OpenGraph.description,
    };
  }
}

export default async function ViewPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  return (
    <section className="flex flex-col items-center justify-center px-10">
      {post ? (
        <div className="py-40 w-full lg:w-4/5">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex flex-row gap-2 mt-2">
            <Image className="w-6 h-6 rounded-full" src={post.profile_image} width={6} height={6} alt="" />
            <span className="text-gray-100 text-base">{post.author}</span>
          </div>
          <p className="text-gray-500 text-base mt-2">{dayjs(post.created_at).format("YYYY.MM.DD HH:mm:ss")}</p>
          <hr className="border-gray-700 my-5" />
          <pre className="pretendard text-wrap">
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
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 h-screen">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="text-2xl">게시글을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      )}
    </section>
  );
}
