"use client";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from "react-confirm-alert";
import { useRouter } from "nextjs-toploader/app";
import type { PostOptionProps } from "../types";
import { fetcher } from "../utility/fetcher";
import { getCookie } from "cookies-next";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Cookie } from "../constants";

export function PostOption(props: PostOptionProps) {
  const router = useRouter();
  const { postId } = props;
  const { name } = Cookie;
  const token = getCookie(name);
  const [disabled, setDisabled] = useState<boolean>(false);
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
  return (
    <div className="flex flex-row gap-3 mt-3">
      <button
        className="px-4 py-2 mb-2 text-sm text-white bg-red-500 disabled:bg-gray-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-700 rounded-xl sm:w-auto sm:mb-0"
        onClick={() => confirmDelete(postId)}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
        삭제
      </button>
      <button
        className="px-4 py-2 mb-2 text-sm text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-xl sm:w-auto sm:mb-0"
        onClick={() => router.push(`/write?post_id=${postId}`)}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faEdit} className="mr-1" />
        수정
      </button>
    </div>
  );
}
