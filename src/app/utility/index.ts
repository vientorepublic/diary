import type { HTMLEscapeChars } from "../types";

export class Utility {
  public shortenString(maxLength: number, str: string): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    } else {
      return str;
    }
  }
  public stripMarkdown(input: string): string {
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
  public convertDescription(input: string): string {
    const removeEOL = input.replace(/\n/g, " ");
    const plainText = this.stripMarkdown(removeEOL);
    return this.shortenString(50, plainText);
  }
}
