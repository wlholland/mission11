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

        [HttpGet("AllBooks")]
        public IEnumerable<Book> Get()
        {
            return _bookContext.Books.ToList();
        }
    }
}
