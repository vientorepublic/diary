"use client";
import { faCircleExclamation, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IUserProfile } from "../types";
import { useEffect, useState } from "react";
import { axios } from "../utility/http";

export function Alert({ children }: { children: string }) {
  return (
    <div className="flex items-center p-2 text-sm rounded-lg bg-gray-800 text-blue-400" role="alert">
      <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
      {children}
    </div>
  );
}

export function Warning({ children }: { children: string }) {
  return (
    <div className="flex items-center p-2 text-sm rounded-lg bg-gray-800 text-orange-400" role="alert">
      <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
      {children}
    </div>
  );
}

export function VerificationAlert({ id }: { id: string }) {
  const [verified, setVerified] = useState<boolean>(true);
  useEffect(() => {
    async function checkVerification(id: string) {
      try {
        const params = new URLSearchParams();
        params.append("id", id);
        const { data } = await axios.get<IUserProfile>("/auth/user/userProfile", {
          params,
        });
        setVerified(data.verified);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}
    }
    if (id) checkVerification(id);
  }, [id]);
  return (
    !verified && (
      <Warning>계정의 이메일 주소가 아직 인증되지 않았습니다. 이메일 수신함을 확인해 주세요. 미인증 계정은 가입 후 24시간 동안 유효합니다.</Warning>
    )
  );
}
