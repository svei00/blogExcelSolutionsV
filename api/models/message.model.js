import mongoose from "mongoose";

// Contact-form submissions (REBUILD_PLAN 6.3). The services CTA on
// PostPage/Home/Projects (CallToAction.jsx) points here instead of an
// external portfolio link. No email-sending is wired up - svei checks
// these in the dashboard, same as Users/Posts/Comments.
const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
