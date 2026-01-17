import { Alert, Button, FileInput, Label, Select, TextInput, Textarea } from "flowbite-react";
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
    if (!formData.categories?.length) newErrors.category = "Category is required";
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
          aria-label="Title"
          required
          id="title"
          className="flex-1"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {errors.title && <span className="text-red-500">{errors.title}</span>}
        <CategoriesSelect
          value={formData.categories || []}
          onChange={(categories) => setFormData({ ...formData, categories })}
        />
        {errors.category && <span className="text-red-500">{errors.category}</span>}
      </div>

      <div>
        <Textarea
          placeholder="Meta description (optional - shown in search results and social shares. Falls back to the first 160 characters of the post if left blank.)"
          aria-label="Meta description"
          rows={2}
          maxLength={160}
          value={formData.metaDescription || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
        />
        <p className="text-gray-500 text-xs mt-1">
          {(formData.metaDescription || "").length}/160
        </p>
      </div>

      <div>
        <Label htmlFor="reviewedAt" value="Last reviewed (optional)" />
        <TextInput
          type="date"
          id="reviewedAt"
          // Cards never fall back to createdAt/updatedAt when this is
          // unset (REBUILD_PLAN 6b.2) - clearing this field is a real,
          // meaningful action (removes the "still works" stamp), not a
          // no-op, so leave it blank rather than defaulting to today.
          value={formData.reviewedAt ? formData.reviewedAt.slice(0, 10) : ""}
          onChange={(e) =>
            setFormData({ ...formData, reviewedAt: e.target.value || null })
          }
        />
        <p className="text-gray-500 text-xs mt-1">
          Stamp this when you've re-confirmed the content still works in
          current Excel. Leave blank for content that hasn't been
          re-verified.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div>
          <Label htmlFor="lang" value="Language" />
          <Select
            id="lang"
            value={formData.lang || "es"}
            onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
          >
            <option value="es">Spanish</option>
            <option value="en">English</option>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="translationSlug" value="Translation slug (optional)" />
          <TextInput
            id="translationSlug"
            placeholder="slug-of-the-translated-post"
            value={formData.translationSlug || ""}
            onChange={(e) =>
              setFormData({ ...formData, translationSlug: e.target.value })
            }
          />
          <p className="text-gray-500 text-xs mt-1">
            Only for posts that have a real translated counterpart - the
            exact slug of that other post. Leave blank otherwise; a wrong
            or stale slug here just means the hreflang tag silently
            doesn't appear, not a broken link.
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between border-2 border-primary p-3">
        <FileInput
          type="file"
          accept="image/*"
          aria-label="Cover image file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button
          type="button"
          className="bg-gradient-to-r from-secondary to-primary "
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
        <>
          <img src={formData.image} alt="Uploaded Image" className="w-full h-72 object-cover" />
          <TextInput
            type="text"
            placeholder="Cover image alt text (optional - falls back to the post title)"
            aria-label="Cover image alt text"
            value={formData.imageAlt || ""}
            onChange={(e) =>
              setFormData({ ...formData, imageAlt: e.target.value })
            }
          />
        </>
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
        className="bg-gradient-to-r from-secondaryText to-primaryText hover:from-primaryText hover:to-secondaryText"
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
