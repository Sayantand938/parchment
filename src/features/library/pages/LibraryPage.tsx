// src/features/library/pages/LibraryPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryBook } from '@/shared/types';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Input } from '@/shared/components/ui/input';
import { BookOpen, Search } from 'lucide-react';

export default function LibraryPage() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/books/manifest.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        await new Promise(resolve => setTimeout(resolve, 250));
        const data: LibraryBook[] = await response.json();
        setBooks(data);
      } catch (e) {
        setError('Failed to fetch the library. Please make sure /public/books/manifest.json exists.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center text-center gap-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full max-w-lg" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Parchment</h1>
        <p className="text-muted-foreground max-w-xl">
          Browse and search for your favorite books. Click on a book to see its chapters and start reading.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title, author, or description..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div>
        {filteredBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <Link 
                to={`/book/${book.id}`} 
                key={book.id} 
                className="block hover:no-underline group"
                state={{ book }}
              >
                  <Card className="overflow-hidden relative aspect-[2/3] transition-all group-hover:shadow-xl group-hover:-translate-y-1.5">
                      {book.cover ? (
                      <img
                          src={book.cover}
                          alt={`Cover for ${book.title}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      ) : (
                          <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4 text-center">
                              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                              <span className="font-semibold">{book.title}</span>
                          </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg drop-shadow-sm line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-gray-200 drop-shadow-sm truncate">{book.author}</p>
                      </div>
                  </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
              <p className="text-muted-foreground">No books found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}