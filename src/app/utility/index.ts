export class Utility {
  public shortenString(maxLength: number, str: string): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength - 3) + "...";
    } else {
      return str;
    }
  }
  public stripMarkdown(input: string) {
    const markdownPattern = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`{1,3})(.*?)\5|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|> .+|[-*+] \s*.*|#\s*.*|~~.*?~~|[\[\]()]/g;
    return input.replace(markdownPattern, "").trim();
  }
}
