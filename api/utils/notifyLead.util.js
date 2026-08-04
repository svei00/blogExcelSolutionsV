// Pings a ntfy.sh topic when a contact-form lead comes in (REBUILD_PLAN
// 6.3 follow-up) - otherwise submissions sit silently in Mongo until
// someone happens to open the dashboard. ntfy needs no account/signup:
// pick any hard-to-guess topic name, subscribe to it in the ntfy app or
// at https://ntfy.sh/<topic>, and set NTFY_TOPIC_URL to that URL.
// Unset by default so this is a no-op until svei opts in.
export async function notifyNewLead({ name, email, message }) {
  const topicUrl = process.env.NTFY_TOPIC_URL;
  if (!topicUrl) return;

  try {
    await fetch(topicUrl, {
      method: "POST",
      headers: {
        Title: "New Excel SolutionsV lead",
        Tags: "envelope",
      },
      body: `${name} <${email}>\n\n${message.slice(0, 500)}`,
    });
  } catch (error) {
    // Never let a notification failure break the actual lead submission.
    console.error("Lead notification failed:", error.message);
  }
}
