import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css"; // Include the Quill CSS

// Toolbar configuration with alignment options
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ align: [] }], // Alignment options

    ["link", "image", "video"], // links and media
    ["clean"], // remove formatting button
  ],
};

const CustomReactQuill = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      placeholder="Create a story..."
      className="h-72 mb-12"
      required
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

// Prop types validation
CustomReactQuill.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomReactQuill;
