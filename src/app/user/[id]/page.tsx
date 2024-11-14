import { faCheckCircle, faGear, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { UserActivity } from "@/app/components/activity.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@/app/components/tooltip.component";
import { MetadataConfig } from "@/app/constants";
import type { IUserProfile } from "@/app/types";
import { User } from "@/app/utility/ssr";
import { Metadata } from "next";
import Image from "next/image";
import dayjs from "dayjs";

const user = new User();

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  try {
    const { user_id, profile_image } = await user.get(id);
    return {
      title: `사용자:${user_id} | ${MetadataConfig.title}`,
      openGraph: {
        images: profile_image,
      },
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

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  let data: IUserProfile | undefined;
  let error: string | undefined;
  try {
    data = await user.get(id);
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
          <div className="flex flex-col items-center justify-center text-center">
            <Image className="w-32 h-32 rounded-full mb-4" src={data.profile_image} width={150} height={150} alt="" priority />
            <div className="flex flex-row gap-2">
              <h1 className="text-3xl font-bold">{data.user_id}</h1>
              {data.verified ? (
                <Tooltip message="이 계정은 이메일 인증을 받았습니다.">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-sky-500 text-xl" />
                </Tooltip>
              ) : (
                <Tooltip message="이 계정은 아직 인증되지 않았습니다.">
                  <FontAwesomeIcon icon={faXmarkCircle} className="text-orange-500 text-xl" />
                </Tooltip>
              )}
              {data.permission === 1 && (
                <Tooltip message="이 계정은 특수 권한을 가지고 있습니다.">
                  <FontAwesomeIcon icon={faGear} className="text-green-500 text-xl" />
                </Tooltip>
              )}
            </div>
            <h2 className="text-xl">
              공개 게시글 {data.stats.postCount}개 / 최근 활동일:{" "}
              {data.stats.lastActivityDate ? dayjs(data.stats.lastActivityDate).format("YYYY.MM.DD HH:mm:ss") : "N/A"}
            </h2>
          </div>
          <UserActivity id={data.user_id} sort="latest" />
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
