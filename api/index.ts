import express, { Request, Response } from 'express'; 
import path from 'path';

const app = express();

// Middleware untuk mengakses semua file statis di dalam folder 'public'
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));  // Menjadikan folder public sebagai root file statis

// Endpoint utama untuk mengirim file index.html
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Menjalankan server di port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
