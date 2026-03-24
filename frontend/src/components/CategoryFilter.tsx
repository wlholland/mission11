interface Props {
  categories: string[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
}: Props) {
  const toggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    /*
     * BOOTSTRAP FEATURE #1: Accordion
     * Uses Bootstrap's Accordion component (accordion, accordion-item,
     * accordion-header, accordion-button, data-bs-toggle="collapse") to
     * create a collapsible category filter panel. Requires Bootstrap JS bundle.
     * Location: src/components/CategoryFilter.tsx
     */
    <div className="accordion" id="categoryAccordion">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button fw-semibold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#categoryCollapse"
            aria-expanded="true"
            aria-controls="categoryCollapse"
          >
            Filter by Category
            {selectedCategories.length > 0 && (
              <span className="ms-2 badge bg-primary rounded-pill">
                {selectedCategories.length}
              </span>
            )}
          </button>
        </h2>
        <div
          id="categoryCollapse"
          className="accordion-collapse collapse show"
          data-bs-parent="#categoryAccordion"
        >
          <div className="accordion-body">
            {selectedCategories.length > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary mb-3 w-100"
                onClick={() => onChange([])}
              >
                Clear Filter
              </button>
            )}
            {categories.map((cat) => (
              <div key={cat} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cat-${cat}`}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggle(cat)}
                />
                <label className="form-check-label" htmlFor={`cat-${cat}`}>
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
