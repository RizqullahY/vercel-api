import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HELPERS
========================= */
const generateCode = (length = 6) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

/* =========================
   ROUTES: STATIC
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API Docs JSON
app.get("/api/docs", (req, res) => {
  const filePath = path.resolve(__dirname, "data/documentation.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error reading documentation file" });

    res.json(JSON.parse(data));
  });
});

// API Docs Page (V2)
app.get("/api", (req, res) => {
  res.sendFile(path.join(__dirname, "public/api/index.html"));
});

// Shortener GUI Page
app.get("/api/shortener", (req, res) => {
  res.sendFile(path.join(__dirname, "public/api/shortener.html"));
});

/* =========================
   ROUTES: QUOTES
========================= */
app.get("/api/quote-of-the-day", (req, res) => {
  const filePath = path.join(__dirname, "data/data.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ status: "error", message: "Unable to read data.json" });

    const quotes = JSON.parse(data);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.json({
      status: "success",
      data: randomQuote,
    });
  });
});

app.get("/api/quotes", (req, res) => {
  const filePath = path.join(__dirname, "data/data.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ status: "error", message: "Unable to read data.json" });

    res.json({
      status: "success",
      data: JSON.parse(data),
    });
  });
});

/* =========================
   ROUTES: SHORT URL
========================= */
const shortFile = path.join(__dirname, "data/shortlinks.json");

// POST → create short URL
app.post("/api/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ status: "error", message: "URL is required" });
  }

  let links = [];
  if (fs.existsSync(shortFile)) {
    links = JSON.parse(fs.readFileSync(shortFile, "utf-8"));
  }

  const code = generateCode();
  const newLink = {
    code,
    originalUrl: url,
    createdAt: new Date().toISOString(),
    clicks: 0,
  };

  links.push(newLink);
  fs.writeFileSync(shortFile, JSON.stringify(links, null, 2));

  res.json({
    status: "success",
    data: {
      shortUrl: `${req.protocol}://${req.get("host")}/s/${code}`,
    },
  });
});

// GET → redirect short URL
app.get("/s/:code", (req, res) => {
  const { code } = req.params;

  if (!fs.existsSync(shortFile)) {
    return res.status(404).send("Short URL not found");
  }

  const links = JSON.parse(fs.readFileSync(shortFile, "utf-8"));
  const link = links.find((l) => l.code === code);

  if (!link) {
    return res.status(404).send("Short URL not found");
  }

  // increment click
  link.clicks += 1;
  fs.writeFileSync(shortFile, JSON.stringify(links, null, 2));

  res.redirect(link.originalUrl);
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
