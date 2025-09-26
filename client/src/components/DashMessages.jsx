import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Button, Table, Modal } from "flowbite-react";
import { CiCircleRemove } from "react-icons/ci";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useAuthFetch from "../hooks/useAuthFetch";

export default function DashMessages() {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState("");
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await authFetch(`/api/message/getmessages`);
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
          if (data.messages.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchMessages();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = messages.length;
    try {
      const res = await authFetch(
        `/api/message/getmessages?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, ...data.messages]);
        if (data.messages.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkRead = async (messageId) => {
    try {
      const res = await authFetch(`/api/message/markread/${messageId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m))
        );
        // DashSidebar's unread badge listens for this - it's a sibling,
        // not a parent/child, so a plain window event is the simplest
        // way to tell it to refresh without prop-drilling through
        // Dashboard.jsx.
        window.dispatchEvent(new Event("messages-updated"));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteMessage = async () => {
    setShowModal(false);
    try {
      const res = await authFetch(
        `/api/message/deletemessage/${messageIdToDelete}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMessages((prev) =>
          prev.filter((m) => m._id !== messageIdToDelete)
        );
        window.dispatchEvent(new Event("messages-updated"));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && messages.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Message</Table.HeadCell>
              <Table.HeadCell>Mark Read</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {messages.map((message) => (
              <Table.Body className="divide-y" key={message._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {message.isRead ? (
                      <Badge color="gray">Read</Badge>
                    ) : (
                      <Badge color="success">New</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{message.name}</Table.Cell>
                  <Table.Cell>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary hover:underline"
                    >
                      {message.email}
                    </a>
                  </Table.Cell>
                  <Table.Cell className="max-w-xs">
                    <p className="line-clamp-2">{message.message}</p>
                  </Table.Cell>
                  <Table.Cell>
                    {!message.isRead && (
                      <Button
                        size="xs"
                        onClick={() => handleMarkRead(message._id)}
                      >
                        Mark Read
                      </Button>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setMessageIdToDelete(message._id);
                      }}
                      className="text-red-700 text-2xl hover:text-3xl cursor-pointer"
                    >
                      <CiCircleRemove />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-primary font-semibold self-center text-sm py-7 hover:text-secondary"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p> You have no messages yet!!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this message?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteMessage}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
