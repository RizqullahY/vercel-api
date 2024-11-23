import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/api/", (req: Request, res: Response) => {
  res.redirect("/api/docs");
});
app.get("/api/docs", (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, "../data/documentation.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ message: "Error reading documentation file" });
    } else res.json(JSON.parse(data));
  });
});

app.get("/api/quote-on-the-day", (req: Request, res: Response) => {
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

export default app;
