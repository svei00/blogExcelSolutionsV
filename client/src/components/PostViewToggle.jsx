import PropTypes from "prop-types";
import { HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";

// Real <button> elements with aria-pressed/aria-label (REBUILD_PLAN
// 6b.4) - icon-only controls need both since there is no visible text
// for a screen reader to announce.
export default function PostViewToggle({ view, onChange }) {
  const options = [
    { value: "row", label: "Row view", Icon: HiOutlineViewList },
    { value: "grid", label: "Grid view", Icon: HiOutlineViewGrid },
  ];

  return (
    <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md p-0.5">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={`p-1.5 rounded transition-colors ${
            view === value
              ? "bg-gray-200 dark:bg-gray-700 text-primary"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}

PostViewToggle.propTypes = {
  view: PropTypes.oneOf(["row", "grid"]).isRequired,
  onChange: PropTypes.func.isRequired,
};
