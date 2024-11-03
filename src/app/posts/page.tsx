"use client";
import type { IPaginationData, IPostPreview, ISearchQuery, PostSearchTypes, SortOptions } from "../types";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetcher, swrHttp } from "../utility/fetcher";
import { PostCard } from "../components/card.component";
import { Alert } from "../components/alert.component";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Utility } from "../utility";
import useSWR from "swr";

const utility = new Utility();

export default function PostPage() {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOptions>("latest");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchError, setSearchError] = useState<string>("");
  const [searchType, setSearchType] = useState<PostSearchTypes>("title");
  const [searchResult, setSearchResult] = useState<IPaginationData<IPostPreview[]> | null>(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);
  useEffect(() => {
    function resetSearchData() {
      setSearchError("");
      setSearchResult(null);
    }
    async function searchPost(searchQuery: ISearchQuery) {
      setSearchLoading(true);
      resetSearchData();
      try {
        const { type, page, sort, query } = searchQuery;
        const params = new URLSearchParams();
        params.append("type", type);
        params.append("page", String(page));
        params.append("sort", sort);
        params.append("query", query);
        const { data } = await fetcher.get<IPaginationData<IPostPreview[]>>("/search", {
          params,
        });
        setSearchResult(data);
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          setSearchError(err.response.data.message);
        }
      } finally {
        setSearchLoading(false);
      }
    }
    if (debouncedValue) {
      searchPost({
        type: searchType,
        page: searchPage,
        query: debouncedValue,
        sort,
      });
    }
  }, [debouncedValue, searchPage, searchType, sort]);
  const { data, isLoading, error } = useSWR<IPaginationData<IPostPreview[]>>(
    {
      url: `/post/posts?page=${page}&sort=${sort}`,
    },
    swrHttp,
    {
      // Disable revalidation when input value is not empty
      revalidateOnFocus: inputValue ? false : true,
    }
  );
  return (
    <section className="flex flex-col items-center justify-center px-10">
      <div className="py-10 w-full lg:w-4/5">
        <div className="text-left py-20">
          <h1 className="text-4xl">모든 게시글</h1>
          <h2 className="text-xl mt-2">게시글은 가장 최근에 게시된 순서로 정렬됩니다.</h2>
          <div className="flex flex-col gap-3 my-7">
            {/* Search form */}
            <form>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="block w-full p-2.5 rounded-xl bg-gray-700 disabled:bg-gray-400 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="검색어를 입력해주세요."
              />
              <input
                id="radio-title"
                type="radio"
                value="title"
                defaultChecked
                onChange={() => setSearchType("title")}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="radio-title" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                제목
              </label>
              <input
                id="radio-text"
                type="radio"
                value="text"
                onChange={() => setSearchType("text")}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="radio-text" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                본문
              </label>
              <input
                id="radio-author"
                type="radio"
                value="user_id"
                onChange={() => setSearchType("user_id")}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="radio-author" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                작성자
              </label>
            </form>
            {/* Sort form */}
            <form>
              <input
                id="radio-latest"
                type="radio"
                value="latest"
                defaultChecked
                onChange={() => setSort("latest")}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="radio-latest" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                내림차순
              </label>
              <input
                id="radio-oldest"
                type="radio"
                value="oldest"
                onChange={() => setSort("oldest")}
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="radio-oldest" className="ms-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                오름차순
              </label>
            </form>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-4 justify-center items-center py-20">
              <div className="dots-loader-white"></div>
              <p className="text-xl">게시글을 불러오고 있어요...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col gap-4 justify-center items-center py-20">
              <Alert>{error.response ? error.response.data.message : error.message}</Alert>
            </div>
          ) : (
            <>
              <div className="grid grid-wrap lg:grid-cols-3 gap-5">
                {debouncedValue ? (
                  searchLoading ? (
                    <div className="flex flex-col gap-4 justify-center items-center py-20">
                      <div className="dots-loader-white"></div>
                      <p className="text-xl">검색 중...</p>
                    </div>
                  ) : searchError ? (
                    <Alert>{searchError}</Alert>
                  ) : (
                    searchResult &&
                    searchResult.data.map((e, i) => {
                      return (
                        <PostCard
                          title={utility.shortenString(10, e.title)}
                          text={utility.shortenString(50, e.preview)}
                          author={utility.shortenString(10, e.author)}
                          isPublic={true}
                          profileImage={e.profile_image}
                          createdAt={e.created_at}
                          buttonLink={`/posts/${e.id}`}
                          key={i}
                        />
                      );
                    })
                  )
                ) : (
                  data &&
                  data.data &&
                  data.data.map((e, i) => {
                    return (
                      <PostCard
                        title={utility.shortenString(10, e.title)}
                        text={utility.shortenString(50, e.preview)}
                        author={utility.shortenString(10, e.author)}
                        isPublic={true}
                        profileImage={e.profile_image}
                        createdAt={e.created_at}
                        buttonLink={`/posts/${e.id}`}
                        key={i}
                      />
                    );
                  })
                )}
              </div>
              {data && data.data && (
                <div className="flex flex-col gap-4 justify-center items-center mt-10">
                  {debouncedValue && searchResult ? (
                    <p>
                      {searchResult.pagination.currentPage} / {searchResult.pagination.lastPageNumber}
                    </p>
                  ) : (
                    !searchError && (
                      <p>
                        {data.pagination.currentPage} / {data.pagination.lastPageNumber}
                      </p>
                    )
                  )}
                  <div className="flex flex-row gap-4 justify-center items-center">
                    {debouncedValue && searchResult ? (
                      <>
                        {/* Search result pagination */}
                        <button
                          className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                          onClick={() => setSearchPage(searchPage - 1)}
                          disabled={searchError.length !== 0 || searchPage === 1}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                          Previous
                        </button>
                        <button
                          className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                          disabled={searchError.length !== 0 || searchPage === searchResult.pagination.lastPageNumber}
                          onClick={() => setSearchPage(searchPage + 1)}
                        >
                          Next
                          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </button>
                      </>
                    ) : (
                      !searchError && (
                        <>
                          {/* All posts pagination */}
                          <button
                            className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Previous
                          </button>
                          <button
                            className="px-6 py-3 mb-2 text-lg text-white bg-blue-500 disabled:bg-gray-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-700 rounded-2xl sm:w-auto sm:mb-0"
                            disabled={page === data.pagination.lastPageNumber}
                            onClick={() => setPage(page + 1)}
                          >
                            Next
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
