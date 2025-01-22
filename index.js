import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_KEY = process.env.SUPABASE_KEY; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
app.get('/api/animated-control', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('animated_status')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.error('Error fetching animated status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Unable to fetch animated status.',
    });
  }
});

// Endpoint POST /api/animated-control
app.post('/api/animated-control', async (req, res) => {
  try {
    const { data: currentStatus, error: fetchError } = await supabase
      .from('animated_status')
      .select('*')
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const newStatus = !currentStatus.animated;

    const { data, error: updateError } = await supabase
      .from('animated_status')
      .update({ animated: newStatus })
      .eq('id', currentStatus.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      status: 'success',
      message: 'Status updated successfully.',
      data,
    });
  } catch (error) {
    console.error('Error updating animated status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Unable to update animated status.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
