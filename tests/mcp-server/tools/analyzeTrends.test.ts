/**
 * @fileoverview Tests for the analyzeTrends tool.
 * @module tests/mcp-server/tools/analyzeTrends.test
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { analyzeTrendsLogic, AnalyzeTrendsInput } from '../../../src/mcp-server/tools/analyzeTrends/logic';
import { ClinicalTrialsGovService, Study } from '../../../src/services/clinical-trials-gov';
import { requestContextService } from '../../../src/utils';
import { McpError, BaseErrorCode } from '../../../src/types-global/errors';

// Mock the ClinicalTrialsGovService
vi.mock('../../../src/services/clinical-trials-gov');

const mockStudies: Study[] = [
  {
    protocolSection: {
      statusModule: { overallStatus: 'COMPLETED' },
      contactsLocationsModule: { locations: [{ country: 'USA' }] },
      sponsorCollaboratorsModule: { leadSponsor: { class: 'INDUSTRY', name: 'Sponsor' } },
      designModule: { phases: ['PHASE_3'] },
    },
  },
  {
    protocolSection: {
      statusModule: { overallStatus: 'RECRUITING' },
      contactsLocationsModule: { locations: [{ country: 'USA' }, { country: 'Canada' }] },
      sponsorCollaboratorsModule: { leadSponsor: { class: 'INDUSTRY', name: 'Sponsor' } },
      designModule: { phases: ['PHASE_2'] },
    },
  },
  {
    protocolSection: {
      statusModule: { overallStatus: 'COMPLETED' },
      contactsLocationsModule: { locations: [{ country: 'Canada' }] },
      sponsorCollaboratorsModule: { leadSponsor: { class: 'NIH', name: 'Sponsor' } },
      designModule: { phases: ['PHASE_3'] },
    },
  },
];

describe('analyzeTrendsLogic', () => {
  const mockRequestContext = requestContextService.createRequestContext({ operation: 'test' });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ClinicalTrialsGovService, 'getInstance').mockReturnValue({
      listStudies: vi.fn(),
    } as unknown as ClinicalTrialsGovService);
  });

  it('should perform a single analysis (countByStatus)', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue({ studies: mockStudies, totalCount: 3 });

    const input: AnalyzeTrendsInput = { analysisType: 'countByStatus' };
    const result = await analyzeTrendsLogic(input, mockRequestContext);

    expect(result.analysis).toHaveLength(1);
    expect(result.analysis[0].analysisType).toBe('countByStatus');
    expect(result.analysis[0].totalStudies).toBe(3);
    expect(result.analysis[0].results).toEqual({
      COMPLETED: 2,
      RECRUITING: 1,
    });
  });

  it('should perform multiple analyses', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue({ studies: mockStudies, totalCount: 3 });

    const input: AnalyzeTrendsInput = { analysisType: ['countByCountry', 'countBySponsorType'] };
    const result = await analyzeTrendsLogic(input, mockRequestContext);

    expect(result.analysis).toHaveLength(2);
    
    const countryAnalysis = result.analysis.find(a => a.analysisType === 'countByCountry');
    expect(countryAnalysis).toBeDefined();
    expect(countryAnalysis?.results).toEqual({ USA: 2, Canada: 2 });

    const sponsorAnalysis = result.analysis.find(a => a.analysisType === 'countBySponsorType');
    expect(sponsorAnalysis).toBeDefined();
    expect(sponsorAnalysis?.results).toEqual({ INDUSTRY: 2, NIH: 1 });
  });

  it('should throw an error if the number of studies exceeds the limit', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies).mockResolvedValue({ studies: [], totalCount: 9999 });

    const input: AnalyzeTrendsInput = { analysisType: 'countByStatus' };
    
    await expect(analyzeTrendsLogic(input, mockRequestContext)).rejects.toThrow(
      new McpError(
        BaseErrorCode.INVALID_INPUT,
        'The query returned 9999 studies, which exceeds the limit of 5000 for analysis. Please provide a more specific query.',
        { totalStudies: 9999, limit: 5000 }
      )
    );
  });

  it('should handle fetching studies with pagination', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.listStudies)
      .mockResolvedValueOnce({ studies: [], totalCount: 3 }) // Initial call for total
      .mockResolvedValueOnce({ studies: [mockStudies[0]], nextPageToken: 'token1', totalCount: 3 })
      .mockResolvedValueOnce({ studies: [mockStudies[1]], nextPageToken: 'token2', totalCount: 3 })
      .mockResolvedValueOnce({ studies: [mockStudies[2]], totalCount: 3 });

    const input: AnalyzeTrendsInput = { analysisType: 'countByStatus' };
    await analyzeTrendsLogic(input, mockRequestContext);

    expect(service.listStudies).toHaveBeenCalledTimes(4); // 1 for total, 3 for pages
  });
});
