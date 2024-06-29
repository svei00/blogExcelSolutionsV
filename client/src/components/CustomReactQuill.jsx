import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css"; // Include the Quill CSS
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Firebase Storage imports
import { app } from "../firebase"; // Firebase app instance import

// Image Handler
const handlerImage = () => {
  const input = document.createElement("input"); // Create an input element
  input.setAttribute("type", "file"); // Set input type to file
  input.setAttribute("accept", "image/*"); // Accept only image files
  input.click(); // Simulate a click event to open the file dialog

  // Handle the file selection
  input.onChange = async () => {
    const file = input.files[0]; // Get the selected file
    if (!file) {
      console.error("No file selected");
      return;
    }
    const storage = getStorage(app); // Get Firebase storage instance
    const fileName = new Date().getTime() + "-" + file.name; // Create a unique file name
    const storageRef = ref(storage, fileName); // Create a reference to the storage location
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the file upload

    // Monitor the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Can add a progress indicador. Let's think about it.
        // This callback is called with progress updates during the upload
      },
      (error) => {
        console.log("Image Upload Failed.", error); // Log any upload errors
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Get the download URL of the uploaded image
          console.log("Download URL:", downloadURL); // Log the download URL for verification
          const editor = window.quill.getEditor(); // Get the Quill editor instance
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", downloadURL);
        } catch (error) {
          console.error("Failed inserting image:", error);
        }
      }
    );
  };
};

// Toolbar configuration with alignment options
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }], // Header dropdown with levels 1 and 2
      ["bold", "italic", "underline", "strike"], // Text formatting options
      [{ list: "ordered" }, { list: "bullet" }], // List options
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ align: [] }], // Alignment options

      ["link", "image", "video"], // Links, images, and video embedding options
      ["clean"], // Remove formatting button
    ],

    handlers: {
      image: handlerImage, // Custom image handler function
    },
  },
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
