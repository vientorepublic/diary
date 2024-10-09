/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RenderMarkdown } from "@/app/components/markdown.component";
import type { IPostData, IPostProps } from "@/app/types";
import { OpenGraph } from "@/app/opengraph";
import axios, { isAxiosError } from "axios";
import { Utility } from "@/app/utility";
import { Metadata } from "next";
import Image from "next/image";
import dayjs from "dayjs";

const utility = new Utility();

async function getPost(id: string) {
  try {
    if (!utility.isPostId(id)) {
      throw new Error("게시글 ID 형식이 잘못되었습니다.");
    }
    const params = new URLSearchParams();
    params.append("id", id);
    const res = await axios.get<IPostData>(`${process.env.NEXT_PUBLIC_API_URL}/post/view`, {
      params,
    });
    return res.data;
  } catch (err: any) {
    if (isAxiosError(err) && err.response) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error(err.message);
    }
  }
}

export async function generateMetadata({ params }: IPostProps): Promise<Metadata> {
  const { id } = params;
  let data: IPostData | undefined;
  try {
    data = await getPost(id);
  } catch (err) {}
  if (data) {
    // EOL to Space
    const text = data.text.replace(/\n/g, " ");
    // Remove markdown
    const plainText = utility.stripMarkdown(text);
    return {
      title: data.title,
      description: utility.shortenString(50, plainText),
    };
  } else {
    return {
      title: OpenGraph.title,
      description: OpenGraph.description,
    };
  }
}

export default async function ViewPostPage({ params }: { params: { id: string } }) {
  let data: IPostData | undefined;
  let error: string | undefined;
  try {
    data = await getPost(params.id);
  } catch (err: any) {
    error = err.message;
  }
  return (
    <section className="flex flex-col items-center justify-center px-10">
      {data ? (
        <div className="py-40 w-full lg:w-4/5">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <div className="flex flex-row gap-2 mt-3">
            <Image className="w-6 h-6 rounded-full" src={data.profile_image} width={6} height={6} alt="" />
            <span className="text-gray-100 text-base">{data.author}</span>
          </div>
          <p className="text-gray-500 text-base mt-2">{dayjs(data.created_at).format("YYYY.MM.DD HH:mm:ss")}</p>
          <hr className="border-gray-700 my-5" />
          <pre className="pretendard text-wrap overflow-hidden">
            <RenderMarkdown>{utility.escapeHTML(data.text)}</RenderMarkdown>
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 h-screen">
          <h1 className="text-4xl font-bold">Error</h1>
          <p className="text-2xl">{error}</p>
        </div>
      )}
    </section>
  );
}
