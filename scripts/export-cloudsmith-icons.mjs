import * as NodeChildProcess from "node:child_process";
import * as NodeFS from "node:fs";
import { encodePngIco, WINDOWS_ICON_SIZES } from "./lib/icon-export.ts";

const tmp = "/tmp/cs-icons";
NodeFS.rmSync(tmp, { recursive: true, force: true });
NodeFS.mkdirSync(tmp, { recursive: true });
const M = (...args) => NodeChildProcess.execFileSync("magick", args, { stdio: ["pipe", "ignore", "inherit"] });

// The baked Cloudsmith mark path, already in the 128pt box (x 34.27..91.27, y 37..94).
const markPath = NodeFS
  .readFileSync("assets/prod/app-icon.icon/Assets/text.svg", "utf8")
  .match(/<path[^>]*\/>/)[0];
const glyphSvgFile = (color, file) =>
  NodeFS.writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none">${markPath.replace('fill="white"', `fill="${color}"`)}</svg>`);

// Brand backgrounds as magick-native radial gradients (center -> edge).
const gradients = {
  prod: ["#1a1a1a", "#000000"],
  nightly: ["#7a48c2", "#0D1338"],
  dev: ["#A9C0F0", "#8DADEC"],
};

const roundedTile = (size, [center, edge], glyphFile, out) => {
  const radius = Math.round(size * 0.22);
  M("-size", `${size}x${size}`, `radial-gradient:${center}-${edge}`, `${tmp}/bg.png`);
  M("-size", `${size}x${size}`, "xc:none", "-fill", "white", "-draw",
    `roundrectangle 0,0 ${size - 1},${size - 1} ${radius},${radius}`, `${tmp}/mask.png`);
  M("-background", "none", `${tmp}/bg.png`, `${tmp}/mask.png`, "-alpha", "off", "-compose",
    "CopyOpacity", "-composite", `${tmp}/tile.png`);
  M("-background", "none", glyphFile, "-resize", `${Math.round(size * 0.448)}x${Math.round(size * 0.448)}`, `${tmp}/glyph.png`);
  M("-background", "none", `${tmp}/tile.png`, `${tmp}/glyph.png`, "-gravity", "center",
    "-compose", "over", "-composite", out);
};

glyphSvgFile("#FFFFFF", `${tmp}/glyph.svg`);
const brands = {
  prod: { ios: "assets/prod/black-ios-1024.png", mac: "assets/prod/black-macos-1024.png", uni: "assets/prod/black-universal-1024.png", wico: "assets/prod/agentsmith-black-windows.ico", wweb: "assets/prod/agentsmith-black-web-favicon.ico", f16: "assets/prod/agentsmith-black-web-favicon-16x16.png", f32: "assets/prod/agentsmith-black-web-favicon-32x32.png", at: "assets/prod/agentsmith-black-web-apple-touch-180.png" },
  nightly: { ios: "assets/nightly/nightly-ios-1024.png", mac: "assets/nightly/nightly-macos-1024.png", uni: "assets/nightly/nightly-universal-1024.png", wico: "assets/nightly/nightly-windows.ico", wweb: "assets/nightly/nightly-web-favicon.ico", f16: "assets/nightly/nightly-web-favicon-16x16.png", f32: "assets/nightly/nightly-web-favicon-32x32.png", at: "assets/nightly/nightly-web-apple-touch-180.png" },
  dev: { ios: "assets/dev/blueprint-ios-1024.png", mac: "assets/dev/blueprint-macos-1024.png", uni: "assets/dev/blueprint-universal-1024.png", wico: "assets/dev/blueprint-windows.ico", wweb: "assets/dev/blueprint-web-favicon.ico", f16: "assets/dev/blueprint-web-favicon-16x16.png", f32: "assets/dev/blueprint-web-favicon-32x32.png", at: "assets/dev/blueprint-web-apple-touch-180.png" },
};

const icoRenditions = {};
for (const [name, b] of Object.entries(brands)) {
  const tile = (size, out) => roundedTile(size, gradients[name], `${tmp}/glyph.svg`, out);
  tile(1024, `${tmp}/${name}-1024.png`);
  NodeFS.copyFileSync(`${tmp}/${name}-1024.png`, b.ios);
  NodeFS.copyFileSync(`${tmp}/${name}-1024.png`, b.uni);
  tile(180, b.at);
  tile(32, b.f32);
  tile(16, b.f16);
  // macOS: 824 opaque body inset with a soft drop shadow, per the repo's export spec.
  tile(824, `${tmp}/${name}-mac-824.png`);
  M("-background", "none", "(", `${tmp}/${name}-mac-824.png`, ")",
    "(", "+clone", "-background", "black", "-shadow", "60x24+0+12", ")",
    "+swap", "-background", "none", "-compose", "over", "-layers", "merge",
    "-gravity", "center", "-extent", "1024x1024", b.mac);
  icoRenditions[name] = WINDOWS_ICON_SIZES.map((size) => {
    const file = `${tmp}/${name}-ico-${size}.png`;
    tile(size, file);
    return { size, contents: NodeFS.readFileSync(file) };
  });
}
for (const [name, b] of Object.entries(brands)) {
  const ico = encodePngIco(icoRenditions[name]);
  NodeFS.writeFileSync(b.wico, ico);
  NodeFS.writeFileSync(b.wweb, ico);
}
console.log("brand icons written");
