import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
const PORT = config.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("connected to the database successfully");

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
