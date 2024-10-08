"use client";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { RenderMarkdown } from "@/app/components/markdown.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "@/app/components/alert.component";
import { confirmAlert } from "react-confirm-alert";
import { useRouter } from "nextjs-toploader/app";
import { fetcher } from "@/app/utility/fetcher";
import type { IPostData } from "@/app/types";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Utility } from "@/app/utility";
import { isAxiosError } from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import Image from "next/image";
import dayjs from "dayjs";

const utility = new Utility();

export default function ViewPrivatePostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const token = getCookie("access_token");
  const [fetching, setFetching] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [post, setPost] = useState<IPostData>();
  function confirmDelete(id: number) {
    confirmAlert({
      title: "잠시만요!",
      message: "정말 게시글을 삭제 하시겠어요? 삭제된 게시글은 복구할 수 없어요.",
      buttons: [
        {
          label: "예",
          onClick: () => {
            removePost(id);
          },
        },
        {
          label: "아니요",
          onClick: () => {
            return;
          },
        },
      ],
    });
  }
  async function removePost(id: number) {
    setDisabled(true);
    try {
      const params = new URLSearchParams();
      params.append("id", String(id));
      const res = await fetcher.delete("/post/remove", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/posts/myPosts");
      toast.success(res.data.message);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setDisabled(false);
    }
  }
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
            <div className="flex flex-row gap-2 mt-3">
              <Image className="w-6 h-6 rounded-full" src={post.profile_image} width={6} height={6} alt="" />
              <span className="text-gray-100 text-base">{post.author}</span>
            </div>
            <p className="text-gray-500 text-base mt-2">{dayjs(post.created_at).format("YYYY.MM.DD HH:mm:ss")}</p>
            <div className="flex flex-row gap-3 mt-3">
              <button
                className="px-4 py-2 mb-2 text-sm text-white bg-red-500 disabled:bg-gray-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-700 rounded-xl sm:w-auto sm:mb-0"
                onClick={() => confirmDelete(post.id)}
                disabled={disabled}
              >
                <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                삭제
              </button>
              <button
                className="px-4 py-2 mb-2 text-sm text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-xl sm:w-auto sm:mb-0"
                onClick={() => router.push(`/write?post_id=${post.id}`)}
                disabled={disabled}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                수정
              </button>
            </div>
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
