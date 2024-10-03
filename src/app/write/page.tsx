"use client";
import { faBold, faExpand, faEye, faItalic, faQuoteRight, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";

const MarkdownEditor = dynamic(() => import("@uiw/react-markdown-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="dots-loader-white"></div>
      <p className="phrase-text text-2xl">텍스트 편집기를 불러오고 있어요...</p>
    </div>
  ),
});

export default function WritePage() {
  const [text, setText] = useState<string>("");
  return (
    <section className="flex flex-col items-center justify-center px-10 py-40">
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-gray-100 text-4xl sm:text-5xl font-bold underline decoration-sky-400">새 글 쓰기</h1>
        <Link href="/" className="text-sky-500 text-lg">
          처음으로 돌아가기
        </Link>
      </div>
      <div className="py-10 w-full md:w-4/5">
        <MarkdownEditor value={text} onChange={setText} height="400px" autoFocus />
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="mt-10">
            <button className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0">
              게시하기
              <FontAwesomeIcon icon={faUpload} className="ml-2" />
            </button>
          </div>
          <div className="mt-10 phrase-text">
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
