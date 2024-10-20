import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-10 md:mb-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold">diary.viento.me</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">Resources</h2>
              <ul className="text-gray-400 font-medium">
                <li>
                  <a href="https://github.com/vientorepublic/diary" className="hover:underline">
                    소스코드
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">Legal</h2>
              <ul className="text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/PrivacyPolicy" className="hover:underline">
                    개인정보 보호정책
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/Guideline" className="hover:underline">
                    가이드라인
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            {new Date().getFullYear()}{" "}
            <a href="https://github.com/vientorepublic/" className="text-blue-500">
              Viento
            </a>
          </p>
          <p className="text-sm text-gray-500 sm:text-center dark:text-gray-400">모든 글은 해당 저작자가 권리를 갖습니다.</p>
        </div>
      </div>
    </footer>
  );
}
