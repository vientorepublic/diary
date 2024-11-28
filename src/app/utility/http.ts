import type { IFetcherParams } from "../types";
import _axios from "axios";

export const axios = _axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function fetcher(params: IFetcherParams) {
  const { url, token } = params;
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}
