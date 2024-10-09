import type { HTMLEscapeChars } from "../types";

export class Utility {
  public shortenString(maxLength: number, str: string): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    } else {
      return str;
    }
  }
  public stripMarkdown(input: string) {
    const markdownRegex = /[*_~`#+\-\[\]{}|<>]/g;
    return input.replace(markdownRegex, "");
  }
  public escapeHTML(html: string): string {
    const escapeChars: HTMLEscapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };
    return html.replace(/[&<>]/g, (match) => escapeChars[match]);
  }
  public isPostId(id: string) {
    const idNum = Number(id);
    return !isNaN(idNum) && Number.isInteger(idNum) && idNum > 0;
  }
}
