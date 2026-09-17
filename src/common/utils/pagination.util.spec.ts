import {
  calculatePagination,
  createPaginationMeta,
  formatPaginatedResponse,
} from './pagination.util.js';

describe('pagination.util', () => {
  // ─────────────────────────────────────────────────────────────────────────
  // calculatePagination
  // ─────────────────────────────────────────────────────────────────────────

  describe('calculatePagination', () => {
    it('should return defaults when called with no params', () => {
      const result = calculatePagination();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should return defaults when called with empty object', () => {
      const result = calculatePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(0);
    });

    it('should calculate skip correctly for page 2', () => {
      const result = calculatePagination({ page: 2, limit: 10 });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(10);
    });

    it('should calculate skip correctly for page 3 with limit 20', () => {
      const result = calculatePagination({ page: 3, limit: 20 });
      expect(result.skip).toBe(40);
    });

    it('should clamp page to minimum 1 when page is 0', () => {
      const result = calculatePagination({ page: 0 });
      expect(result.page).toBe(1);
      expect(result.skip).toBe(0);
    });

    it('should clamp page to minimum 1 when page is negative', () => {
      const result = calculatePagination({ page: -5 });
      expect(result.page).toBe(1);
    });

    it('should clamp limit to maximum 100 (MAX_LIMIT)', () => {
      const result = calculatePagination({ limit: 200 });
      expect(result.limit).toBe(100);
    });

    it('should use default limit when limit is 0 (0 is falsy → treated as not provided)', () => {
      // Comportement documenté : 0 est falsy → Number(0) || DEFAULT_LIMIT = DEFAULT_LIMIT
      // Cela évite qu'un client envoie limit=0 et reçoive 0 résultats par page.
      const result = calculatePagination({ limit: 0 });
      expect(result.limit).toBe(20); // DEFAULT_LIMIT
    });

    it('should clamp negative limit to 1', () => {
      const result = calculatePagination({ limit: -10 });
      expect(result.limit).toBe(1);
    });

    it('should accept MAX_LIMIT exactly (100)', () => {
      const result = calculatePagination({ limit: 100 });
      expect(result.limit).toBe(100);
    });

    it('should accept string values for page and limit (NestJS query params)', () => {
      const result = calculatePagination({
        page: '3',
        limit: '15',
      });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(15);
      expect(result.skip).toBe(30);
    });

    it('should fall back to defaults when page is NaN string', () => {
      const result = calculatePagination({ page: 'abc' });
      expect(result.page).toBe(1);
    });

    it('should fall back to defaults when limit is NaN string', () => {
      const result = calculatePagination({ limit: 'xyz' });
      expect(result.limit).toBe(20);
    });

    it('should handle very large page numbers without overflow', () => {
      const result = calculatePagination({ page: 99999, limit: 10 });
      expect(result.skip).toBe(999980);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // createPaginationMeta
  // ─────────────────────────────────────────────────────────────────────────

  describe('createPaginationMeta', () => {
    it('should calculate totalPages correctly', () => {
      const meta = createPaginationMeta(100, 1, 20);
      expect(meta.totalPages).toBe(5);
    });

    it('should round up totalPages (ceiling division)', () => {
      const meta = createPaginationMeta(21, 1, 20);
      expect(meta.totalPages).toBe(2);
    });

    it('should return totalPages = 1 when total is 0', () => {
      const meta = createPaginationMeta(0, 1, 20);
      expect(meta.totalPages).toBe(1);
    });

    it('should return totalPages = 1 when total equals limit exactly', () => {
      const meta = createPaginationMeta(20, 1, 20);
      expect(meta.totalPages).toBe(1);
    });

    it('should expose total, page, limit correctly', () => {
      const meta = createPaginationMeta(55, 3, 10);
      expect(meta.total).toBe(55);
      expect(meta.page).toBe(3);
      expect(meta.limit).toBe(10);
      expect(meta.totalPages).toBe(6);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // formatPaginatedResponse
  // ─────────────────────────────────────────────────────────────────────────

  describe('formatPaginatedResponse', () => {
    it('should wrap data with meta object', () => {
      const data = [{ id: '1' }, { id: '2' }];
      const result = formatPaginatedResponse(data, 50, 1, 20);
      expect(result.data).toBe(data);
      expect(result.meta).toBeDefined();
      expect(result.meta.total).toBe(50);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.meta.totalPages).toBe(3);
    });

    it('should handle empty data array', () => {
      const result = formatPaginatedResponse([], 0, 1, 20);
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should preserve data reference (no deep clone)', () => {
      const data = [{ id: 'abc' }];
      const result = formatPaginatedResponse(data, 1, 1, 10);
      expect(result.data).toBe(data);
    });
  });
});
