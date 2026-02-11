import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const baseVersion = packageJson.version;

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("===================================");
  console.log(" IOS OTA RELEASE");
  console.log("-----------------------------------");
  console.log(" Base Version:", baseVersion);

  // Get latest ios-ota tag
  let oldTag = "none";
  let otaNumber = 1;

  try {
    const tags = run("git tag")
      .split("\n")
      .filter(t => t.startsWith(`ios-ota-${baseVersion}-ota.`));

    if (tags.length > 0) {
      const lastTag = tags.sort().pop();
      oldTag = lastTag;

      const lastNumber = parseInt(lastTag.split("ota.")[1]);
      otaNumber = lastNumber + 1;
    }
  } catch (e) {}

  const newTag = `ios-ota-${baseVersion}-ota.${otaNumber}`;

  console.log(" Old Tag:", oldTag);
  console.log(" New Tag:", newTag);
  console.log("===================================");

  const answer = await ask(`Create and push tag '${newTag}'? (y/N): `);

  if (answer.toLowerCase() !== "y") {
    console.log("❌ Cancelled");
    process.exit(0);
  }

  try {
    run(`git tag ${newTag}`);
    run(`git push origin ${newTag}`);
    console.log("✅ iOS OTA tag pushed");
  } catch (error) {
    console.error("❌ Error creating tag:", error.message);
    process.exit(1);
  }
}

main();
