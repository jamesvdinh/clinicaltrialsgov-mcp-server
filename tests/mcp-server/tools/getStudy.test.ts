/**
 * @fileoverview Tests for the getStudy tool.
 * @module tests/mcp-server/tools/getStudy.test
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetStudyInput, getStudyLogic } from '../../../src/mcp-server/tools/getStudy/logic';
import { ClinicalTrialsGovService, Study } from '../../../src/services/clinical-trials-gov';
import { BaseErrorCode, McpError } from '../../../src/types-global/errors';
import { requestContextService } from '../../../src/utils';

// Mock the ClinicalTrialsGovService
vi.mock('../../../src/services/clinical-trials-gov');

describe('getStudyLogic', () => {
  const mockRequestContext = requestContextService.createRequestContext({ operation: 'test' });
  const mockStudy: Study = {
    protocolSection: {
      identificationModule: {
        nctId: 'NCT12345678',
        officialTitle: 'Test Study',
        orgStudyIdInfo: { id: 'STUDYID' },
        organization: { fullName: 'Test Org', class: 'INDUSTRY' },
        briefTitle: 'Test',
        acronym: 'TS',
      },
      descriptionModule: {
        briefSummary: 'A brief summary.',
        detailedDescription: 'A detailed description.',
      },
      statusModule: {
        overallStatus: 'COMPLETED',
        startDateStruct: { date: '2020-01-01', type: 'ACTUAL' },
        primaryCompletionDateStruct: { date: '2021-01-01', type: 'ACTUAL' },
        completionDateStruct: { date: '2022-01-01', type: 'ACTUAL' },
      },
      conditionsModule: {
        conditions: ['Test Condition'],
        keywords: ['test'],
      },
      armsInterventionsModule: {
        arms: [{ name: 'Arm 1', type: 'EXPERIMENTAL', description: 'Test Arm' }],
        interventions: [{ name: 'Test Intervention', type: 'Drug', armNames: ['Arm 1'], description: 'Test Drug' }],
      },
      sponsorCollaboratorsModule: {
        leadSponsor: { name: 'Test Sponsor', class: 'INDUSTRY' },
        collaborators: [{ name: 'Test Collab', class: 'INDUSTRY' }],
      },
      designModule: {
        studyType: 'INTERVENTIONAL',
        phases: ['PHASE_1'],
        designInfo: {
          allocation: 'RANDOMIZED',
          interventionModel: 'PARALLEL',
          primaryPurpose: 'TREATMENT',
        },
      },
      contactsLocationsModule: {
        locations: [{ city: 'Test City', state: 'TS', country: 'USA' }],
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the getInstance method to return a mock instance
    vi.spyOn(ClinicalTrialsGovService, 'getInstance').mockReturnValue({
      fetchStudy: vi.fn(),
    } as unknown as ClinicalTrialsGovService);
  });

  it('should fetch a single study with full details', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.fetchStudy).mockResolvedValue(mockStudy);

    const input: GetStudyInput = { nctIds: 'NCT12345678' };
    const result = await getStudyLogic(input, mockRequestContext);

    expect(result.studies).toHaveLength(1);
    expect(result.studies[0]).toEqual(mockStudy);
    expect(result.errors).toBeUndefined();
    expect(service.fetchStudy).toHaveBeenCalledWith('NCT12345678', mockRequestContext, {
      fields: undefined,
      markupFormat: 'markdown',
    });
  });

  it('should fetch multiple studies with full details', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.fetchStudy).mockImplementation(async (nctId) => ({
      ...mockStudy,
      protocolSection: {
        ...mockStudy.protocolSection,
        identificationModule: {
          ...mockStudy.protocolSection!.identificationModule,
          nctId,
        },
      },
    }));

    const input: GetStudyInput = { nctIds: ['NCT12345678', 'NCT87654321'] };
    const result = await getStudyLogic(input, mockRequestContext);

    expect(result.studies).toHaveLength(2);
    const study1 = result.studies[0] as Study;
    const study2 = result.studies[1] as Study;
    expect(study1.protocolSection?.identificationModule?.nctId).toBe('NCT12345678');
    expect(study2.protocolSection?.identificationModule?.nctId).toBe('NCT87654321');
    expect(result.errors).toBeUndefined();
  });

  it('should return a summary when summaryOnly is true', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.fetchStudy).mockResolvedValue(mockStudy);

    const input: GetStudyInput = { nctIds: 'NCT12345678', summaryOnly: true };
    const result = await getStudyLogic(input, mockRequestContext);

    expect(result.studies).toHaveLength(1);
    expect(result.studies[0]).toEqual({
      nctId: 'NCT12345678',
      title: 'Test Study',
      briefSummary: 'A brief summary.',
      overallStatus: 'COMPLETED',
      conditions: ['Test Condition'],
      interventions: [{ name: 'Test Intervention', type: 'Drug' }],
      leadSponsor: 'Test Sponsor',
    });
    expect(result.errors).toBeUndefined();
  });

  it('should handle errors for studies that are not found', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    vi.mocked(service.fetchStudy).mockImplementation(async (nctId: string) => {
      if (nctId === 'NCT12345678') {
        return mockStudy;
      }
      // Simulate not found by returning a promise that resolves to null/undefined, cast to Study to bypass strict type checks for the mock.
      return Promise.resolve(null as unknown as Study);
    });

    const input: GetStudyInput = { nctIds: ['NCT12345678', 'NCT00000000'] };
    const result = await getStudyLogic(input, mockRequestContext);

    expect(result.studies).toHaveLength(1);
    expect(result.studies[0]).toEqual(mockStudy);
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].nctId).toBe('NCT00000000');
    expect(result.errors?.[0].error).toContain('not found');
  });
  
  it('should handle API errors gracefully', async () => {
    const service = ClinicalTrialsGovService.getInstance();
    const apiError = new McpError(BaseErrorCode.INTERNAL_ERROR, 'API is down');
    vi.mocked(service.fetchStudy).mockRejectedValue(apiError);

    const input: GetStudyInput = { nctIds: 'NCT12345678' };
    const result = await getStudyLogic(input, mockRequestContext);

    expect(result.studies).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].nctId).toBe('NCT12345678');
    expect(result.errors?.[0].error).toBe('API is down');
  });
});
