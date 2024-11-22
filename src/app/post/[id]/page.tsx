import { RenderMarkdown } from "@/app/components/markdown.component";
import { RecentPosts } from "@/app/components/recent.component";
import type { IPostData, IPostProps } from "@/app/types";
import { MetadataConfig } from "@/app/config";
import { Post } from "@/app/utility/ssr";
import { Utility } from "@/app/utility";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

const utility = new Utility();
const post = new Post();

export async function generateMetadata({ params }: IPostProps): Promise<Metadata> {
  const { id } = params;
  try {
    const { title, text } = await post.get(id);
    const description = utility.convertDescription(text);
    return {
      title: `${title} | ${MetadataConfig.title}`,
      description,
    };
  } catch (err) {
    let error: string;
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = MetadataConfig.description;
    }
    return {
      title: MetadataConfig.title,
      description: error,
    };
  }
}

export default async function ViewPostPage({ params }: IPostProps) {
  const { id } = params;
  let data: IPostData | undefined;
  let error: string | undefined;
  try {
    data = await post.get(id);
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Unknown Error";
    }
  }
  return (
    <section className="flex flex-col items-center justify-center px-10">
      {data ? (
        <div className="py-40 w-full lg:w-4/5">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <Link className="flex flex-row gap-2 mt-3" href={`/user/${data.author}`}>
            <Image className="w-6 h-6 rounded-full" src={data.profile_image} width={6} height={6} alt="" />
            <span className="text-gray-100 text-base">{data.author}</span>
          </Link>
          <p className="text-gray-500 text-base mt-2">{dayjs(data.created_at).format("YYYY.MM.DD HH:mm:ss")} 게시됨</p>
          {data.edited_at !== 0 && <p className="text-gray-500 text-base">{dayjs(data.edited_at).format("YYYY.MM.DD HH:mm:ss")} 수정됨</p>}
          <hr className="border-gray-700 my-5" />
          <pre className="pretendard text-wrap overflow-hidden">
            <RenderMarkdown>{utility.escapeHTML(data.text)}</RenderMarkdown>
          </pre>
          <div className="mt-40">
            <hr className="border-gray-700" />
            <h1 className="text-4xl py-7">최근 게시글</h1>
            <RecentPosts />
          </div>
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
