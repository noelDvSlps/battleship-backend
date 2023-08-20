import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.score.deleteMany();
  await prisma.difficulty.deleteMany();
  await prisma.user.deleteMany();

  const devslopes = await prisma.user.create({
    data: {
      id: 1,
      username: "devslopes",
      password: "$2b$11$nSpMFrUQEuDXF4NIc/NAC.nk4RGgjiPU95l9jZSGG/eIt1Dm37/6O",
    },
  });
  const battleship = await prisma.user.create({
    data: {
      id: 2,
      username: "battleship",
      password: "$2b$11$nvpQyXVzOzi43nTQ5cUXVOTmeY7XDYl/HDJHy3h1kAcqb7ASfjV6u",
    },
  });
  const developer = await prisma.user.create({
    data: {
      id: 3,
      username: "developer",
      password: "$2b$11$SXijzIZX0gVIrhrzIxwEKeLK.SIkCS.beh4TFnqk.IudSzO/6gp0C",
    },
  });

  const easy = await prisma.difficulty.create({
    data: {
      id: 1,
      difficulty: "Easy",
      gridsize: 6,
    },
  });
  const medium = await prisma.difficulty.create({
    data: {
      id: 2,
      difficulty: "Medium",
      gridsize: 9,
    },
  });
  const hard = await prisma.difficulty.create({
    data: {
      id: 3,
      difficulty: "Hard",
      gridsize: 12,
    },
  });

  for (let i = 1; i < 50; i++) {
    await prisma.score.create({
      data: {
        id: i,
        value: 1000 + Math.floor(Math.random() * 1000),
        userId: Math.floor(Math.random() * 3) + 1,
        difficultyId: Math.floor(Math.random() * 3) + 1,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeded");
  })
  .catch((e) => {
    console.error(e);
  });
