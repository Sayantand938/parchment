import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import type { LibraryBook, Chapter } from '@/shared/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { BookOpen } from 'lucide-react';

interface BookChaptersIndex {
  chapters: Chapter[];
}

const ChapterList = ({ chapters, bookId, bookMetadata, level = 0 }: { chapters: Chapter[], bookId: string, bookMetadata: LibraryBook, level?: number }) => (
  <ul className={level > 0 ? 'pl-6' : ''}>
    {chapters.map((chapter) => (
      <li key={chapter.id} className="py-2 border-b last:border-b-0">
        <div className="flex justify-between items-center">
          <span className="text-foreground">{chapter.sl}. {chapter.title}</span>
          <Button asChild variant="ghost" size="sm">
            <Link to={`/book/${bookId}/${chapter.id}`} state={{ bookMetadata, chapters }}>Read</Link>
          </Button>
        </div>
        {chapter.subChapters && (
          <ChapterList chapters={chapter.subChapters} bookId={bookId} bookMetadata={bookMetadata} level={level + 1} />
        )}
      </li>
    ))}
  </ul>
);

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const location = useLocation();

  const [bookMetadata, setBookMetadata] = useState<LibraryBook | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;
    const metadataFromState = location.state?.book as LibraryBook;

    if (!metadataFromState) {
      setError('Book details not found. Please return to the library and select a book again.');
      setLoading(false);
      return;
    }
    
    setBookMetadata(metadataFromState);

    const fetchBookChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/books/${bookId}/index.json`);
        if (!response.ok) throw new Error('Failed to load book chapters.');
        
        await new Promise(resolve => setTimeout(resolve, 250));
        const data: BookChaptersIndex = await response.json();
        setChapters(data.chapters);
      } catch (e) {
        setError(`Failed to fetch book details. Please make sure /public/books/${bookId}/index.json exists and contains chapters.`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBookChapters();
  }, [bookId, location.state]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {/* Left Column Skeleton */}
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            
            {/* Right Column Skeleton */}
            <div className="md:col-span-2 space-y-8">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-7 w-1/3 mb-4 border-b pb-2" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-5 w-3/5" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!bookMetadata) {
    return <p>Book not found.</p>;
  }

  return (
    <div className="space-y-8">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Library</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{bookMetadata.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        {/* --- NEW LAYOUT CONTAINER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* --- LEFT COLUMN: COVER --- */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden sticky top-8">
              {bookMetadata.cover ? (
                <img
                    src={bookMetadata.cover}
                    alt={`Cover for ${bookMetadata.title}`}
                    className="w-full h-full object-cover aspect-[2/3]"
                />
              ) : (
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4 text-center aspect-[2/3]">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="font-semibold">{bookMetadata.title}</span>
                </div>
              )}
            </Card>
          </div>

          {/* --- RIGHT COLUMN: DETAILS & CHAPTERS --- */}
          <div className="md:col-span-2 space-y-8">
            {/* Book Details */}
            <div>
                <h2 className="text-3xl font-bold">{bookMetadata.title}</h2>
                <p className="text-muted-foreground text-lg">by {bookMetadata.author}</p>
                <p className="mt-4 text-lg leading-relaxed">{bookMetadata.description}</p>
            </div>
            
            {/* Table of Contents */}
            <div>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Table of Contents</h3>
                <ChapterList chapters={chapters} bookId={bookId!} bookMetadata={bookMetadata} />
            </div>
          </div>

        </div>
    </div>
  );
}