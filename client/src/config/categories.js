// Single source of truth for category slug -> human-readable label.
// Used by the post editor's category select and the header's Categories nav dropdown.
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
