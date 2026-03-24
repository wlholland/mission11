import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';
import type { Book } from '../types/Book';

interface BooksResponse {
  books: Book[];
  totalCount: number;
}

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Derive all page state from the URL so navigate(-1) restores exact position
  const currentPage = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '5');
  const sortOrder = searchParams.get('sort') ?? 'asc';
  const selectedCategories = searchParams.getAll('category');

  // Fetch distinct categories once on mount
  useEffect(() => {
    fetch('http://localhost:5106/Books/GetCategories')
      .then((r) => r.json())
      .then((data: string[]) => setAllCategories(data))
      .catch(console.error);
  }, []);

  // Fetch books whenever URL params change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('pageNum', searchParams.get('page') ?? '1');
    params.set('pageSize', searchParams.get('pageSize') ?? '5');
    params.set('sortOrder', searchParams.get('sort') ?? 'asc');
    searchParams
      .getAll('category')
      .forEach((c) => params.append('categories', encodeURIComponent(c)));

    fetch(`http://localhost:5106/Books/GetBooks?${params.toString()}`)
      .then((r) => r.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      })
      .catch(console.error);
  }, [searchParams]);

  const handleCategoryChange = (cats: string[]) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('category');
      cats.forEach((c) => next.append('category', c));
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  };

  const handlePageSizeChange = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('pageSize', String(size));
      next.set('page', '1');
      return next;
    });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sort', sort);
      next.set('page', '1');
      return next;
    });
  };

  return (
    <div className="container py-4">
      {/* Header row with title and cart summary */}
      <div className="row mb-3 align-items-center">
        <div className="col">
          <h1 className="display-5 fw-bold text-primary mb-0">Bookstore</h1>
        </div>
        <div className="col-auto">
          <CartSummary />
        </div>
      </div>

      {/* Main content: sidebar + book list */}
      <div className="row">
        <div className="col-md-3 mb-3">
          <CategoryFilter
            categories={allCategories}
            selectedCategories={selectedCategories}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="col-md-9">
          <BookList
            books={books}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            sortOrder={sortOrder}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
}
