import { createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import LibraryPage from '@/features/library/pages/LibraryPage';
import BookPage from '@/features/book/pages/BookPage';
import ReaderPage from '@/features/reader/pages/ReaderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LibraryPage />,
      },
      {
        path: 'book/:bookId',
        element: <BookPage />,
      },
      {
        path: 'book/:bookId/:chapterId',
        element: <ReaderPage />,
      },
    ],
  },
]);

export default router;