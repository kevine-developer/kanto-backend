import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SeoService } from './seo.service.js';

describe('SeoService', () => {
  let service: SeoService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      malagasyItem: {
        findMany: jest.fn<any>().mockResolvedValue([
          {
            id: 'item-1',
            type: 'OHABOLANA',
            malagasy: 'Ny fihavanana toy ny volon-tsira',
            french: 'La fraternité est comme le grain de sel...',
            meaning: 'Le lien fraternel est précieux.',
            contentMg: 'Ny fihavanana toy ny volon-tsira...',
            contentFr: 'La fraternité est comme le grain de sel...',
            updatedAt: new Date('2026-01-01'),
            createdAt: new Date('2026-01-01'),
          },
        ]),
      },
      conte: {
        findMany: jest.fn<any>().mockResolvedValue([
          {
            id: 'conte-1',
            title: 'Ikotofetsy sy Imahakà',
            synopsis: 'Tantara malaza...',
            updatedAt: new Date('2026-01-02'),
            createdAt: new Date('2026-01-02'),
          },
        ]),
      },
      kabary: {
        findMany: jest.fn<any>().mockResolvedValue([
          {
            id: 'kabary-1',
            title: 'Kabary am-panambadiana',
            excerpt: 'Ry havana, ry sakaiza...',
            updatedAt: new Date('2026-01-03'),
            createdAt: new Date('2026-01-03'),
          },
        ]),
      },
      poesie: {
        findMany: jest.fn<any>().mockResolvedValue([
          {
            id: 'poesie-1',
            title: 'Dinitra',
            author: 'Rado',
            updatedAt: new Date('2026-01-04'),
            createdAt: new Date('2026-01-04'),
          },
        ]),
      },
      citation: {
        findMany: jest.fn<any>().mockResolvedValue([]),
      },
    };

    service = new SeoService(mockPrisma);
  });

  describe('getRobotsTxt', () => {
    it('should generate valid robots.txt allowing search engines on portal domain', () => {
      const robots = service.getRobotsTxt('app-kanto.gastsar.fr');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Allow: /');
      expect(robots).toContain('Disallow: /api/');
      expect(robots).toContain('Disallow: /admin/');
      expect(robots).toContain(
        'Sitemap: https://app-kanto.gastsar.fr/sitemap.xml',
      );
    });

    it('should disallow everything on admin subdomains or staging', () => {
      const robots = service.getRobotsTxt('admin.kanto.mg');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Disallow: /');
      expect(robots).not.toContain('Allow: /');
    });
  });

  describe('getSitemapXml', () => {
    it('should generate a valid XML sitemap without removed category hubs while keeping deeplinks and utility pages', async () => {
      const xml = await service.getSitemapXml();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      );
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/</loc>');
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/pages/about</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/pages/help</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/pages/terms</loc>',
      );
      expect(xml).not.toContain(
        '<loc>https://app-kanto.gastsar.fr/ohabolana</loc>',
      );
      expect(xml).not.toContain(
        '<loc>https://app-kanto.gastsar.fr/angano</loc>',
      );
      expect(xml).not.toContain(
        '<loc>https://app-kanto.gastsar.fr/kabary</loc>',
      );
      expect(xml).not.toContain(
        '<loc>https://app-kanto.gastsar.fr/tononkalo</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/ohabolana/item-1</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/angano/conte-1</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/kabary/kabary-1</loc>',
      );
      expect(xml).toContain(
        '<loc>https://app-kanto.gastsar.fr/tononkalo/poesie-1</loc>',
      );
    });
  });

  describe('getLlmsTxt', () => {
    it('should return GEO markdown content for LLMs without removed category hubs', () => {
      const llms = service.getLlmsTxt();
      expect(llms).toContain(
        '# Kanto MG — Sanctuaire Numérique du Patrimoine & de la Culture Malgache',
      );
      expect(llms).toContain('/pages/about');
      expect(llms).toContain('/pages/terms');
      expect(llms).not.toContain('https://app-kanto.gastsar.fr/ohabolana');
      expect(llms).not.toContain('https://app-kanto.gastsar.fr/angano');
      expect(llms).not.toContain('https://app-kanto.gastsar.fr/kabary');
    });
  });
});
