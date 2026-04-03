import type { Book } from '../types/Book';

const BASE_URL = 'https://bookstore-api-willholland.azurewebsites.net/Books';

export async function addBook(book: Book): Promise<Book> {
  try {
    const response = await fetch(`${BASE_URL}/addBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to add book');
    return response.json();
  } catch (err) {
    // Catching errors here so the app doesn't just crash out on us.
    console.error(err);
    throw err;
  }
}

export async function updateBook(bookId: number, book: Book): Promise<Book> {
  try {
    const response = await fetch(`${BASE_URL}/updateBook/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return response.json();
  } catch (err) {
    // Catching errors here so the app doesn't just crash out on us.
    console.error(err);
    throw err;
  }
}

export async function deleteBook(bookId: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/deleteBook/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
  } catch (err) {
    // Catching errors here so the app doesn't just crash out on us.
    console.error(err);
    throw err;
  }
}
