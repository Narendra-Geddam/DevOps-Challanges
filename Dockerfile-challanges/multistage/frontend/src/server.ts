import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || '3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

app.get('/', (_req: Request, res: Response) => {
  res.send(`<html>
<body>
  <h1>Welcome to iximiuz Labs!</h1>
  <p>A TypeScript frontend application.</p>
</body>
</html>
`);
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/greeting', async (_req: Request, res: Response) => {
  try {
    const resp = await fetch(`${BACKEND_URL}/api/message`);
    const data = await resp.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Backend unavailable' });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Frontend listening on http://0.0.0.0:${PORT}`);
});
