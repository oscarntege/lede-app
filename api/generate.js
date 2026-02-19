export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
```

Scroll down. Click **Commit changes.** Click the green **Commit changes** button.

Then go to App.jsx and change this line.

Find this in the code.
```
const res = await fetch("https://api.anthropic.com/v1/messages", {
```

Replace it with this.
```
const res = await fetch("/api/generate", {
```

And remove the headers block completely so it looks like this.
```
const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
