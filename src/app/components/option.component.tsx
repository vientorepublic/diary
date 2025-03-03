"use client";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "nextjs-toploader/app";
import { confirmModal } from "../utility/modal";
import { getCookie } from "cookies-next";
import { axios } from "../utility/http";
import { Cookie } from "../config";
import { isAxiosError } from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import Link from "next/link";

export function PostOption({ id }: { id: number }) {
  const router = useRouter();
  const { name } = Cookie;
  const token = getCookie(name);
  function confirmDelete(id: number) {
    confirmModal({
      title: "잠시만요!",
      message: "정말 게시글을 삭제 하시겠어요? 삭제된 게시글은 복구할 수 없어요.",
      callback: () => removePost(id),
    });
  }
  async function removePost(id: number) {
    try {
      const params = new URLSearchParams();
      params.append("id", String(id));
      const { data } = await axios.delete("/post/remove", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/post/myPost");
      toast.success(data.message);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  return (
    <div className="flex flex-row gap-3 mt-3">
      <button
        className="px-4 py-2 mb-2 text-sm text-white bg-red-500 disabled:bg-gray-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-700 rounded-xl sm:w-auto sm:mb-0"
        onClick={() => confirmDelete(id)}
      >
        <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
        삭제
      </button>
      <Link
        href={`/write?post_id=${id}`}
        className="px-4 py-2 mb-2 text-sm text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-xl sm:w-auto sm:mb-0"
      >
        <FontAwesomeIcon icon={faEdit} className="mr-1" />
        수정
      </Link>
    </div>
  );
}
