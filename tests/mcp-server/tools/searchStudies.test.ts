/**
 * @fileoverview Tests for the searchStudies tool.
 * @module tests/mcp-server/tools/searchStudies.test
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { searchStudiesLogic, SearchStudiesInput } from '../../../src/mcp-server/tools/searchStudies/logic';
import { ClinicalTrialsGovService } from '../../../src/services/clinical-trials-gov';
import { requestContextService } from '../../../src/utils';
import { PagedStudies } from '../../../src/services/clinical-trials-gov/types';

// Mock the ClinicalTrialsGovService
vi.mock('../../../src/services/clinical-trials-gov');

describe('searchStudiesLogic', () => {
  const mockRequestContext = requestContextService.createRequestContext({ operation: 'test' });
  const mockPagedStudies: PagedStudies = {
    studies: [],
    nextPageToken: 'token123',
    totalCount: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ClinicalTrialsGovService, 'getInstance').mockReturnValue({
      listStudies: vi.fn(),
    } as unknown as ClinicalTrialsGovService);
  });

  it('should call listStudies with the correct parameters', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue(mockPagedStudies);

    const input: SearchStudiesInput = {
      query: { cond: 'cancer' },
      pageSize: 50,
    };

    await searchStudiesLogic(input, mockRequestContext);

    expect(service.listStudies).toHaveBeenCalledWith(
      {
        query: { cond: 'cancer' },
        pageSize: 50,
        countTotal: true,
        fields: undefined,
        filter: undefined,
        pageToken: undefined,
        sort: undefined,
      },
      mockRequestContext,
    );
  });

  it('should transform the geo filter correctly', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue(mockPagedStudies);

    const input: SearchStudiesInput = {
      filter: {
        geo: {
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 10,
          unit: 'mi',
        },
      },
    };

    await searchStudiesLogic(input, mockRequestContext);

    expect(service.listStudies).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: {
          geo: 'distance(40.7128,-74.006,10mi)',
        },
      }),
      mockRequestContext,
    );
  });

  it('should return the paged studies result', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue(mockPagedStudies);

    const input: SearchStudiesInput = { query: { term: 'diabetes' } };
    const result = await searchStudiesLogic(input, mockRequestContext);

    expect(result).toEqual(mockPagedStudies);
  });
});
