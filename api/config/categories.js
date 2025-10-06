// Deliberately duplicated from client/src/config/categories.js, not
// imported from it - same reasoning as api/config/site.js: api/ and
// client/ are independent deployable units. Keep both in sync by hand.
export const CATEGORIES = [
  { value: "formulas", label: "Formulas and Functions" },
  { value: "data-entry", label: "Data Entry" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "data-visualization", label: "Data Visualization" },
  { value: "collaboration", label: "Collaboration and Security" },
  { value: "contable", label: "Excel para Contadores" },
  { value: "automation", label: "Automation" },
  { value: "add-ins", label: "Add-in and Extensions" },
  { value: "printing", label: "Printing and Sharing" },
  { value: "accessibility", label: "Accessibility" },
  { value: "macros", label: "Macros" },
  { value: "python", label: "Python" },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value;
