import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center p-2 text-sm rounded-lg bg-gray-800 text-blue-400" role="alert">
      <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
      {children}
    </div>
  );
}
