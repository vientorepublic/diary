import axios, { AxiosInstance, isAxiosError } from "axios";
import type { IUserProfile } from "../types";

export class User {
  private http: AxiosInstance;
  constructor() {
    this.http = axios.create({
      baseURL: process.env.INTERNAL_API_URL,
    });
  }
  public async get(id: string): Promise<IUserProfile> {
    try {
      const params = new URLSearchParams();
      params.append("id", id);
      const { data } = await this.http.get<IUserProfile>("/auth/user/userProfile", {
        params,
      });
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message);
      } else if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("Failed to fetch user data");
      }
    }
  }
}
