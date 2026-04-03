import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { deleteBook } from '../api/booksAPI';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const BASE_URL = 'http://localhost:5106/Books';
const DEFAULT_PAGE_SIZE = 10;

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  async function fetchBooks() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNum: String(currentPage),
        pageSize: String(pageSize),
        sortOrder: 'asc',
      });
      const res = await fetch(`${BASE_URL}/GetBooks?${params}`);
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setBooks(data.books);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError('Could not load books.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  async function handleDelete(bookId: number) {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    await deleteBook(bookId);
    setBooks((prev) => prev.filter((b) => b.bookID !== bookId));
    setTotalCount((prev) => prev - 1);
  }

  function handleSuccess() {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-5 fw-bold text-primary mb-0">Admin: Books</h1>
        <button
          className="btn btn-success"
          onClick={() => { setEditingBook(null); setShowForm(true); }}
        >
          + Add New Book
        </button>
      </div>

      {showForm && !editingBook && (
        <NewBookForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={handleSuccess}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {loading && <p className="text-muted">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Publisher</th>
                  <th>Pages</th>
                  <th>Price</th>
                  <th>Actions</th>
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
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => { setShowForm(false); setEditingBook(book); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(book.bookID)}
                        >
                          Delete
                        </button>
                      </div>
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

          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage <= 1}
            >
              &laquo; Previous
            </button>
            <span className="text-muted px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
