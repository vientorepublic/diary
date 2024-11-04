import { ReactNode } from "react";

export function Tooltip({ message, children }: { message: string; children: ReactNode }) {
  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div className="absolute left-1/2 top-10 ml-auto mr-auto min-w-max -translate-x-1/2 scale-0 transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-100 group-hover:scale-100">
        <div className="flex max-w-xs flex-col items-center shadow-lg">
          <div className="clip-bottom h-2 w-4 bg-gray-800"></div>
          <div className="rounded bg-gray-800 p-2 text-center text-xs text-white">{message}</div>
        </div>
      </div>
    </div>
  );
}
