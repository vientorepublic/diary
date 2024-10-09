/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { faBold, faExpand, faEye, faHeading, faImage, faItalic, faLink, faTrashCan, faUpload } from "@fortawesome/free-solid-svg-icons";
import type { IDraftPost, IPostData, IWritePost } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "../components/alert.component";
import { confirmAlert } from "react-confirm-alert";
import { useSearchParams } from "next/navigation";
import { useReCaptcha } from "next-recaptcha-v3";
import { useRouter } from "nextjs-toploader/app";
import { fetcher } from "../utility/fetcher";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { isAxiosError } from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const maxTitleLength = 50;
const maxTextLength = 5000;
const autoSavePeriod = 10000;

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 justify-center items-center h-400px">
      <div className="dots-loader-white"></div>
      <p className="phrase-text text-2xl">텍스트 편집기를 불러오고 있어요...</p>
    </div>
  ),
});

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post_id");
  const accessToken = getCookie("access_token");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  const [draftLoaded, setDraftLoaded] = useState<boolean>(false);
  const [publicPost, setPublicPost] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [lastCheckpoint, setLastCheckpoint] = useState({
    title: "",
    text: "",
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const titleLengthExceed = title.trim().length > maxTitleLength;
  const textLengthExceed = text.trim().length > maxTextLength;
  const { executeRecaptcha } = useReCaptcha();
  async function publish(data: IWritePost, public_post: boolean) {
    if (!data.title.trim() || !data.text.trim()) {
      toast.error("제목 또는 본문이 비어있습니다.");
      return;
    }
    setUploading(true);
    try {
      const token = await executeRecaptcha("write_post");
      const res = await fetcher.post(
        "/post/save",
        {
          title: data.title.trim(),
          text: data.text.trim(),
          g_recaptcha_response: token,
          public_post,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (publicPost) {
        router.push("/posts");
      } else {
        router.push("/posts/myPosts");
      }
      toast.success(res.data.message);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setUploading(false);
    }
  }
  async function editPost(data: IWritePost, public_post: boolean) {
    if (!data.title.trim() || !data.text.trim()) {
      toast.error("제목 또는 본문이 비어있습니다.");
      return;
    }
    setUploading(true);
    try {
      const token = await executeRecaptcha("edit_post");
      const res = await fetcher.patch(
        "/post/edit",
        {
          id: Number(postId), // Post ID
          title: data.title.trim(),
          text: data.text.trim(),
          g_recaptcha_response: token,
          public_post,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (publicPost) {
        router.push("/posts");
      } else {
        router.push("/posts/myPosts");
      }
      toast.success(res.data.message);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setUploading(false);
    }
  }
  // Check edit mode
  useEffect(() => {
    async function getPost(id: string) {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const res = await fetcher.get<IPostData>("/post/viewPrivate", {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { title, text } = res.data;
        setTitle(title);
        setText(text);
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
    if (postId) {
      getPost(postId);
      setAutoSaveEnabled(false);
      setIsEditMode(true);
    }
  }, [accessToken, postId]);
  // Load Draft
  useEffect(() => {
    async function loadDraft() {
      try {
        const res = await fetcher.get<IDraftPost>("/post/draft/loadDraft", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { title, text } = res.data;
        setTitle(title);
        setText(text);
        setLastCheckpoint({
          title,
          text,
        });
        setDraftLoaded(true);
        toast.success("마지막 지점의 초안을 불러왔습니다.");
      } catch (err) {}
    }
    if (!postId) loadDraft();
  }, [accessToken, postId]);
  // Auto Save
  useEffect(() => {
    async function saveDraft(data: IWritePost) {
      try {
        fetcher.post(
          "/post/draft/saveDraft",
          {
            ...data,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLastCheckpoint({
          ...data,
        });
        if (!draftLoaded) setDraftLoaded(true);
        toast.success("초안이 자동 저장되었습니다.");
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          toast.error(err.response.data.message);
        }
      }
    }
    // Disable auto save when browser lost focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setAutoSaveEnabled(false);
      } else {
        setAutoSaveEnabled(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const autoSave = setInterval(() => {
      const { title: checkpointTitle, text: checkpointText } = lastCheckpoint;
      if (title && text && autoSaveEnabled) {
        if (checkpointTitle !== title || checkpointText !== text) {
          saveDraft({ title, text });
        }
      }
    }, autoSavePeriod);
    return () => {
      // Clear browser window focus listener
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Clear auto save interval
      clearInterval(autoSave);
    };
  }, [accessToken, autoSaveEnabled, draftLoaded, lastCheckpoint, text, title]);
  function confirmRemoveDraft() {
    confirmAlert({
      title: "잠시만요!",
      message: "정말 저장된 초안을 삭제 하시겠어요? 현재 작성 중인 내용도 함께 삭제됩니다.",
      buttons: [
        {
          label: "예",
          onClick: () => {
            removeDraft();
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
  async function removeDraft() {
    try {
      const res = await fetcher.delete("/post/draft/removeDraft", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTitle("");
      setText("");
      setLastCheckpoint({
        title: "",
        text: "",
      });
      setDraftLoaded(false);
      toast.success(res.data.message);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error(err.response.data.message);
      }
    }
  }
  return (
    <section className="flex flex-col items-center justify-center px-10 py-20">
      <div className="py-10 w-full md:w-4/5">
        <div className="flex flex-col gap-3 py-5">
          <Alert>일부 마크다운 문법을 지원합니다. 지원 범위는 추후 확대 될 예정입니다.</Alert>
          <Alert>게시하기 전에 제목, 본문 내용이 가이드라인을 위반하지 않는지 다시 한 번 확인 부탁드립니다.</Alert>
        </div>
        <div className="mb-1">
          <h1 className="text-2xl text-gray-100">제목</h1>
          <p className="text-gray-500 text-sm">
            {title.trim().length}/{maxTitleLength}
          </p>
          {title.trim().length > maxTitleLength && <p className="text-orange-500 text-sm">제목은 50바이트를 초과할 수 없습니다.</p>}
        </div>
        <input
          type="text"
          className="block w-full p-2.5 rounded-xl bg-gray-700 disabled:bg-gray-400 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 mb-5"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
          required
        />
        <div className="mb-1">
          <h1 className="text-2xl text-gray-100">본문</h1>
          <p className="text-gray-500 text-sm">
            {text.trim().length}/{maxTextLength}
          </p>
          {text.trim().length > maxTextLength && <p className="text-orange-500 text-sm">본문은 5000바이트를 초과할 수 없습니다.</p>}
        </div>
        <MarkdownEditor value={text} onChange={setText} height="400px" aria-disabled={uploading} autoFocus />
        <input
          id="default-checkbox"
          type="checkbox"
          defaultChecked
          onClick={() => setPublicPost(!publicPost)}
          className="w-4 h-4 mt-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="default-checkbox" className="ms-2 mr-3 text-sm font-medium text-gray-300">
          게시글을 공개합니다.
        </label>
        {draftLoaded && (
          <button className="text-sm text-gray-100 bg-red-500 hover:bg-red-600 px-3 py-3 rounded-xl mt-5" onClick={() => confirmRemoveDraft()}>
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            초안 삭제
          </button>
        )}
        <div className="sm:flex sm:items-center sm:justify-between">
          <button
            className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl my-5"
            onClick={() => (isEditMode ? editPost({ title, text }, publicPost) : publish({ title, text }, publicPost))}
            disabled={uploading || titleLengthExceed || textLengthExceed}
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            {isEditMode ? "저장하기" : "게시하기"}
          </button>
          <div className="my-5 text-lg phrase-text">
            <h1 className="text-3xl text-bold">도움말</h1>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faEye} className="mt-1.5" />
              <p>: 미리보기 패널을 엽니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faExpand} className="mt-1.5" />
              <p>: 편집기를 전체화면으로 전환합니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faHeading} className="mt-1.5" />
              <p>: 제목을 삽입합니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faBold} className="mt-1.5" />
              <p>: 굵은 글씨(강조)를 사용합니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faItalic} className="mt-1.5" />
              <p>: 기울임(이텔릭)을 사용합니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faLink} className="mt-1.5" />
              <p>: 링크를 삽입합니다.</p>
            </div>
            <div className="flex flex-row gap-2">
              <FontAwesomeIcon icon={faImage} className="mt-1.5" />
              <p>: 외부 링크로부터 사진을 삽입합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
