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
    }
}
