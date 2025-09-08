import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import CategoriesSelect from "./CategoriesSelect";
import PostEditor from "./PostEditor";
import useImageUpload from "../hooks/useImageUpload";

// Shared by CreatePost and UpdatePost: fields, validation, cover-image
// upload, and the editor all live here once (REBUILD_PLAN 2.5). The pages
// themselves only fetch/submit and pass initialData + onSubmit down.
export default function PostForm({ initialData, onSubmit, submitLabel, publishError }) {
  const [formData, setFormData] = useState(initialData);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { uploadImage, progress, uploading, error: imageUploadError } = useImageUpload();

  // UpdatePost fetches its post asynchronously, so initialData arrives
  // after this component has already mounted with empty defaults.
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.content) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadImage = async () => {
    if (!file) return;
    try {
      const downloadURL = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: downloadURL }));
    } catch {
      // imageUploadError from the hook already reflects the failure.
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 sm:flex-row justify-between">
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          className="flex-1"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <span className="text-red-500">{errors.title}</span>}
        <CategoriesSelect
          value={formData.category || ""}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        {errors.category && <span className="text-red-500">{errors.category}</span>}
      </div>

      <div className="flex gap-4 items-center justify-between border-2 border-blueEx p-3">
        <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <Button
          type="button"
          className="bg-gradient-to-r from-greenEx to-blueEx "
          outline
          size="sm"
          onClick={handleUploadImage}
          disabled={uploading}
        >
          {uploading ? (
            <div className="w-16 h-16">
              <CircularProgressbar value={progress} text={`${progress.toFixed(0)} %`} />
            </div>
          ) : (
            "Upload Image"
          )}
        </Button>
      </div>
      {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
      {formData.image && (
        <img src={formData.image} alt="Uploaded Image" className="w-full h-72 object-cover" />
      )}

      <PostEditor
        value={formData.content || ""}
        placeholder="Create a Story..."
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, content: value, contentFormat: "md" }))
        }
      />
      {errors.content && <span className="text-red-500">{errors.content}</span>}

      <Button
        type="submit"
        className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
      >
        {submitLabel}
      </Button>
      {publishError && (
        <Alert className="mt-5" color="failure">
          {publishError}
        </Alert>
      )}
    </form>
  );
}
