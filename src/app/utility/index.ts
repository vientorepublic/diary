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
    const plainText = input.replace(markdownRegex, "");
    return plainText;
  }
  public escapeHTML(html: string): string {
    const escapeChars: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };
    return html.replace(/[&<>]/g, (match) => escapeChars[match]);
  }
}
