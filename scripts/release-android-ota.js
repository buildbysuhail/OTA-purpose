import { getVersion } from "./utils/version.js";
import { getNextOtaNumber, safeCreateTag } from "./utils/tag-helper.js";
import readline from "readline";

const version = getVersion();
const nextOta = getNextOtaNumber("android-ota", version);
const tag = `android-ota-${version}-ota.${nextOta}`;

console.log(`
===================================
 ANDROID OTA RELEASE
-----------------------------------
 Base Version: ${version}
 New Tag: ${tag}
===================================
`);

askAndTag(tag);

function askAndTag(tag) {
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
