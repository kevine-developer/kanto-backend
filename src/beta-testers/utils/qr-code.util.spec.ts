import { renderQrCodeSvg, generateQrMatrix } from './qr-code.util.js';

describe('QrCodeUtil', () => {
  it('doit générer une matrice QR valide de dimension carrée', () => {
    const url = 'https://app-kanto.gastsar.fr';
    const matrix = generateQrMatrix(url);

    expect(matrix).toBeInstanceOf(Uint8Array);
    const dim = Math.sqrt(matrix.length);
    expect(Number.isInteger(dim)).toBe(true);
    expect(dim).toBeGreaterThanOrEqual(21);
  });

  it('doit générer un SVG vectoriel scannable avec crispEdges et une marge de sécurité', () => {
    const url = 'https://app-kanto.gastsar.fr';
    const svg = renderQrCodeSvg(url, 120);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('width="120"');
    expect(svg).toContain('height="120"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('fill="#FFFFFF"');
    expect(svg).toContain('fill="#141412"');
    expect(svg).toContain('d="M');
  });
});
