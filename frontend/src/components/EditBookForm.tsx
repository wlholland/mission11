import { useState } from 'react';
import type { Book } from '../types/Book';
import { updateBook } from '../api/booksAPI';

interface Props {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditBookForm({ book, onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState<Book>(book);

  // Dynamically updating form state based on the input name so we don't have to write this 20 times.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateBook(book.bookID, formData);
    onSuccess();
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Edit Book</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Author</label>
              <input className="form-control" name="author" value={formData.author} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Publisher</label>
              <input className="form-control" name="publisher" value={formData.publisher} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">ISBN</label>
              <input className="form-control" name="isbn" value={formData.isbn} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Classification</label>
              <input className="form-control" name="classification" value={formData.classification} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Page Count</label>
              <input className="form-control" type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input className="form-control" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
