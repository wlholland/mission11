using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private BookstoreDbContext _bookContext;

        public BooksController(BookstoreDbContext temp) => _bookContext = temp;

        // Original endpoint kept intact for Mission 11 compatibility
        [HttpGet("AllBooks")]
        public IEnumerable<Book> Get()
        {
            return _bookContext.Books.ToList();
        }

        [HttpGet("GetBooks")]
        public IActionResult GetBooks(
            int pageNum = 1,
            int pageSize = 5,
            string sortOrder = "asc",
            [FromQuery] List<string>? categories = null)
        {
            IQueryable<Book> query = _bookContext.Books;

            // Apply category filter BEFORE counting so pagination is accurate
            if (categories != null && categories.Count > 0)
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            int totalCount = query.Count();

            if (sortOrder == "desc")
                query = query.OrderByDescending(b => b.Title);
            else
                query = query.OrderBy(b => b.Title);

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { books, totalCount });
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        [HttpPost("addBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("updateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existing = _bookContext.Books.Find(bookId);
            if (existing == null) return NotFound();

            existing.Title = updatedBook.Title;
            existing.Author = updatedBook.Author;
            existing.Publisher = updatedBook.Publisher;
            existing.ISBN = updatedBook.ISBN;
            existing.Classification = updatedBook.Classification;
            existing.Category = updatedBook.Category;
            existing.PageCount = updatedBook.PageCount;
            existing.Price = updatedBook.Price;

            _bookContext.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("deleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);
            if (book == null) return NotFound();

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            return NoContent();
        }
    }
}
