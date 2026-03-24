import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

interface Props {
  books: Book[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortOrder: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sort: string) => void;
}

export default function BookList({
  books,
  totalCount,
  currentPage,
  pageSize,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: Props) {
  const { addToCart } = useCart();

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <span className="text-muted">
          Showing {start}–{end} of {totalCount} books
        </span>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="form-label mb-0 text-muted">
            Per page:
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>
                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  onClick={() =>
                    onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                >
                  Title {sortOrder === 'asc' ? '▲' : '▼'}
                </button>
              </th>
              <th>Author</th>
              <th>Category</th>
              <th>Publisher</th>
              <th>Pages</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publisher}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      addToCart({
                        bookId: book.bookID,
                        title: book.title,
                        price: book.price,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 mt-3">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            &laquo; Previous
          </button>
          <span className="text-muted px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
