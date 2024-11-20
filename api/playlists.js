const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');  // Correct import of the auth middleware
const router = express.Router();

router.use(auth);  // Ensure the auth middleware is used correctly

router.get('/', async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({ where: { ownerId: req.user.id } });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  const { name, description, trackIds } = req.body;
  try {
    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        tracks: { connect: trackIds.map(id => ({ id })) },
      },
    });
    res.status(201).json(newPlaylist);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
      include: { tracks: true },
    });
    if (!playlist || playlist.ownerId !== req.user.id) {
      return res.status(403).send({ error: 'Access denied' });
    }
    res.json(playlist);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
