// /api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL parameter");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const body = await response.text();

    // Strip out frame-blocking headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "text/html");
    
    // Inject a <base> tag so relative links (CSS/Images) load correctly
    const baseUrl = new URL(url).origin;
    const modifiedBody = body.replace(
      "<head>",
      `<head><base href="${baseUrl}/">`
    );

    return res.status(200).send(modifiedBody);
  } catch (error) {
    return res.status(500).send("Error fetching site: " + error.message);
  }
}
