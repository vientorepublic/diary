import axios, { AxiosResponse } from "axios";
import { IFetcherParams } from "../types";

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

export function swrFetcher(e: IFetcherParams): Promise<AxiosResponse> {
  return axios
    .get(e.url, {
      params: e.params,
      headers: {
        Authorization: `Bearer ${e.token}`,
      },
    })
    .then((data) => {
      return data.data;
    });
}
