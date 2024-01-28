

namespace iot_backend.Dto
{
    public class PaginationOutput<T>
    {
        public int totalPages { get; set; }
        public int currentPage { get; set; }
        public int totalItems { get; set; }
        public int itemsPerPage { get; set; } = 10;
        public List<T> items { get; set; }
    }
}
