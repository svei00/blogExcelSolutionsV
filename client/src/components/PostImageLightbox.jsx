import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const MIN_GALLERY_WIDTH = 100;

// Same 100px threshold renderPostContent.js's lazy-load hook uses for
// "this is a badge/icon, not content" - keeps the two decisions
// consistent instead of picking a second arbitrary number. Images
// without a declared width that haven't loaded yet default to
// included: a rare small icon slipping into the gallery costs less
// than a real content screenshot silently missing from it.
function isLikelyContentImage(img) {
  const declaredWidth = parseInt(img.getAttribute("width"), 10);
  if (!Number.isNaN(declaredWidth)) return declaredWidth >= MIN_GALLERY_WIDTH;
  if (img.complete && img.naturalWidth > 0) {
    return img.naturalWidth >= MIN_GALLERY_WIDTH;
  }
  return true;
}

// Render-time only (REBUILD_PLAN 6.10): operates on the sanitized HTML
// renderPostContent.js (2.3) already produced, via containerRef - so it
// works identically for legacy "html" posts and new "md" posts, and the
// editor/Markdown round-trip never knows this exists.
export default function PostImageLightbox({ containerRef, slug }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll("img")).filter(
      isLikelyContentImage
    );
    setSlides(images.map((img) => ({ src: img.src, alt: img.alt })));

    const cleanups = images.map((img, i) => {
      // Wrap in a span so the corner expand-icon can be positioned
      // without touching the sanitized <img> itself - the 6.11
      // elevation styling targets `.post-content img` directly, this
      // wrapper is purely a click/hover affordance. block + w-fit +
      // mx-auto reproduces the centering `.post-content`'s own
      // `[&>img]:mx-auto [&>img]:block` rule gave the image when it
      // was still a direct child (now one level deeper, inside this
      // wrapper).
      const wrapper = document.createElement("span");
      wrapper.className = "relative block w-fit mx-auto cursor-zoom-in";
      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabIndex", "0");
      wrapper.setAttribute(
        "aria-label",
        `Expand image${img.alt ? `: ${img.alt}` : ""}`
      );
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      const icon = document.createElement("span");
      icon.textContent = "⤢";
      icon.setAttribute("aria-hidden", "true");
      icon.className =
        "absolute bottom-2 right-2 px-1.5 py-1 rounded-md bg-black/55 text-white text-xs leading-none pointer-events-none";
      wrapper.appendChild(icon);

      const open = () => setIndex(i);
      const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      };
      wrapper.addEventListener("click", open);
      wrapper.addEventListener("keydown", handleKeyDown);

      return () => {
        wrapper.removeEventListener("click", open);
        wrapper.removeEventListener("keydown", handleKeyDown);
        if (wrapper.parentNode) {
          wrapper.parentNode.insertBefore(img, wrapper);
          wrapper.remove();
        }
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [containerRef, slug]);

  return (
    <Lightbox
      open={index >= 0}
      close={() => setIndex(-1)}
      index={index}
      slides={slides}
      plugins={[Zoom]}
    />
  );
}
