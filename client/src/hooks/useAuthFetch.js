import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

// Wraps fetch for endpoints that require a logged-in session (anything
// behind verifyToken.util.js on the API). The JWT cookie expires after
// 7 days, but Redux's currentUser is persisted in local storage and
// keeps saying "logged in" long after that, so every authenticated call
// was failing silently until the user noticed something was broken and
// force-signed-out/in by hand. This hook catches the 401 the API already
// sends back, clears the stale session, and bounces to sign-in so the
// expiry is visible instead of silent. Use plain fetch for public
// endpoints (getposts, getPostComments, etc.) — they never 401.
export default function useAuthFetch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(
    async (url, options) => {
      const res = await fetch(url, options);
      if (res.status === 401) {
        dispatch(signoutSuccess());
        navigate("/sign-in?expired=1");
      }
      return res;
    },
    [dispatch, navigate]
  );
}
