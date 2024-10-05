"use client";
import { Alert } from "@/app/components/alert.component";
import { IUserProfile } from "@/app/types";
import { fetcher } from "@/app/utility/fetcher";
import { isAxiosError } from "axios";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";

export default function UserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<IUserProfile>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    async function getUser(id: string) {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const res = await fetcher.get("/auth/user/userProfile", {
          params,
        });
        setUser(res.data);
      } catch (err) {
        if (isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data.message);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    getUser(id);
  }, [id]);
  return (
    <section className="flex flex-col items-center justify-center px-10">
      <div className="py-10 w-full lg:w-4/5">
        <div className="text-center">
          {loading ? (
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
              <div className="dots-loader-white"></div>
              <p className="phrase-text text-2xl">프로필을 불러오고 있어요...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col gap-4 justify-center items-center h-screen">
              <Alert>{error}</Alert>
            </div>
          ) : (
            user && (
              <>
                <div className="flex flex-col gap-5 py-20 items-center justify-center">
                  <Image className="w-32 h-32 rounded-full" src={user?.profile_image} width={150} height={150} alt="" priority />
                  <h1 className="text-3xl font-bold">{user.user_id}</h1>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}
