import fs from "fs";

export function bumpVersion() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const [major, minor, patch] = pkg.version.split(".").map(Number);

  const newVersion = `${major}.${minor}.${patch + 1}`;
  pkg.version = newVersion;

  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  console.log(`⬆ Version bumped: ${newVersion}`);

  return newVersion;
}

export function getVersion() {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  return pkg.version;
}
