import { Select } from "flowbite-react";
import { CATEGORIES } from "../config/categories";

const CategoriesSelect = ({ value, onChange }) => (
  <Select value={value} onChange={onChange} aria-label="Category">
    <option value="uncategorized">Select a category</option>
    {CATEGORIES.map((c) => (
      <option key={c.value} value={c.value}>
        {c.label}
      </option>
    ))}
  </Select>
);

export default CategoriesSelect;
