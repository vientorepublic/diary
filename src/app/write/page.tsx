/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { faBold, faExpand, faEye, faItalic, faQuoteRight, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@uiw/react-markdown-editor/markdown-editor.css";
import type { IDraftPost, IWritePost } from "../types";
import { Alert } from "../components/alert.component";
import "@uiw/react-markdown-preview/markdown.css";
import { useReCaptcha } from "next-recaptcha-v3";
import { useRouter } from "nextjs-toploader/app";
import { fetcher } from "../utility/fetcher";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const maxTitleLength = 50;
const maxTextLength = 5000;
const autoSavePeriod = 20000;

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
  const accessToken = getCookie("access_token");
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
  async function removeDraft() {
    try {
      fetcher.delete("/post/draft/removeDraft", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {}
  }
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
          public_post: public_post ? "1" : undefined,
          g_recaptcha_response: token,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      removeDraft();
      router.push("/posts");
      toast.success(res.data.message);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      }
    } finally {
      setUploading(false);
    }
  }
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
        toast.success("마지막 지점의 초안을 불러왔습니다.");
      } catch (err) {}
    }
    loadDraft();
  }, [accessToken]);
  // Save Draft Every 20s
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
        toast.success("초안이 자동 저장되었습니다.");
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      }
    }
    const id = setInterval(() => {
      if (title && text) {
        if (lastCheckpoint.title !== title || lastCheckpoint.text !== text) {
          saveDraft({ title, text });
        }
      }
    }, autoSavePeriod);
    return () => clearInterval(id);
  }, [accessToken, lastCheckpoint.text, lastCheckpoint.title, text, title]);
  return (
    <section className="flex flex-col items-center justify-center px-10 py-20">
      <div className="py-10 w-full md:w-4/5">
        <div className="mb-1">
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
          <p className="text-gray-500 text-sm">
            {text.trim().length}/{maxTextLength}
          </p>
          {text.trim().length > maxTextLength && <p className="text-orange-500 text-sm">본문은 5000바이트를 초과할 수 없습니다.</p>}
        </div>
        <MarkdownEditor value={text} onChange={setText} height="400px" aria-disabled={uploading} autoFocus />
        <div className="flex flex-col gap-3 py-5">
          <Alert>일부 마크다운 문법을 지원합니다. 지원 범위는 추후 확대 될 예정입니다.</Alert>
          <Alert>게시하기 전에 제목, 본문 내용이 가이드라인을 위반하지 않는지 다시 한 번 확인 부탁드립니다.</Alert>
        </div>
        <div className="sm:flex sm:items-center sm:justify-between">
          <button
            className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
            onClick={() => publish({ title, text }, true)}
            disabled={uploading || titleLengthExceed || textLengthExceed}
          >
            게시하기
            <FontAwesomeIcon icon={faUpload} className="ml-2" />
          </button>
          <div className="phrase-text">
            <h1 className="text-3xl text-bold">도움말</h1>
            <div className="flex flex-row gap-2 text-lg">
              <FontAwesomeIcon icon={faEye} className="mt-1.5" />
              <p>: 미리보기 패널을 엽니다.</p>
            </div>
            <div className="flex flex-row gap-2 text-lg">
              <FontAwesomeIcon icon={faExpand} className="mt-1.5" />
              <p>: 편집기를 전체화면으로 전환합니다.</p>
            </div>
            <div className="flex flex-row gap-2 text-lg">
              <FontAwesomeIcon icon={faBold} className="mt-1.5" />
              <p>: 굵은 글씨(강조)를 사용합니다.</p>
            </div>
            <div className="flex flex-row gap-2 text-lg">
              <FontAwesomeIcon icon={faItalic} className="mt-1.5" />
              <p>: 기울임(이텔릭)을 사용합니다.</p>
            </div>
            <div className="flex flex-row gap-2 text-lg">
              <FontAwesomeIcon icon={faQuoteRight} className="mt-1.5" />
              <p>: 인용문을 넣습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
