import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "./public"))); 

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html")); 
});

app.get("/api/docs", (req, res) => {
  const filePath = path.resolve(__dirname, "./data/documentation.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error reading documentation file" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// V2 
app.get("/api/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/api/index.html"));
});

app.get("/api/quote-of-the-day", (req, res) => {
  const filePath = path.join(process.cwd(), "data", "data.json");
  console.log("File path for quote-on-the-day:", filePath);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Unable to read data.json" });
    }
    const quotes = JSON.parse(data);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({
      status: "success",
      data: randomQuote,
    });
  });
});

app.get("/api/quotes", (req, res) => {
  const filePath = path.resolve(__dirname, "./data/data.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Unable to read data.json" });
    }
    const quotes = JSON.parse(data);
    res.json({
      status: "success",
      data: quotes,
    });
  });
});

// FOR PROD
// export default app;

// FOR DEV
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
