import { execSync } from "child_process";
import fs from "fs";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function getOutput(cmd) {
  return execSync(cmd).toString().trim();
}

console.log("🚀 FULL RELEASE STARTING...");

// 1️⃣ Check uncommitted changes
const status = getOutput("git status --porcelain");
if (status) {
  console.log("❌ You have uncommitted changes.");
  process.exit(1);
}

// 2️⃣ Sync with remote safely
console.log("🔄 Syncing with remote...");
run("git pull origin main --rebase");

// 3️⃣ Auto bump PATCH version
const pkg = JSON.parse(fs.readFileSync("package.json"));
const parts = pkg.version.split(".");
parts[2] = parseInt(parts[2]) + 1;
pkg.version = parts.join(".");
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

console.log(`⬆ Version bumped: ${pkg.version}`);

// 4️⃣ Commit + push
run("git add package.json");
run(`git commit -m "chore: bump version to ${pkg.version}"`);
run("git push");

// 5️⃣ Create OTA tags automatically
const platforms = ["android", "ios", "win", "mac"];

platforms.forEach(platform => {
  const tag = `${platform}-ota-${pkg.version}-ota.1`;

  try {
    execSync(`git rev-parse ${tag}`);
    console.log(`⚠ Tag already exists: ${tag}`);
  } catch {
    run(`git tag ${tag}`);
    run(`git push origin ${tag}`);
    console.log(`✅ Tag created: ${tag}`);
  }
});

console.log("🎉 FULL RELEASE COMPLETE!");
