// HOLLYWOOD RISING - APPEND MISSING GAME IDS TO THE OFFLINE PACK
// Downloads every game-referenced image ID that is not yet bundled, into
// public/assets/offline/game/, and updates manifest.json.
// Same safety model as build-asset-pack.mjs: https + allowlisted host only.
import { writeFileSync, readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, normalize } from "path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = normalize(join(ROOT, "public", "assets", "offline"));
const HOST = "images.unsplash.com";
const CAT = "game";

const MISSING = [
"1506794778202-cad84cf45f1d","1518676599625-583008082980","1566073771259-6a8506099945",
"1486406146926-c627a92ad1ab","1555396273-367ea4eb4db5","1540555700478-4be289fbecef",
"1586528116311-ad8dd3c8310d","1613977257363-707ba9348227","1539571696357-5a69c17a67c6",
"1517841905240-472988babdf9","1524504388940-b1c1722653e1","1515372039744-b8f02a3ae446",
"1534447677768-be436bb09401","1515886657613-9f3515b0c78f","1554224155-8d04cb21cd6c",
"1518173946687-a4c8a383392d","1579783902614-a3fb3927b6a0","1518173946687-a4c8a383392e",
"1579783902614-a3fb3927b675","1598899134739-24c46f58b8c0","1607604276583-eef5d076aa5f",
"1509198397868-475647b2a1e5","1518709268805-4e9042af9f23","1574375927938-d5a98e8ffe85",
"1526374965328-7f61d4dc18c5","1611186871348-b1ce696e52c9","1611162617213-7d7a39e9b1d7",
"1611162616091-26b21557b4a7","1578632767115-351597cf2477","1593784991095-a205069470b6",
"1585829365295-ab7cd400c167","1594909122845-11baa439b7bf","1522071820081-009f0129c71c",
"1516450360452-9312f5e86fc7","1504711434969-e33886168f5c","1495020689067-958852a7765e",
"1521737604893-d14cc237f11d","1540575467063-178a50c2df87","1461896836934-ffe607ba8211",
"1500530855697-b586d89ba3ee","1487180144351-b8472da7d491","1598387993441-a364f854c3e1",
"1506784983877-45594efa4cbe","1574717024653-61fd2cf4d44d","1478737270239-2f02b77fc618",
"1598488035139-bdbb2231ce04","1598653222000-6b7b7a552625","1554774853-aae0a22c8aa4",
"1499415479124-43c32433a620","1461897104016-0b3b00cc82ee","1519874179391-3ebc752241dd",
"1589829545856-d10d557cf95f","1505664194779-8beaceb93744","1450133064473-71024230f91b",
"1521791136064-7986c2920216","1436450412740-6b988f486c6b","1497366216548-37526070297c",
"1574267432553-4b4628081c31","1522869635100-9f4c5e86aa37","1501196354995-cbb51c65aaea",
"1578269174936-2709b6aeb913","1516321318423-f06f85e504b3","1611162617474-5b21e879e113",
"1507679799987-c73779587ccf","1502672260266-1c1ef2d93688","1560448204-e02f11c3d0e2",
"1522708323590-d24dbb6b0267","1513694203232-719a280e022f","1545324418-cc1a3fa10c00",
"1493809842364-78817add7ffb","1518780664697-55e3ad937233","1568605117036-5fe5e7bab0b7",
"1600566753376-12c8ab7fb75b","1542314831-068cd1dbfeeb","1584345604476-8ec5e12e42dd",
"1560958089-b8a1929cea89","1614162692292-7ac56d7f7f1e","1520031441872-265e4ff70366",
"1519345182560-3f2917c472ef","1529626455594-4ff0802cfb7e","1490481651871-ab68de25d43d",
"1522335789203-aabd1fc54bc9","1511707171634-5f897ff02aa9","1527661591475-527312dd65f5",
"1522337360788-8b13dee7a37e","1506521781263-d8422e82f27a","1541872703-74c5e44368f9",
"1513151233558-d860c5398176","1507525428034-b723cf961d3e","1499856871958-5b9627545d1a",
"1526778548025-fa2f459cd5c1","1516849841032-87cbac4d88f7","1444723121867-7a241cacace9",
"1519331379826-f10be5486c6f","1580674684081-7617fbf3d745","1441986300917-64674bd600d8",
];

const manifestPath = join(OUT, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest[CAT] = manifest[CAT] || [];
const dir = normalize(join(OUT, CAT));
if (!dir.startsWith(OUT)) throw new Error("bad category dir");
mkdirSync(dir, { recursive: true });

let ok = 0;
const failures = [];
for (const id of MISSING) {
  if (!/^[0-9]+-[a-f0-9]{10,16}$/.test(id)) { failures.push(id); continue; }
  const file = join(dir, CAT + "_" + id.slice(-12) + ".jpg");
  try {
    if (existsSync(file) && statSync(file).size > 4000) {
      // already present
    } else {
      const url = `https://${HOST}/photo-${id}?auto=format&fit=crop&q=85&w=1100`;
      const parsed = new URL(url);
      if (parsed.hostname !== HOST) throw new Error("blocked host");
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 4000) throw new Error("too small");
      if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) throw new Error("not an image");
      writeFileSync(file, buf);
    }
    const rel = "assets/offline/" + CAT + "/" + CAT + "_" + id.slice(-12) + ".jpg";
    if (!manifest[CAT].includes(rel)) manifest[CAT].push(rel);
    ok++;
  } catch (e) {
    failures.push(id.slice(0, 12) + ":" + e.message);
  }
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log(`appended ${ok}/${MISSING.length} game images`);
if (failures.length) console.log("failed:", failures.join(", "));
