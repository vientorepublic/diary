import type { IFetcherParams } from "../types";
import _axios from "axios";
const { create } = _axios;

export const axios = create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
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
