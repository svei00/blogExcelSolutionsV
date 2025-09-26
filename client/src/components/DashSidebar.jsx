import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiMail,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useAuthFetch from "../hooks/useAuthFetch";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Unread badge - fetched here (not just inside DashMessages) so it's
  // visible in the nav even when a different tab is open, same reason
  // email clients show an unread count on the inbox link itself.
  // DashSidebar and DashMessages are SIBLINGS (both children of
  // Dashboard.jsx), not parent/child, so DashMessages can't just call a
  // prop function to refresh this - it dispatches a plain
  // "messages-updated" window event after marking read/deleting, and
  // this listens for it. Without this, the badge only updated on tab
  // navigation, so marking a message read while ALREADY on the Messages
  // tab left the sidebar count stale until you clicked away and back.
  useEffect(() => {
    if (!currentUser.isAdmin) return;
    const fetchUnreadCount = async () => {
      try {
        const res = await authFetch("/api/message/getmessages?limit=1");
        const data = await res.json();
        if (res.ok) setUnreadCount(data.totalUnread);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUnreadCount();
    window.addEventListener("messages-updated", fetchUnreadCount);
    return () => window.removeEventListener("messages-updated", fetchUnreadCount);
  }, [currentUser._id, tab]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                // label="Dashboard"
                // labelColor="dark"
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=messages">
                <Sidebar.Item
                  active={tab === "messages"}
                  icon={HiMail}
                  label={unreadCount > 0 ? String(unreadCount) : undefined}
                  labelColor="success"
                  as="div"
                >
                  Messages
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
