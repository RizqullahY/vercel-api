import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/api/docs", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/documentation.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error reading documentation file" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// V2 
app.get("/api/v2/docs", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../public/api/index.html"));
});

app.get("/api/quote-of-the-day", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/data.json");
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

app.get("/api/quotes", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/data.json");
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
app.get("/api/animated-control", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/animated-status.json");

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

// Endpoint POST /api/animated-control
app.post("/api/animated-control", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/animated-status.json");

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Unable to read animated-status.json",
      });
    }

    let status = JSON.parse(data);

    // Toggle the value of the "isEnabled" field
    status.isEnabled = !status.isEnabled;

    fs.writeFile(filePath, JSON.stringify(status, null, 2), "utf-8", (writeErr) => {
      if (writeErr) {
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
  });
});

export default app;
