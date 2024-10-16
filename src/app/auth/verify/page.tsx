"use client";
import CloseTabImage from "@/app/static/image/undraw_close_tab.svg";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/app/utility/fetcher";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function VerifyPage() {
  const query = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function verifyAccount() {
      try {
        const identifier = query.get("identifier");
        if (!identifier) {
          toast.error("필수 인자가 누락되었습니다.");
          return;
        }
        // Validating Identifier
        const params = new URLSearchParams();
        params.append("identifier", identifier);
        const validate = await fetcher.get("/auth/verify/validate", {
          params,
        });
        console.debug(validate.data);
        // Applying account verification
        const result = await fetcher.post("/auth/verify", {
          identifier,
        });
        toast.success(result.data.message);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    verifyAccount();
  }, [query]);
  return (
    <section className="flex flex-col items-center text-center justify-center pt-32 mt-10 mb-48">
      <h1 className="dark:text-white text-gray text-4xl sm:text-5xl font-bold underline decoration-sky-400 mb-10">이메일 주소 인증</h1>
      <div className="flex flex-col gap-10 mt-10">
        {loading ? (
          <div className="flex flex-col gap-10 justify-center items-center">
            <div className="dots-loader-white"></div>
            <p className="text-gray dark:text-white">식별 정보를 확인하고 있습니다...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 justify-center items-center">
            <Image src={CloseTabImage} width={400} height={350} alt="close tab" />
            <p className="text-gray dark:text-white">이제 이 창을 닫아도 됩니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
