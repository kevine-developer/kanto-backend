import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SeoService } from './seo.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

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

    service = new SeoService(mockPrisma as unknown as PrismaService);
  });

  describe('getRobotsTxt', () => {
    it('should generate valid robots.txt allowing search engines on portal domain', () => {
      const robots = service.getRobotsTxt('app-kanto.gastsar.fr');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Allow: /');
      expect(robots).toContain('Disallow: /api/');
      expect(robots).toContain('Disallow: /admin/');
      expect(robots).toContain('Sitemap: https://app-kanto.gastsar.fr/sitemap.xml');
    });

    it('should disallow everything on admin subdomains or staging', () => {
      const robots = service.getRobotsTxt('admin.kanto.mg');
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Disallow: /');
      expect(robots).not.toContain('Allow: /');
    });
  });

  describe('getSitemapXml', () => {
    it('should generate a valid XML sitemap with static and dynamic cultural URLs', async () => {
      const xml = await service.getSitemapXml('https://app-kanto.gastsar.fr');
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/ohabolana</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/angano</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/kabary</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/tononkalo</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/ohabolana/item-1</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/angano/conte-1</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/kabary/kabary-1</loc>');
      expect(xml).toContain('<loc>https://app-kanto.gastsar.fr/tononkalo/poesie-1</loc>');
    });
  });

  describe('getLlmsTxt', () => {
    it('should return GEO markdown content for LLMs', () => {
      const llms = service.getLlmsTxt();
      expect(llms).toContain('# Kanto MG — Sanctuaire Numérique du Patrimoine & de la Culture Malgache');
      expect(llms).toContain('## Corpus Culturel Indexé');
      expect(llms).toContain('/ohabolana');
      expect(llms).toContain('/angano');
      expect(llms).toContain('/kabary');
    });
  });

  describe('getHubData', () => {
    it('should return hub metadata and items for valid category', async () => {
      const hubData = await service.getHubData('ohabolana');
      expect(hubData).toBeDefined();
      expect(hubData?.config.metaTitle).toContain('Ohabolana Malagasy');
      expect(hubData?.items.length).toBe(1);
      expect(hubData?.items[0].title).toBe('Ny fihavanana toy ny volon-tsira');
    });

    it('should return null for unknown category', async () => {
      const hubData = await service.getHubData('inconnue');
      expect(hubData).toBeNull();
    });
  });
});
