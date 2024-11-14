import axios from "axios";
import type { HTMLEscapeChars, IPhrase } from "../types";
import { Markdown } from "./regex";

export class Utility {
  public shortenString(maxLength: number, str: string): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    } else {
      return str;
    }
  }
  public stripMarkdown(input: string): string {
    return input.replace(Markdown, "");
  }
  public escapeHTML(html: string): string {
    const escapeChars: HTMLEscapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };
    return html.replace(/[&<>]/g, (match) => escapeChars[match]);
  }
  public isPostId(id: string): boolean {
    const idNum = Number(id);
    return !isNaN(idNum) && Number.isInteger(idNum) && idNum > 0;
  }
  public convertDescription(input: string): string {
    const removeEOL = input.replace(/\n/g, " ");
    const plainText = this.stripMarkdown(removeEOL).trim();
    return this.shortenString(100, plainText);
  }
  public async getPhrase(): Promise<IPhrase> {
    const { data } = await axios.get<IPhrase[]>("/phrase.json");
    const index = Math.floor(Math.random() * data.length);
    return data[index];
  }
}
