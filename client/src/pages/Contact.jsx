import { Alert, Button, Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../config/site";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
        body: JSON.stringify(formData),
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
