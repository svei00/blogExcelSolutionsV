import { Dropdown } from "flowbite-react";
import PropTypes from "prop-types";
import { CATEGORIES, categoryLabel } from "../config/categories";

// Multi-select via Dropdown/Dropdown.Item (not a native <select multiple>,
// which is a whole separate class of unstylable-native-popup problems -
// see the Search toolbar's history in REBUILD_PLAN before this). value is
// always an array of category slugs; onChange receives the updated array.
// dismissOnClick={false} so picking several categories in a row doesn't
// close the menu after each click, the way an AutoFilter checkbox list
// behaves.
//
// The visible <input type="checkbox"> in each item is aria-hidden - it's
// a pure visual indicator, the real interactive element is Dropdown.Item
// itself (a real <button>, confirmed via its source). Without aria-pressed
// on that button (REBUILD_PLAN 7.4), a screen reader heard "Uncategorized,
// menu item" with zero indication of whether it was currently selected -
// the checked/unchecked state was entirely visual. aria-pressed is the
// correct pattern for a genuinely binary toggle button, not aria-checked/
// role=menuitemcheckbox - DropdownItem
// hardcodes role="menuitem" on its own <li> wrapper, not overridable via
// props, so a real menuitemcheckbox role isn't achievable here without
// forking the component.
const CategoriesSelect = ({ value, onChange }) => {
  const selected = value.length > 0 ? value : ["uncategorized"];

  const toggle = (slug) => {
    const isSelected = selected.includes(slug);
    let next;
    if (slug === "uncategorized") {
      // Picking "uncategorized" clears everything else - the two don't
      // make sense combined.
      next = isSelected ? [] : ["uncategorized"];
    } else {
      next = isSelected
        ? selected.filter((s) => s !== slug)
        : [...selected.filter((s) => s !== "uncategorized"), slug];
    }
    onChange(next.length > 0 ? next : ["uncategorized"]);
  };

  const summary =
    selected.length === 1 && selected[0] === "uncategorized"
      ? "Select categories"
      : selected.map((slug) => categoryLabel(slug)).join(", ");

  return (
    <Dropdown label={summary} color="gray" dismissOnClick={false}>
      <Dropdown.Item
        onClick={() => toggle("uncategorized")}
        aria-pressed={selected.includes("uncategorized")}
      >
        <input
          type="checkbox"
          readOnly
          checked={selected.includes("uncategorized")}
          aria-hidden="true"
          className="mr-2"
        />
        Uncategorized
      </Dropdown.Item>
      <Dropdown.Divider />
      {CATEGORIES.map((c) => (
        <Dropdown.Item
          key={c.value}
          onClick={() => toggle(c.value)}
          aria-pressed={selected.includes(c.value)}
        >
          <input
            type="checkbox"
            readOnly
            checked={selected.includes(c.value)}
            aria-hidden="true"
            className="mr-2"
          />
          {c.label}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

CategoriesSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CategoriesSelect;
