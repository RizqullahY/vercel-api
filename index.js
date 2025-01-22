import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

// Menggunakan fileURLToPath untuk mendapatkan __dirname pada ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
// Menggunakan __dirname dengan path.join
app.use(express.static(path.join(__dirname, "./public"))); // Memperbaiki penggunaan path

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html")); // Memperbaiki penggunaan path
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
app.get("/api/v2/docs", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/api/index.html"));
});

app.get("/api/quote-of-the-day", (req, res) => {
  const filePath = path.resolve(__dirname, "./data/data.json");
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

// Endpoint GET /api/animated-control
app.get("/api/animated-control", (req, res) => {
  const filePath = path.resolve(__dirname, "./data/animated-status.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Unable to read animated-status.json",
      });
    }

    const status = JSON.parse(data);
    res.json({
      status: "success",
      data: status,
    });
  });
});

app.post("/api/animated-control", (req, res) => {
  const filePath = path.resolve(__dirname, "./data/animated-status.json");

  console.log('Reading from:', filePath);  

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error('Error reading file:', err);  
      return res.status(500).json({
        status: "error",
        message: "Unable to read animated-status.json",
      });
    }

    try {
      let status = JSON.parse(data);  
      status.animated = !status.animated;

      fs.writeFile(filePath, JSON.stringify(status, null, 2), "utf-8", (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);  
          return res.status(500).json({
            status: "error",
            message: "Unable to write to animated-status.json",
          });
        }

        res.json({
          status: "success",
          message: "Status updated successfully",
          data: status,
        });
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);  
      return res.status(500).json({
        status: "error",
        message: "Invalid JSON format in animated-status.json",
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
