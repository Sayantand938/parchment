export interface Chapter {
  sl: number;
  id: string;
  title: string;
  file: string;
  subChapters?: Chapter[];
}

export interface BookIndex {
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
  cover?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover?: string;
}