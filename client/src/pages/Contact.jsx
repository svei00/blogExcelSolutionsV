import { Alert, Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../config/site";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // "website" is the honeypot - a field no real visitor sees or fills,
  // that bots filling every input they find happily populate. Kept as
  // its own ref rather than in formData so a re-render can never touch
  // it (autofill/extensions sometimes rewrite state-driven fields).
  const honeypotRef = useRef(null);
  // Signed submit-timing token (2026-08-30 anti-spam hardening, see
  // spamDetection.util.js) - fetched once on mount, proves server-side
  // that at least MIN_SUBMIT_MS passed between page load and submit,
  // something a script POSTing directly can't fake since it never asked
  // us for a token in the first place.
  const [formToken, setFormToken] = useState("");

  useEffect(() => {
    fetch("/api/message/form-token")
      .then((res) => res.json())
      .then((data) => setFormToken(data.token))
      .catch(() => {}); // a failed fetch just leaves formToken empty - createMessage treats that as a bot signal, not a crash
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website: honeypotRef.current?.value || "",
          formToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-3">
      <Helmet>
        <title>Contact | Excel SolutionsV Blog</title>
        <meta
          name="description"
          content="Get in touch about Excel automation, formula/dashboard building, and consulting."
        />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
      </Helmet>
      <h1 className="text-3xl mt-10 mb-3 text-center font-serif">
        Let's talk about your Excel workflow
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Formula troubleshooting, automation, custom dashboards, or general
        consulting - send a message and I'll get back to you.
      </p>

      {success ? (
        <Alert color="success">
          Thanks - your message has been sent. I'll get back to you soon.
        </Alert>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Honeypot - invisible to a real visitor, irresistible to a bot
              that fills every field it finds in the DOM. Off-screen via
              absolute positioning rather than display:none/hidden, which
              some bots are specifically coded to skip. tabIndex/aria-hidden
              keep it out of the way for keyboard and screen-reader users. */}
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
          />
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="message" value="Message" />
            <Textarea
              id="message"
              rows={6}
              required
              maxLength={3000}
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-secondaryText to-primaryText hover:from-primaryText hover:to-secondaryText"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </Button>
          {error && <Alert color="failure">{error}</Alert>}
        </form>
      )}
    </div>
  );
}
