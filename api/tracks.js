const express = require("express");
const prisma = require("../prisma");
const router = express.Router();

router.use(express.json());


router.get("/", async (req,res,next) => {
  try{
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch(e) {
    next(e);
  }
});

router.get("/:id", async (req,res,next) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.findUnique({where: { id: parseInt(id)} });
    if(!track) {
      return res.status(404).send({ error: "Track not found."});
    }
    let response = {track};
    if(req.user) {
      const playlists = await prisma.playlist.findMany({
        where: {
          ownerId: req.user.id,
          tracks: {some: { id: track.id} },
        },
      });
      response.playlists = playlists;
    }
    res.json(response);
  } catch(e) {
    next(e);
  }
});

module.exports = router;