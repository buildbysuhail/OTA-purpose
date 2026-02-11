import { execSync } from "child_process";

export function getNextOtaNumber(prefix, version) {
  const tagBase = `${prefix}-${version}-ota.`;

  const tags = execSync("git tag")
    .toString()
    .split("\n")
    .filter(t => t.startsWith(tagBase));

  if (tags.length === 0) return 1;

  const numbers = tags.map(t => parseInt(t.split(".").pop()));
  return Math.max(...numbers) + 1;
}

export function safeCreateTag(tag) {
  try {
    execSync(`git tag ${tag}`);
    execSync(`git push origin ${tag}`);
    console.log(`✅ Tag pushed: ${tag}`);
  } catch {
    console.log(`⚠ Tag already exists: ${tag}`);
  }
}
