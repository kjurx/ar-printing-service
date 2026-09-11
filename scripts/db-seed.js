const fs = require("fs");
const path = require("path");

const seed = path.join(process.cwd(), "src", "data", "seed.json");
const target = path.join(process.cwd(), "data");

fs.mkdirSync(target, { recursive: true });
fs.copyFileSync(seed, path.join(target, "db.json"));
console.log("Seeded data/db.json from src/data/seed.json");