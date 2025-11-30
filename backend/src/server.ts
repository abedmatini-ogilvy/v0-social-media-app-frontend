import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 CivicConnect API server running on port ${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/api/health`);
});
