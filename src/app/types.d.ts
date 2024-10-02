/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IPhraseData {
  text: string;
  author: string;
}

export interface IPhrase extends Array<IPhraseData> {}
