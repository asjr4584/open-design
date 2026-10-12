/**
 * Fork-only GitHub Actions PPTX fixture test.
 *
 * Creates non-sensitive, deterministic synthetic PNG slides using Node builtins,
 * passes them through Open Design's *actual* screenshot-PPTX implementation,
 * and validates ZIP/OOXML slides, embedded images, and slide proportions.
 * This does NOT claim to exercise the editable DOM-to-PPTX renderer.
 */
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import JSZip from 'jszip';
import { buildScreenshotPptx } from '../src/deck-export.js';

const outputRoot = path.resolve(process.cwd(), '../../test-artifacts/pptx-smoke');
const W = 640;
const H = 360;
const labels = ['OPEN DESIGN', 'PPTX EXPORT', 'CI VALIDATION'];
const FONT = {
  A: ['01110','10001','10001','11111','10001','10001','10001'],
  C: ['01111','10000','10000','10000','10000','10000','01111'],
  D: ['11110','10001','10001','10001','10001','10001','11110'],
  E: ['11111','10000','10000','11110','10000','10000','11111'],
  G: ['01111','10000','10000','10111','10001','10001','01111'],
  I: ['11111','00100','00100','00100','00100','00100','11111'],
  L: ['10000','10000','10000','10000','10000','10000','11111'],
  N: ['10001','11001','10101','10011','10001','10001','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'],
  P: ['11110','10001','10001','11110','10000','10000','10000'],
  R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'],
  V: ['10001','10001','10001','10001','10001','01010','00100'],
  X: ['10001','10001','01010','00100','01010','10001','10001'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000']
};
const palette = [
  [[11, 22, 50], [35, 64, 135], [255, 193, 76]],
  [[27, 16, 47], [90, 30, 92], [121, 231, 197]],
  [[12, 42, 40], [12, 105, 94], [255, 191, 121]]
];
const hash = data => createHash('sha256').update(data).digest('hex');
function crc32(buf) {
  let crc = -1;
  for (const byte of buf) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}
function pngChunk(name, data) {
  const type = Buffer.from(name);
  const n = Buffer.alloc(4);
  n.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([type, data])));
  return Buffer.concat([n, type, data, crc]);
}
function raster(index, width, height) {
  const pixels = Buffer.alloc(width * height * 3);
  const [base, shade, accent] = palette[index % palette.length];
  const fill = (x, y, col) => {
    const p = (y * width + x) * 3;
    pixels[p] = col[0];
    pixels[p+1] = col[1];
    pixels[p+2] = col[2];
  };
  const rect = (x, y, w, h, col) => {
    for (let yy = Math.max(0,y); yy < Math.min(height,y+h); yy++) {
      for (let xx = Math.max(0,x); xx < Math.min(width,x+w); xx++) fill(xx,yy,col);
    }
  };
  for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
      const t = x/width*0.6 + y/height*0.4;
      fill(x,y,base.map((v,c) => Math.round(v+(shade[c]-v)*t)));
    }
  }
  const k=width/640;
  rect(Math.round(36*k),Math.round(44*height/360),Math.round(7*k),Math.round(259*height/360),accent);
  rect(Math.round(375*k),Math.round(79*height/360),Math.round(195*k),Math.round(194*height/360),accent.map(v=>Math.round(v*.34)));
  rect(Math.round(405*k),Math.round(111*height/360),Math.round(134*k),Math.round(22*height/360),accent);
  rect(Math.round(405*k),Math.round(154*height/360),Math.round(112*k),Math.round(10*height/360),[245,245,245]);
  rect(Math.round(405*k),Math.round(181*height/360),Math.round(82*k),Math.round(10*height/360),[245,245,245]);
  const label=labels[index%labels.length];
  let cx=Math.round(71*k), cy=Math.round(138*height/360);
  const scale=Math.max(1,Math.round(width/160));
  for(const ch of label) {
    const glyph=FONT[ch];
    assert(glyph, 'unknown test font glyph: '+ch);
    for(let gy=0;gy<7;gy++) for(let gx=0;gx<5;gx++)
      if(glyph[gy][gx]==='1') rect(cx+gx*scale,cy+gy*scale,scale,scale,[250,250,253]);
    cx += 6*scale;
  }
  const scan = Buffer.alloc(height*(1+width*3));
  for(let y=0;y<height;y++)pixels.copy(scan,y*(1+width*3)+1,y*width*3,(y+1)*width*3);
  const header=Buffer.alloc(13);
  header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);
  header[8]=8;header[9]=2;header[10]=0;header[11]=0;header[12]=0;
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a','hex'),
    pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(scan)),pngChunk('IEND',Buffer.alloc(0))
  ]);
}
async function checkPptx(bytes, expectedSlides, aspect, expectedPngs) {
  assert.equal(bytes.subarray(0,2).toString('latin1'),'PK');
  const zip=await JSZip.loadAsync(bytes);
  assert(zip.file('[Content_Types].xml'));
  const slideFiles=Object.keys(zip.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n));
  assert.equal(slideFiles.length,expectedSlides,'OOXML slide count');
  const pres=await zip.file('ppt/presentation.xml').async('string');
  const sz=/<p:sldSz[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/.exec(pres);
  assert(sz,'slide size XML is present');
  assert(Math.abs(Number(sz[1])/Number(sz[2])-aspect)<0.003,'slide aspect mismatch');
  for(const file of slideFiles){
    const xml=await zip.file(file).async('string');
    assert(xml.includes('<p:pic>'),'expected a raster image on '+file);
    assert(!xml.includes('<a:t>'),'raster PPTX must not claim native editable text');
  }
  const media=Object.keys(zip.files).filter(n=>/^ppt\/media\/.*\.png$/.test(n));
  assert.equal(media.length,expectedSlides,'one embedded PNG per slide');
  const embeddedHashes=await Promise.all(media.map(async n=>hash(await zip.file(n).async('nodebuffer'))));
  assert.deepEqual(embeddedHashes.sort(),expectedPngs.map(hash).sort(),'embedded images must match originals');
  return {slides:slideFiles.length,aspect:Number(sz[1])/Number(sz[2]),embeddedPng:media.length,bytes:bytes.length,sha256:hash(bytes)};
}
await mkdir(outputRoot,{recursive:true});
const images=[];
for(let i=0;i<3;i++){
  const buffer=raster(i,W,H);
  images.push({buffer,jpeg:false});
  await writeFile(path.join(outputRoot,'slide-'+String(i+1).padStart(2,'0')+'.png'),buffer);
}
const deck=await buildScreenshotPptx(images,{title:'Open Design fork CI smoke - screenshot mode',aspect:16/9});
await writeFile(path.join(outputRoot,'open-design-landscape-screenshot.pptx'),deck);
const wideResult=await checkPptx(deck,3,16/9,images.map(i=>i.buffer));
const portraitImg=raster(1,360,640);
await writeFile(path.join(outputRoot,'portrait-slide.png'),portraitImg);
const portrait=await buildScreenshotPptx([{buffer:portraitImg,jpeg:false}],{title:'Portrait screenshot smoke',aspect:9/16});
await writeFile(path.join(outputRoot,'open-design-portrait-screenshot.pptx'),portrait);
const portraitResult=await checkPptx(portrait,1,9/16,[portraitImg]);
const report={
  schemaVersion:1,
  repo:'asjr4584/open-design',
  gitSha:process.env.GITHUB_SHA || 'local',
  verification:'actual Open Design buildScreenshotPptx generated, zipped, structurally verified',
  editability:'screenshot-only; text is rasterized, editable DOM-to-PPTX E2E not claimed',
  landscape:wideResult,
  portrait:portraitResult,
  note:'Fixtures are synthetic RGB scenes, not AI-designed slides nor a visual PowerPoint round-trip.'
};
await writeFile(path.join(outputRoot,'pptx-smoke-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
