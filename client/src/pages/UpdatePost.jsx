import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Spinner,
} from "flowbite-react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomReactQuill from "../components/CustomReactQuill";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CategoriesSelect from "../components/CategoriesSelect";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  // console.log(formData); Testing purposes.
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPublishError(null);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }

        // Update state in separate microtasks to avoid potential blocking
        setTimeout(
          () =>
            setFormData((prevState) => ({
              ...prevState,
              title: data.posts[0].title,
            })),
          0
        );
        setTimeout(
          () =>
            setFormData((prevState) => ({
              ...prevState,
              category: data.posts[0].category,
            })),
          0
        );
        setTimeout(
          () =>
            setFormData((prevState) => ({
              ...prevState,
              image: data.posts[0].image,
            })),
          0
        );

        // Debounce content update for large texts
        const debounceContent = setTimeout(() => {
          setFormData((prevState) => ({
            ...prevState,
            content: data.posts[0].content,
          }));
          setIsLoading(false); // Set loading to false after all data is set
        }, 100); // Adjust timeout as needed

        return () => clearTimeout(debounceContent);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPublishError(error.message);
        setIsLoading(false); // Make sure to set loading to false even if there's an error
      }
    };

    fetchPost();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please Select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload Failed");
      setImageUploadProgress(null);
      console.log(error); // Provisional code
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // To prevent reflesing the page
    if (!validate()) return;

    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!!");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is Required";
    if (!formData.category) newErrors.category = "Category is Required";
    if (!formData.content) newErrors.content = "Content is Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl" />
          <p>Loading post data... Please wait.</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title}</span>
            )}
            {/* <TextInput type="text" placeholder="Author" required /> */}
            <CategoriesSelect
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            {errors.category && (
              <span className="text-red-500">{errors.category}</span>
            )}
          </div>
          <div className="flex gap-4 items-center justify-between border-2 border-blueEx p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              className="bg-gradient-to-r from-greenEx to-blueEx "
              outline
              size="sm"
              onClick={handleUploadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0} %`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded Image"
              className="w-full h-72 object-cover"
            />
          )}

          {/* 
        // Just React Quill
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Create a story..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        /> */}
          <CustomReactQuill
            value={formData.content || ""}
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content}</span>
          )}

          <Button
            type="submit"
            className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
            required
          >
            Update!!
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
