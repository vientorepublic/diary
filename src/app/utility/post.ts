import axios, { AxiosInstance, isAxiosError } from "axios";
import type { IPostData } from "../types";

export class Post {
  private http: AxiosInstance;
  constructor() {
    this.http = axios.create({
      baseURL: process.env.INTERNAL_API_URL,
    });
  }
  public isPostId(id: string): boolean {
    const idNum = Number(id);
    return !isNaN(idNum) && Number.isInteger(idNum) && idNum > 0;
  }
  public async get(id: string): Promise<IPostData> {
    try {
      if (!this.isPostId(id)) {
        throw new Error("게시글 ID 형식이 잘못되었습니다.");
      }
      const params = new URLSearchParams();
      params.append("id", id);
      const res = await this.http.get<IPostData>("/post/view", {
        params,
      });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message);
      } else {
        throw new Error(err.message);
      }
    }
  }
}
