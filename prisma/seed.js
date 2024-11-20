const prisma = require("./index");

const seed = async () => {
  const tracks = [];
  const numTracks = 20;
   for ( let i = 0; i < numTracks; i++) {
    const track = await prisma.track.create({
      data: { title: `Track ${i + 1}` },
    });
    tracks.push(track);
   }
   console.log("Database seeded successfully.");
};

seed()
  .then(async() => {
    await prisma.$disconnect();
  })
  .catch(async(e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1)
  })