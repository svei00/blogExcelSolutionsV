import { Select } from "flowbite-react";

const CategoriesSelect = ({ value, onChange }) => (
  <Select value={value} onChange={onChange}>
    <option value="uncategorized">Select a category</option>
    <option value="formulas">Formulas and Functions</option>
    <option value="data-entry">Data Entry</option>
    <option value="data-analysis">Data Analysis</option>
    <option value="data-visualization">Data Visualization</option>
    <option value="collaboration">Collaboration and Security</option>
    <option value="contable">Excel para Contadores</option>
    <option value="automation">Automation</option>
    <option value="add-ins">Add-in and Extensions</option>
    <option value="printing">Printing and Sharing</option>
    <option value="accessibility">Accessibility</option>
    <option value="macros">Macros</option>
    <option value="python">Python</option>
  </Select>
);

export default CategoriesSelect;
