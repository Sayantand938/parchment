import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { LibraryBook, Chapter } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';

// Helper function to flatten the chapter tree for easy navigation
const flattenChapters = (chapters: Chapter[]): Chapter[] => {
  const flattened: Chapter[] = [];
  chapters.forEach(chapter => {
    flattened.push({ ...chapter, subChapters: undefined }); // Push parent chapter without subchapters
    if (chapter.subChapters) {
      flattened.push(...flattenChapters(chapter.subChapters));
    }
  });
  return flattened;
};

export default function ReaderPage() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState('');
  // State for data received from the router
  const [bookMetadata, setBookMetadata] = useState<LibraryBook | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId || !chapterId) return;

    // Get all necessary data from the router state passed by BookPage
    const metadataFromState = location.state?.bookMetadata as LibraryBook;
    const chaptersFromState = location.state?.chapters as Chapter[];

    if (!metadataFromState || !chaptersFromState) {
      setError("Chapter data not found. Please return to the book's table of contents.");
      setLoading(false);
      return;
    }

    setBookMetadata(metadataFromState);

    const fetchChapterContent = async () => {
      try {
        setLoading(true);

        const allChapters = flattenChapters(chaptersFromState);
        const currentIndex = allChapters.findIndex(c => c.id === chapterId);

        if (currentIndex === -1) {
          throw new Error('Chapter not found in the provided list.');
        }

        const chapter = allChapters[currentIndex];
        setCurrentChapter(chapter);
        setPrevChapter(currentIndex > 0 ? allChapters[currentIndex - 1] : null);
        setNextChapter(currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null);
        
        // This is now the ONLY fetch call in this component
        const contentResponse = await fetch(`/books/${bookId}/${chapter.file}`);
        if (!contentResponse.ok) throw new Error(`Failed to load chapter content for ${chapter.file}.`);
        
        // Simulate a slight delay to prevent jarring content flash
        await new Promise(resolve => setTimeout(resolve, 150));
        const markdown = await contentResponse.text();
        setContent(markdown);
      } catch (e) {
        setError(`Failed to load chapter. Please ensure all files are correctly placed in /public/books/${bookId}/.`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterContent();
  }, [bookId, chapterId, location.state]);

  const handlePrevClick = () => {
    if (prevChapter) {
        navigate(`/book/${bookId}/${prevChapter.id}`, { state: location.state });
    }
  };

  const handleNextClick = () => {
    if (nextChapter) {
        navigate(`/book/${bookId}/${nextChapter.id}`, { state: location.state });
    }
  };


  if (loading) {
    return (
        <div className="space-y-6 animate-pulse">
            <Skeleton className="h-5 w-3/4" />
            <div className="space-y-4 pt-4">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <br/>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="flex justify-between mt-8 pt-4 border-t">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!bookMetadata || !currentChapter) {
    return <p>Content not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/">Library</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
             {/* Pass state back to BookPage if user clicks breadcrumb */}
            <BreadcrumbLink asChild><Link to={`/book/${bookId}`} state={{ book: bookMetadata }}>{bookMetadata.title}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentChapter.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-3xl font-bold">{currentChapter.title}</h1>

      <article className="prose dark:prose-invert max-w-none [&_p]:my-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <div className="flex justify-between mt-8 pt-4 border-t">
        {prevChapter ? (
          <Button variant="outline" onClick={handlePrevClick}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {prevChapter.title}
          </Button>
        ) : <div />}
        {nextChapter ? (
          <Button variant="outline" onClick={handleNextClick}>
            {nextChapter.title}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : <div />}
      </div>
    </div>
  );
}