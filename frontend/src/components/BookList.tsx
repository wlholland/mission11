import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:5106/Books/AllBooks');
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const sorted = [...books].sort((a, b) =>
    sortAsc
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  const totalPages = Math.ceil(sorted.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBooks = sorted.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortAsc((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary">Bookstore</h1>
        <p className="text-muted">
          Showing {books.length === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + pageSize, sorted.length)} of {sorted.length}{' '}
          books
        </p>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>
                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  onClick={handleSortToggle}
                >
                  Title {sortAsc ? '▲' : '▼'}
                </button>
              </th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 mt-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
          <span className="text-muted px-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next &raquo;
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="form-label mb-0 text-muted">
            Results per page:
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default BookList;
