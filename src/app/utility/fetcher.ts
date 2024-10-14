import axios, { AxiosResponse } from "axios";
import { IFetcherParams } from "../types";

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

export async function swrFetcher(e: IFetcherParams): Promise<AxiosResponse> {
  const { url, token } = e;
  const data = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
