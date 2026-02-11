import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const version = pkg.version;

const tag = `win-ota-${version}`;

console.log("===================================");
console.log(" WINDOWS OTA RELEASE");
console.log("-----------------------------------");
console.log(" Version:", version);
console.log(" Tag:", tag);
console.log("===================================");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`Create and push tag '${tag}'? (y/N): `, (answer) => {
  if (answer.toLowerCase() !== "y") {
    console.log("❌ Aborted.");
    rl.close();
    process.exit(0);
  }

  try {
    execSync(`git tag ${tag}`, { stdio: "inherit" });
    execSync(`git push origin ${tag}`, { stdio: "inherit" });
    console.log("✅ Windows OTA tag pushed");
  } catch (err) {
    console.error("❌ Error creating tag:", err.message);
  }

  rl.close();
});
