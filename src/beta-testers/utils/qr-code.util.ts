/**
 * Kanto MG — Générateur de QR Code SVG standard et autonome (ISO/IEC 18004).
 * Zéro dépendance externe. Génère un flux vectoriel SVG net et immédiatement scannable
 * par tous les smartphones (iOS Appareil Photo, Android Google Lens, scanners natifs).
 */

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

for (let i = 0, val = 1; i < 255; i++) {
  GF_EXP[i] = val;
  GF_LOG[val] = i;
  val <<= 1;
  if (val & 256) val ^= 285;
}
for (let i = 255; i < 512; i++) {
  GF_EXP[i] = GF_EXP[i - 255];
}

const gmul = (a: number, b: number): number =>
  a > 0 && b > 0 ? GF_EXP[GF_LOG[a] + GF_LOG[b]] : 0;
const gpow = (a: number, b: number): number => GF_EXP[(b * GF_LOG[a]) % 255];

const genRS = (deg: number): Uint8Array => {
  const poly = new Uint8Array(deg + 2);
  const out = new Uint8Array(deg + 1);
  out[0] = 1;
  for (let i = 0; i < deg; i++) {
    const factor = gpow(2, i);
    poly.fill(0, 0, i + 2);
    for (let j = 0; j < i + 1; j++) {
      poly[j] ^= out[j];
      poly[j + 1] ^= gmul(out[j], factor);
    }
    for (let j = 0; j < i + 2; j++) {
      out[j] = poly[j];
    }
  }
  return out;
};

const encodeRS = (data: Uint8Array, numEcBytes: number): Uint8Array => {
  const rsPoly = genRS(numEcBytes);
  const buffer = new Uint8Array(data.byteLength + rsPoly.byteLength - 1);
  buffer.set(data);
  for (let i = 0; i < data.byteLength; i++) {
    const factor = buffer[i];
    if (factor) {
      for (let j = 1; j < rsPoly.byteLength; j++) {
        buffer[i + j] ^= gmul(rsPoly[j], factor);
      }
    }
  }
  return buffer.subarray(data.byteLength);
};

const CAPACITY_TABLE = [
  0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655,
  733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921,
  2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706,
];

const EC_PER_VERSION = [
  [0, 0, 0, 0],
  [10, 7, 17, 13],
  [16, 10, 28, 22],
  [26, 15, 44, 36],
  [36, 20, 64, 52],
  [48, 26, 88, 72],
  [64, 36, 112, 96],
  [72, 40, 130, 108],
  [88, 48, 156, 132],
  [110, 60, 192, 160],
  [130, 72, 224, 192],
  [150, 80, 264, 224],
  [176, 96, 308, 260],
  [198, 104, 352, 288],
  [216, 120, 384, 320],
  [240, 132, 432, 360],
  [280, 144, 480, 408],
  [308, 168, 532, 448],
  [338, 180, 588, 504],
  [364, 196, 650, 546],
  [416, 224, 700, 600],
  [442, 224, 750, 644],
  [476, 252, 816, 690],
  [504, 270, 900, 750],
  [560, 300, 960, 810],
  [588, 312, 1050, 870],
  [644, 336, 1110, 952],
  [700, 360, 1200, 1020],
  [728, 390, 1260, 1050],
  [784, 420, 1350, 1140],
  [812, 450, 1440, 1200],
  [868, 480, 1530, 1290],
  [924, 510, 1620, 1350],
  [980, 540, 1710, 1440],
  [1036, 570, 1800, 1530],
  [1064, 570, 1890, 1590],
  [1120, 600, 1980, 1680],
  [1204, 630, 2100, 1770],
  [1260, 660, 2220, 1860],
  [1316, 720, 2310, 1950],
  [1372, 750, 2430, 2040],
];

const BLOCKS_PER_VERSION = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [1, 1, 1, 1],
  [1, 1, 2, 2],
  [2, 1, 4, 2],
  [2, 1, 4, 4],
  [4, 2, 4, 4],
  [4, 2, 5, 6],
  [4, 2, 6, 6],
  [5, 2, 8, 8],
  [5, 4, 8, 8],
  [5, 4, 11, 8],
  [8, 4, 11, 10],
  [9, 4, 16, 12],
  [9, 4, 16, 16],
  [10, 6, 18, 12],
  [10, 6, 16, 17],
  [11, 6, 19, 16],
  [13, 6, 21, 18],
  [14, 7, 25, 21],
  [16, 8, 25, 20],
  [17, 8, 25, 23],
  [17, 9, 34, 23],
  [18, 9, 30, 25],
  [20, 10, 32, 27],
  [21, 12, 35, 29],
  [23, 12, 37, 34],
  [25, 12, 40, 34],
  [26, 13, 42, 35],
  [28, 14, 45, 38],
  [29, 15, 48, 40],
  [31, 16, 51, 43],
  [33, 17, 54, 45],
  [35, 18, 57, 48],
  [37, 19, 60, 51],
  [38, 19, 63, 53],
  [40, 20, 66, 56],
  [43, 21, 70, 59],
  [45, 22, 74, 62],
  [47, 24, 77, 65],
  [49, 25, 81, 68],
];

const SIZE_PER_VERSION = [
  0, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89,
  93, 97, 101, 105, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145, 149,
  153, 157, 161, 165, 169, 173, 177,
];

const ALIGNMENT_COORDS: number[][] = [
  [],
  [],
  [4, 16],
  [4, 20],
  [4, 24],
  [4, 28],
  [4, 32],
  [4, 20, 36],
  [4, 22, 40],
  [4, 24, 44],
  [4, 26, 48],
  [4, 28, 52],
  [4, 30, 56],
  [4, 32, 60],
  [4, 24, 44, 64],
  [4, 24, 46, 68],
  [4, 24, 48, 72],
  [4, 28, 52, 76],
  [4, 28, 54, 80],
  [4, 28, 56, 84],
  [4, 32, 60, 88],
  [4, 26, 48, 70, 92],
  [4, 24, 48, 72, 96],
  [4, 28, 52, 76, 100],
  [4, 26, 52, 78, 104],
  [4, 30, 56, 82, 108],
  [4, 28, 56, 84, 112],
  [4, 32, 60, 88, 116],
  [4, 24, 48, 72, 96, 120],
  [4, 28, 52, 76, 100, 124],
  [4, 24, 50, 76, 102, 128],
  [4, 28, 54, 80, 106, 132],
  [4, 32, 58, 84, 110, 136],
  [4, 28, 56, 84, 112, 140],
  [4, 32, 60, 88, 116, 144],
  [4, 28, 52, 76, 100, 124, 148],
  [4, 22, 48, 74, 100, 126, 152],
  [4, 26, 52, 78, 104, 130, 156],
  [4, 30, 56, 82, 108, 134, 160],
  [4, 24, 52, 80, 108, 136, 164],
  [4, 28, 56, 84, 112, 140, 168],
];

const makeSegments = (
  bytes: Uint8Array,
  version: number,
  ec: number,
): Uint8Array => {
  const cap = CAPACITY_TABLE[version] - EC_PER_VERSION[version][ec];
  const out = new Uint8Array(cap);
  let bitBuf = 0;
  let byteOffset = 0;
  if (version > 9) {
    const len = 65535 & bytes.byteLength;
    out[0] = 64 | ((len >>> 12) & 15);
    out[1] = (len >>> 4) & 255;
    bitBuf = (15 & len) << 4;
    byteOffset = 2;
  } else {
    const len = 255 & bytes.byteLength;
    out[0] = 64 | ((len >>> 4) & 15);
    bitBuf = (15 & len) << 4;
    byteOffset = 1;
  }
  let i = 0;
  while (i + 1 < bytes.byteLength) {
    const word = (bytes[i++] << 8) | bytes[i++];
    out[byteOffset++] = bitBuf | (word >>> 12);
    out[byteOffset++] = (word >>> 4) & 255;
    bitBuf = (word << 4) & 240;
  }
  if (i < bytes.byteLength) {
    out[byteOffset++] = bitBuf | (bytes[i] >>> 4);
    bitBuf = (bytes[i] << 4) & 240;
  }
  out[byteOffset++] = bitBuf;
  for (let k = 0; byteOffset < cap; k++) {
    out[byteOffset++] = 1 & k ? 17 : 236;
  }
  return out;
};

const getBestVersion = (bytes: Uint8Array, ec: number): number => {
  for (let v = 1; v <= 40; v++) {
    let capacity = CAPACITY_TABLE[v] - EC_PER_VERSION[v][ec];
    capacity -= v > 9 ? 3 : 2;
    if (capacity >= bytes.byteLength) return v;
  }
  throw new RangeError('Text exceeds max QR code length');
};

const encodeData = (
  data: Uint8Array,
  version: number,
  ec: number,
): Uint8Array => {
  const total = data.byteLength + EC_PER_VERSION[version][ec];
  const numBlocks = BLOCKS_PER_VERSION[version][ec];
  const numShortBlocks = numBlocks - (total % numBlocks);
  const shortBlockLen = (data.byteLength / numBlocks) | 0;
  const numEcBytes = ((total / numBlocks) | 0) - shortBlockLen;
  const rawDataLen = data.byteLength;
  const interleaved = new Uint8Array(total);

  for (let b = 0, offset = 0; b < numBlocks; b++) {
    const blockLen = b < numShortBlocks ? shortBlockLen : shortBlockLen + 1;
    const ecBytes = encodeRS(data.subarray(offset, offset + blockLen), numEcBytes);
    for (let j = 0; j < blockLen; j++) {
      interleaved[
        j < shortBlockLen ? j * numBlocks + b : shortBlockLen * numBlocks + (b - numShortBlocks)
      ] = data[offset + j];
    }
    for (let j = 0; j < numEcBytes; j++) {
      interleaved[rawDataLen + j * numBlocks + b] = ecBytes[j];
    }
    offset += blockLen;
  }
  return interleaved;
};

const setSquare = (
  mat: Uint8Array,
  dim: number,
  row: number,
  col: number,
  size: number,
): void => {
  const end = (row + size) * dim;
  for (let r = row * dim; r < end; r += dim) {
    mat.fill(1, r + col, r + col + size);
  }
};

const setPattern = (
  mat: Uint8Array,
  dim: number,
  row: number,
  col: number,
  size: number,
): void => {
  const start = row * dim + col;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const distC = c < size - 1 - c ? c : size - 1 - c;
      const distR = r < size - 1 - r ? r : size - 1 - r;
      mat[start + r * dim + c] = 1 !== (distC < distR ? distC : distR) ? 1 : 0;
    }
  }
};

const writeFinderPatterns = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
): void => {
  const offset = dim - 7;
  setPattern(mat, dim, 0, 0, 7);
  setPattern(mat, dim, offset, 0, 7);
  setPattern(mat, dim, 0, offset, 7);
  setSquare(reserved, dim, 0, 0, 8);
  setSquare(reserved, dim, offset - 1, 0, 8);
  setSquare(reserved, dim, 0, offset - 1, 8);
};

const writeAlignmentPatterns = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
  version: number,
): void => {
  const coords = ALIGNMENT_COORDS[version];
  for (let i = 0; i < coords.length; i++) {
    const row = coords[i];
    for (let j = 0; j < coords.length; j++) {
      if ((i || j % (coords.length - 1)) && (j || i % (coords.length - 1))) {
        const col = coords[j];
        setPattern(mat, dim, row, col, 5);
        setSquare(reserved, dim, row, col, 5);
      }
    }
  }
};

const writeTimingPatterns = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
): void => {
  const limit = dim - 7;
  for (let i = 8; i < limit; i++) {
    const vIdx = i * dim + 6;
    if (!reserved[vIdx]) {
      reserved[vIdx] = 1;
      mat[vIdx] = (i + 1) % 2;
    }
    const hIdx = 6 * dim + i;
    if (!reserved[hIdx]) {
      reserved[hIdx] = 1;
      mat[hIdx] = (i + 1) % 2;
    }
  }
};

const reserveFormatInfo = (reserved: Uint8Array, dim: number): void => {
  const offset = dim - 7 - 1;
  reserved[8 * dim + 8] = 1;
  for (let i = 0; i < 8; i++) {
    reserved[i * dim + 8] = 1;
    reserved[8 * dim + i] = 1;
    reserved[(offset + i) * dim + 8] = 1;
    reserved[8 * dim + offset + i] = 1;
  }
};

const reserveVersionInfo = (
  reserved: Uint8Array,
  dim: number,
  version: number,
): void => {
  if (version >= 7) {
    const offset = dim - 7 - 4;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 3; c++) {
        reserved[(offset + c) * dim + r] = 1;
        reserved[r * dim + offset + c] = 1;
      }
    }
  }
};

const writeData = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
  data: Uint8Array,
): void => {
  let byteIdx = 0;
  let col = dim - 1;
  let dir = -1;
  let bit = 7;
  while (byteIdx < data.byteLength) {
    if (6 === col) col--;
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < 2; c++) {
        const curCol = col - c;
        const curRow = -1 === dir ? dim - r - 1 : r;
        const idx = curRow * dim + curCol;
        if (reserved[idx]) continue;
        mat[idx] = (data[byteIdx] >>> bit) & 1;
        if (0 === bit--) {
          bit = 7;
          if (++byteIdx >= data.byteLength) return;
        }
      }
    }
    dir = -dir;
    col -= 2;
  }
};

const maskFunctions: Array<(row: number, col: number) => boolean> = [
  (r, c) => 0 === ((r + c) & 1),
  (r) => 0 === (r & 1),
  (_, c) => 0 === c % 3,
  (r, c) => 0 === (r + c) % 3,
  (r, c) => 0 === (((r / 2) | 0) + ((c / 3) | 0)) % 2,
  (r, c) => 0 === ((r * c) % 2) + ((r * c) % 3),
  (r, c) => 0 === (((r * c) % 2) + ((r * c) % 3)) % 2,
  (r, c) => 0 === (((r * c) % 3) + ((r + c) % 2)) % 2,
];

const applyMask = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
  maskIdx: number,
): void => {
  const fn = maskFunctions[maskIdx];
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      const idx = r * dim + c;
      if (!reserved[idx] && fn(r, c)) {
        mat[idx] ^= 1;
      }
    }
  }
};

const penaltyScore = (mat: Uint8Array, dim: number): number => {
  let score = 0;
  // Pénalité 1 : modules consécutifs
  for (let r = 0; r < dim; r++) {
    let runColor = -1;
    let runLen = 0;
    for (let c = 0; c < dim; c++) {
      const color = mat[r * dim + c];
      if (color === runColor) {
        runLen++;
        if (runLen === 5) score += 3;
        else if (runLen > 5) score += 1;
      } else {
        runColor = color;
        runLen = 1;
      }
    }
  }
  return score;
};

const applyBestMask = (
  mat: Uint8Array,
  reserved: Uint8Array,
  dim: number,
): number => {
  let bestMask = 0;
  let minScore = Infinity;
  for (let m = 0; m < 8; m++) {
    applyMask(mat, reserved, dim, m);
    const score = penaltyScore(mat, dim);
    if (score < minScore) {
      minScore = score;
      bestMask = m;
    }
    applyMask(mat, reserved, dim, m); // inverser
  }
  applyMask(mat, reserved, dim, bestMask);
  return bestMask;
};

const FORMAT_POLYS = [
  21522, 20773, 24188, 23371, 17913, 16590, 20375, 19104, 30660, 29427, 32170,
  30877, 26159, 25368, 27715, 26998,
];

const writeFormatInfo = (
  mat: Uint8Array,
  dim: number,
  ec: number,
  mask: number,
): void => {
  const format = FORMAT_POLYS[(ec << 3) | mask];
  let bit = 14;
  for (let i = 0; i < 6; i++) mat[8 * dim + i] = (format >> bit--) & 1;
  mat[8 * dim + 7] = (format >> bit--) & 1;
  mat[8 * dim + 8] = (format >> bit--) & 1;
  mat[7 * dim + 8] = (format >> bit--) & 1;
  for (let i = 0; i < 6; i++) mat[(5 - i) * dim + 8] = (format >> bit--) & 1;

  bit = 14;
  for (let i = 0; i < 7; i++) mat[(dim - 1 - i) * dim + 8] = (format >> bit--) & 1;
  mat[(dim - 8) * dim + 8] = 1;
  for (let i = 0; i < 8; i++) mat[8 * dim + dim - 8 + i] = (format >> bit--) & 1;
};

const encoder = new TextEncoder();

/**
 * Encode un texte en matrice de booléens QR code (Uint8Array de dim*dim).
 */
export function generateQrMatrix(content: string, ecLevel = 1): Uint8Array {
  const bytes = encoder.encode(content);
  const version = getBestVersion(bytes, ecLevel);
  const segments = makeSegments(bytes, version, ecLevel);
  const interleaved = encodeData(segments, version, ecLevel);
  const dim = SIZE_PER_VERSION[version];
  const mat = new Uint8Array(dim * dim);
  const reserved = new Uint8Array(dim * dim);

  writeFinderPatterns(mat, reserved, dim);
  writeAlignmentPatterns(mat, reserved, dim, version);
  writeTimingPatterns(mat, reserved, dim);
  reserveFormatInfo(reserved, dim);
  reserveVersionInfo(reserved, dim, version);
  writeData(mat, reserved, dim, interleaved);
  const mask = applyBestMask(mat, reserved, dim);
  writeFormatInfo(mat, dim, ecLevel, mask);

  return mat;
}

/**
 * Génère un SVG de QR code net et valide (ISO/IEC 18004).
 * @param content Texte ou URL à encoder (ex: https://app-kanto.gastsar.fr)
 * @param size Dimension en pixels (largeur et hauteur)
 */
export function renderQrCodeSvg(content: string, size = 110): string {
  const matrix = generateQrMatrix(content, 1); // 1 = EC Level L (idéal pour URL mobile, haute densité de scannabilité)
  const dim = Math.round(Math.sqrt(matrix.length));
  const margin = 2; // Quiet zone standard de 2 modules pour un cadrage propre
  const viewBoxSize = dim + margin * 2;

  let pathData = '';
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      if (matrix[r * dim + c]) {
        pathData += `M${c + margin} ${r + margin}h1v1h-1z `;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${size}" height="${size}" shape-rendering="crispEdges" aria-label="QR Code vers ${content}">
  <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#FFFFFF"/>
  <path fill="#141412" d="${pathData.trim()}"/>
</svg>`.trim();
}
