import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  conent: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: []
  },
  numberOfLikes: {
      type:Number,
      dafault:0
  },
  {timestamps: true}
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;