import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomReactQuill from "../components/CustomReactQuill";

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="formulas">Formulas and Functions</option>
            <option value="data-entry">Data Entry</option>
            <option value="data-analysis">Data Analysis</option>
            <option value="data-visualization">Data Visualization</option>
            <option value="collaboration">Collaboration and Security</option>
            <option value="automation">Automation</option>
            <option value="add-ins">Add-in and Extensions</option>
            <option value="printing">Printing and Sharing</option>
            <option value="accessibility">Accessibility</option>
            <option value="macros">Macros</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-blueEx p-3">
          <FileInput type="file" accept="image/*" />
          <Button
            type="button"
            className="bg-gradient-to-r from-greenEx to-blueEx "
            outline
            size="sm"
          >
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Create a story..."
          className="h-72 mb-12"
        />
        <Button
          className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
          required
        >
          Publish!!
        </Button>
        <CustomReactQuill />
      </form>
    </div>
  );
}
