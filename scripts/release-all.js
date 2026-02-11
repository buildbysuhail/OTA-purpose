import { execSync } from "child_process";
import fs from "fs";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function ensureClean() {
  const status = execSync("git status --porcelain").toString().trim();
  if (status) {
    console.log("❌ You have uncommitted changes.");
    console.log("Please commit or stash them before releasing.");
    process.exit(1);
  }
}

function bumpVersion() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  const parts = pkg.version.split(".");
  parts[2] = parseInt(parts[2]) + 1;
  const newVersion = parts.join(".");
  pkg.version = newVersion;
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  return newVersion;
}

console.log("🚀 FULL RELEASE STARTING...");

// 1️⃣ Ensure clean repo
ensureClean();

// 2️⃣ Sync remote safely
console.log("🔄 Syncing with remote...");
run("git pull origin main --rebase");

// 3️⃣ Bump version
const newVersion = bumpVersion();
console.log("⬆ Version bumped:", newVersion);

// 4️⃣ Commit version
run("git add package.json");
run(`git commit -m "chore: bump version to ${newVersion}"`);
run("git push origin main");

// 5️⃣ Create platform tags
const tags = [
  `android-ota-${newVersion}-ota.1`,
  `ios-ota-${newVersion}-ota.1`,
  `win-ota-${newVersion}-ota.1`,
  `mac-ota-${newVersion}-ota.1`
];

tags.forEach(tag => {
  try {
    run(`git tag ${tag}`);
    run(`git push origin ${tag}`);
    console.log("✅ Tag created:", tag);
  } catch {
    console.log("⚠️ Tag already exists:", tag);
  }
});

console.log("🎉 FULL RELEASE COMPLETE!");
