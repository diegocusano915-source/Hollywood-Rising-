// HOLLYWOOD RISING - OFFLINE ASSET PACK BUILDER
// Downloads curated free-license images from ONE allowlisted host
// (images.unsplash.com, https only) with server-side sizing params, and
// lands them in public/assets/offline/<category>/ with a manifest.json.
// Target pack: 65-80MB. Failures are skipped and reported at the end.
import { writeFileSync, existsSync, statSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, normalize } from "path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = normalize(join(ROOT, "public", "assets", "offline"));
const HOST = "images.unsplash.com";
const SOFT_CAP = 72 * 1024 * 1024;

const CATS = {
  portraits: { maxW: 900, ids: [
    "1500648767791-00dcc994a43e","1494790108377-be9c29b29330","1507003211169-0a1dd7228f2d",
    "1438761681033-6461ffad8d80","1472099645785-5658abf4ff4e","1534528741775-53994a69daeb",
    "1531427186611-ecfd6d936c79","1544005313-94ddf0286df2","1547425260-76bcadfb4f2c",
    "1560250097-0b93528c311a","1573496359142-b8d87734a5a2","1580489944761-15a19d654956",
    "1633332755192-727a05c4013d","1599566150163-29194dcaad36","1607746882042-944635dfe10e",
    "1527980965255-d3b416303d12","1535713875002-d1d0cf377fde","1552058544-f2b08422138a",
    "1542909168-82c3e7fdca5c","1546539782-6fc531453083","1554151228-14d9def656e4",
    "1567532939604-b6b5b0db2604","1586297135537-94bc9ba060aa","1616805765352-beedbad46b2a",
    "1595152772835-219674b2a8a6","1603415526960-f7e0328c63b1","1544723795-3fb6469f5b39",
    "1568602471122-7832951cc4c5","1570295999919-56ceb5ecca61","1580852300654-03c803a14e24",
    "1590086782957-93c06ef21604","1606804465748-219ba2c2893f","1601412436009-d964bd02edbc",
    "1610088441520-4352457e7095","1618835962148-cf177563c6c0","1622253692010-333f2da6031d",
    "1506794778202-cad84cf45f1f","1519085360753-af0119f7cbe7","1573140247632-f8fd74997d5c",
    "1591084728795-1149f32d9866","1600486913747-55e5470d6f40","1607346256330-dee7af15f7c5",
    "1618077360395-f3068be8e001","1620122303020-71ecaccae1d0","1629467057571-42d22d8f0cbd",
    "1636041293178-808a6762ab39","1651684215020-f7a5b6610f23","1664575602554-2087b04935a5",
  ]},
  cars: { maxW: 2200, ids: [
    "1503376780353-7e6692767b70","1552519507-da3b142c6e3d","1493238792000-8113da705763",
    "1511919884226-fd3cad34687c","1542362567-b07e54358753","1555215695-3004980ad54e",
    "1583121274602-3e2820c69888","1567818735868-e71b99932e29","1494976388531-d1058494cdd8",
    "1502877338535-766e1452684a","1544636331-e26879cd4d9b","1605559424843-9e4c228bf1c2",
    "1617788138017-80ad40651399","1553440569-bcc63803a83d","1571607388263-1044f9ea01dd",
    "1580273916550-e323be2ae537","1549317661-bd32c8ce0db2","1617531653332-bd46c24f2068",
    "1525609004556-c46c7d6cf023","1494905998402-395d579af36f","1533473359331-0135ef1b58bf",
    "1563720223185-11003d516935","1592198084033-aade902d1aae","1606664515524-ed2f786a0bd6",
    "1614026480418-bd11fde6f8a9","1619767886558-efdc259cde1a","1621007947382-bb3c400959d3",
    "1632245889029-e406faaa34cd","1493976040374-85c8e12f0c0e","1519641471654-76ce0107ad1b",
    "1517672651691-24622a91b550","1522932467653-e48f79727abf","1541899481282-d53bffe3c35d",
    "1555353540-64580b51c258","1558980664-10e7170b5df9","1558980394-dbb977039a2e",
    "1560253023-3ec5d502959f","1571127236794-81c0bbfe1ce3","1580274455191-1c62238fa333",
    "1590362891991-f776e747a588","1600712242805-5f78671b24da","1606220838315-056192d5e927",
    "1616422285623-13ff0162193c","1622185135505-2d795003994a","1631295868223-63265b40d9e4",
  ]},
  houses: { maxW: 2200, ids: [
    "1568605114967-8130f3a36994","1600596542815-ffad4c1539a9","1600607687939-ce8a6c25118c",
    "1600585154340-be6161a56a0c","1512917774080-9991f1c4c750","1613490493576-7fde63acd811",
    "1600047509807-ba8f99d2cdde","1600566753086-00f18fb6b3ea","1600607687920-4e2a09cf159d",
    "1600585152220-90363fe7e115","1583608205776-bfd35f0d9f83","1564013799919-ab600027ffc6",
    "1570129477492-45c003edd2be","1580587771525-78b9dba3b914","1600585154363-67eb9e2e2099",
    "1600210492486-724fe5c67fb0","1600607688969-a5bfcd646154","1600573472592-401b489a3cdc",
    "1600585154526-990dced4db0d","1523217582562-09d0def993a6","1600047509358-9dc75507daeb",
    "1600129362589-ec72a34a1a54","1600566752355-35792bedcfea","1600566752229-250ed79470f8",
    "1600585153490-76fb20a32601","1592595895381-fcd8ce7fcf64","1598228723793-4b068aa5c07d",
    "1600494448850-6013c64ba722","1600607688066-890987f18a86","1512915922686-57c11dde9b6b",
    "1416331108676-a22ccb276e35","1505843518503-33582066e14d","1449844908441-8829872d2607",
    "1448630360428-65456885c650","1460317442991-0ec209397118","1430285561322-7808604715df",
    "1439337153520-7082a56a81f4","1477959858617-67f85cf4f1df","1494526585095-c41746248156",
    "1479839672679-a46483c0e7c8","1502005229762-cf1b2da7c5d6",
  ]},
  extras: { maxW: 2200, ids: [
    "1544551763-46a013bb70d5","1540962351504-03099e0a754b","1436491865332-7a61a109cc05",
    "1470225620780-dba8ba36b745","1478720568477-152d9b164e26","1485846234645-a62644f84728",
    "1489599849927-2ee91cede3ba","1517604931442-7e0c8ed2963c","1536440136628-849c177e76a1",
    "1486312338219-ce68d2c6f44d","1461749280684-dccba630e2f6","1519389950473-47ba0277781c",
    "1556761175-b413da4baf72","1559523182-a284c3fb7cff","1574357157635-ce7a3bfc8f9e",
    "1518049362265-d5b2a6467637","1519810755548-39cd217da494","1533106958148-daaeab8b83fe",
    "1514525253161-7a46d19cd819","1492684223066-81342ee5ff30","1519671482749-fd09be7ccebf",
    "1505506875981-5c4843eb8de4","1514320291840-2e0a9bf2a9ae","1493225457124-a3eb161ffa5f",
    "1470229722913-7c0e2dbbafd3","1459749411175-04bf5292ceea","1501281668745-f7f57925c3b4",
    "1429962714451-bb934ecdc4ec","1511671782779-c97d3d27a1d4","1516280440614-37939bbacd81",
  ]},
};

const catNames = Object.keys(CATS);
const manifest = {};
const failures = {};
let total = 0;

async function fetchImage(cat, id, maxW) {
  const url = `https://${HOST}/photo-${id}?auto=format&fit=crop&q=90&w=${maxW}`;
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== HOST) throw new Error("blocked host");
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error("too small " + buf.length);
  if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) throw new Error("not an image");
  return buf;
}

async function main() {
  for (const cat of catNames) {
    const { ids, maxW } = CATS[cat];
    const dir = normalize(join(OUT, cat));
    if (!dir.startsWith(OUT)) throw new Error("bad category dir");
    mkdirSync(dir, { recursive: true });
    manifest[cat] = [];
    failures[cat] = [];
    for (const id of ids) {
      if (!/^[0-9]+-[a-f0-9]{10,16}$/.test(id)) { failures[cat].push(id); continue; }
      const file = join(dir, cat + "_" + id.slice(-12) + ".jpg");
      let size = 0;
      try {
        if (existsSync(file) && statSync(file).size > 4000) {
          size = statSync(file).size;
        } else {
          const buf = await fetchImage(cat, id, maxW);
          writeFileSync(file, buf);
          size = buf.length;
        }
      } catch (e) {
        failures[cat].push(id.slice(0, 12) + ":" + e.message);
        continue;
      }
      total += size;
      manifest[cat].push("assets/offline/" + cat + "/" + cat + "_" + id.slice(-12) + ".jpg");
    }
    console.log(`[${cat}] ok=${manifest[cat].length} fail=${failures[cat].length} total=${(total / 1048576).toFixed(1)}MB`);
    if (total > SOFT_CAP) { console.log("soft cap reached - stopping"); break; }
  }
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
  console.log(`\nPACK DONE: ${(total / 1048576).toFixed(1)}MB, ${Object.values(manifest).reduce((a, b) => a + b.length, 0)} images`);
  for (const cat of catNames) if (failures[cat].length) console.log(`  failed ${cat}: ${failures[cat].slice(0, 8).join(", ")}`);
}

main();
