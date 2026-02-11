import { getVersion } from "./utils/version.js";
import { getNextOtaNumber, safeCreateTag } from "./utils/tag-helper.js";
import readline from "readline";

const version = getVersion();
const nextOta = getNextOtaNumber("win-ota", version);
const tag = `win-ota-${version}-ota.${nextOta}`;

console.log(`
===================================
 WINDOWS OTA RELEASE
-----------------------------------
 Base Version: ${version}
 New Tag: ${tag}
===================================
`);

ask(tag);

function ask(tag) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`Create and push tag '${tag}'? (y/N): `, answer => {
    if (answer.toLowerCase() === "y") {
      safeCreateTag(tag);
    } else {
      console.log("❌ Cancelled");
    }
    rl.close();
  });
}
