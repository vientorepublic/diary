import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ICardParams } from "../types";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

export function PostCard(params: ICardParams) {
  return (
    <div
      className={`${params.className} relative h-full bg-slate-800 rounded-3xl text-left p-px before:absolute before:w-80 before:h-80 before:-left-40 before:-top-40 before:bg-slate-400 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:group-hover:opacity-100 before:z-10 before:blur-[100px] after:absolute after:w-96 after:h-96 after:-left-48 after:-top-48 after:bg-indigo-500 after:rounded-full after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:hover:opacity-10 after:z-30 after:blur-[100px] overflow-hidden`}
    >
      <div className="relative h-full bg-slate-900 p-6 pb-8 rounded-[inherit] z-20 overflow-hidden">
        <div className="flex flex-row gap-2">
          <Image className="w-7 h-7 rounded-full" src={params.profileImage} width={7} height={7} alt="" />
          <span className="text-gray-100 text-base">viento</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{dayjs(params.createdAt).format("YYYY.MM.DD HH:mm:ss")}</p>
        <div className="flex flex-col gap-2 h-full">
          <h2 className="text-2xl text-slate-200 font-bold mt-2">{params.title}</h2>
          <p className="text-base text-slate-200">{params.text}</p>
          <Link
            className="inline-flex justify-center items-center whitespace-nowrap rounded-lg bg-slate-800 hover:bg-slate-900 border border-slate-700 px-3 py-1.5 mt-4 text-sm font-medium text-slate-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150"
            href={params.buttonLink}
          >
            <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            게시글 읽기
          </Link>
        </div>
      </div>
    </div>
  );
}