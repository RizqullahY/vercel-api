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

// GET → redirect short URL
app.get("/s/:code", (req, res) => {
  const filePath = path.join(__dirname, "data/datalinks.json");

  fs.readFile(filePath, "utf-8", (err, raw) => {
    if (err) return res.status(500).send("Unable to read datalinks");

    let links;
    try {
      links = JSON.parse(raw);
    } catch {
      return res.status(500).send("Invalid datalinks.json format");
    }

    const found = links.find(l => l.code === req.params.code);
    if (!found) return res.status(404).send("Short link not found");

    res.redirect(found.url);
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
