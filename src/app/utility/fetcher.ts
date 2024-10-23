import type { IFetcherParams } from "../types";
import axios from "axios";

export const fetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
});

export async function swrFetcher(params: IFetcherParams) {
  const { url, token } = params;
  const data = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.data;
}
