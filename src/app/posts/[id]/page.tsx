import type { IPostData, IViewPostParams } from "@/app/types";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";

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

export default async function ViewPostPage({ params }: { params: IViewPostParams }) {
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
          <p className="mt-2">{post.text}</p>
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
