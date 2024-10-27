import axios, { AxiosInstance, isAxiosError } from "axios";
import type { IPostData } from "../types";
import { Utility } from ".";

const utility = new Utility();

export class Post {
  private http: AxiosInstance;
  constructor() {
    this.http = axios.create({
      baseURL: process.env.INTERNAL_API_URL,
    });
  }
  public async get(id: string): Promise<IPostData> {
    try {
      if (!utility.isPostId(id)) {
        throw new Error("게시글 ID 형식이 잘못되었습니다.");
      }
      const params = new URLSearchParams();
      params.append("id", id);
      const { data } = await this.http.get<IPostData>("/post/view", {
        params,
      });
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message);
      } else if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("Failed to fetch post data");
      }
    }
  }
}
