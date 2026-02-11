import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const version = pkg.version;
const prefix = `win-ota-${version}-ota.`;

// Get existing tags
let existingTags = execSync("git tag", { encoding: "utf-8" })
  .split("\n")
  .filter(t => t.startsWith(prefix));

let nextNumber = 1;

if (existingTags.length > 0) {
  const numbers = existingTags.map(t => parseInt(t.split(".").pop()));
  nextNumber = Math.max(...numbers) + 1;
}

const oldTag = existingTags.length > 0 ? existingTags.sort().pop() : "none";
const newTag = `${prefix}${nextNumber}`;

console.log("===================================");
console.log(" WINDOWS OTA RELEASE");
console.log("-----------------------------------");
console.log(` Base Version: ${version}`);
console.log(` Old Tag: ${oldTag}`);
console.log(` New Tag: ${newTag}`);
console.log("===================================");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Create and push tag '${newTag}'? (y/N): `, answer => {
  if (answer.toLowerCase() === "y") {
    execSync(`git tag ${newTag}`);
    execSync(`git push origin ${newTag}`);
    console.log("✅ Windows OTA tag pushed");
  } else {
    console.log("❌ Cancelled");
  }
  rl.close();
});
