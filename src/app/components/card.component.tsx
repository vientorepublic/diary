import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import type { ICardProps } from "../types";
import { Utility } from "../utility";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

const utility = new Utility();

export function PostCard(props: ICardProps) {
  const { isPublic, title, text, author, userId, profileImage, createdAt, buttonLink } = props;
  return (
    <div className="relative h-full bg-slate-800 rounded-3xl text-left p-px before:absolute before:w-80 before:h-80 before:-left-40 before:-top-40 before:bg-slate-400 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:group-hover:opacity-100 before:z-10 before:blur-[100px] after:absolute after:w-96 after:h-96 after:-left-48 after:-top-48 after:bg-indigo-500 after:rounded-full after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 after:hover:opacity-10 after:z-30 after:blur-[100px] overflow-hidden">
      <div className="relative h-full bg-slate-900 p-6 pb-8 rounded-[inherit] overflow-hidden">
        {!isPublic && <p className="text-orange-500 mb-2">비공개 게시글입니다.</p>}
        <Link className="flex flex-row gap-2" href={`/user/${userId}`}>
          <Image className="w-6 h-6 rounded-full" src={profileImage} width={6} height={6} alt="" />
          <span className="text-gray-100 text-base">{author}</span>
        </Link>
        <p className="text-gray-500 text-sm mt-1">{dayjs(createdAt).format("YYYY.MM.DD HH:mm:ss")}</p>
        <div className="flex flex-col gap-2 h-full">
          <h2 className="text-2xl text-slate-200 font-bold mt-2">{title}</h2>
          <p className="text-base text-slate-200">{utility.stripMarkdown(text)}</p>
          <Link
            className="inline-flex justify-center items-center whitespace-nowrap rounded-lg bg-slate-800 hover:bg-slate-900 border border-slate-700 px-3 py-1.5 mt-4 text-sm font-medium text-slate-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150"
            href={buttonLink}
          >
            <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            게시글 읽기
          </Link>
        </div>
      </div>
    </div>
  );
}
