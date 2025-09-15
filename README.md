# 📖 Parchment : Project Description

## Overview

Parchment  is a **React + Vite frontend application** designed to provide a clean reading experience for books stored in Markdown format. Each book is organized in its own folder under the `public/books/` directory, with metadata and chapter structure defined in an `index.json` file.

The app follows a **vertically sliced architecture**, where each feature (Library, Book, Reader) is self-contained with its own components, pages, and API logic.

---

## 🎯 Core Features

1. **Library View**

   * Displays a list of available books.
   * Each book shows title, author, and description from its `index.json`.

2. **Book View (Table of Contents)**

   * Displays chapter list for a selected book.
   * Supports ordered chapters and optional sub-chapters.

3. **Reader View**

   * Renders Markdown content as styled text.
   * Provides navigation (Previous/Next chapter).
   * Clean, distraction-free interface.

4. **Routing**

   * `/` → Library view.
   * `/book/:bookId` → Book TOC view.
   * `/book/:bookId/:chapterId` → Reader view.

---

## 📂 File Organization

```
Parchment /
├── public/
│   └── books/
│       └── <BookName>/
│           ├── index.json
│           ├── Chapter 1.md
│           ├── Chapter 2.md
│           └── ...
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── providers.tsx
│   │   └── layout.tsx
│   │
│   ├── features/
│   │   ├── library/
│   │   ├── book/
│   │   └── reader/
│   │
│   ├── shared/
│   │   ├── components/
│   │   └── utils/
│   │
│   ├── main.tsx
│   └── index.css
```

---

## 📑 `index.json` Schema

Each book folder contains an `index.json` that defines metadata and chapters.

```json
{
  "title": "Verity",
  "author": "Colleen Hoover",
  "description": "A psychological thriller novel.",
  "chapters": [
    {
      "sl": 1,
      "id": "chapter-1",
      "title": "Chapter 1",
      "file": "Chapter 1.md",
      "subChapters": [
        {
          "sl": 1.1,
          "id": "chapter-1-1",
          "title": "Chapter 1.1 - The Beginning",
          "file": "Chapter 1.1.md"
        },
        {
          "sl": 1.2,
          "id": "chapter-1-2",
          "title": "Chapter 1.2 - First Encounter",
          "file": "Chapter 1.2.md"
        }
      ]
    },
    {
      "sl": 2,
      "id": "chapter-2",
      "title": "Chapter 2",
      "file": "Chapter 2.md"
    },
    {
      "sl": 3,
      "id": "chapter-3",
      "title": "Chapter 3",
      "file": "Chapter 3.md"
    }
  ]
}
```

### Fields:

* **title** *(string)* → Book title.
* **author** *(string)* → Author name.
* **description** *(string)* → Short book description.
* **chapters** *(array)* → Ordered list of chapters.

  * **sl** *(number)* → Serial number (supports decimals for sub-chapters).
  * **id** *(string)* → Unique identifier for the chapter.
  * **title** *(string)* → Chapter title.
  * **file** *(string)* → Markdown file name.
  * **subChapters** *(array, optional)* → Nested chapters with the same schema.

---



