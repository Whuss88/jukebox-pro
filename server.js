require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { router: authRoutes, authenticate } = require('./api/auth');
const playlistRoutes = require('./api/playlists');
const trackRoutes = require('./api/tracks');
const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/playlists', authenticate, playlistRoutes);
app.use('/tracks', trackRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('An error occurred');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
