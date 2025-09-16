#!/usr/bin/env node

import { ClinicalTrialsGovService } from './dist/services/clinical-trials-gov/index.js';

async function searchBreastCancerTrials() {
  try {
    const service = ClinicalTrialsGovService.getInstance();
    
    // Create a mock request context
    const context = {
      requestId: 'search-breast-cancer-' + Date.now(),
      timestamp: new Date().toISOString(),
      toolName: 'search_breast_cancer_script'
    };

    // Search parameters for recruiting Phase 2 breast cancer trials
    const searchParams = {
      query: {
        cond: "breast cancer"
      },
      filter: {
        overallStatus: ["RECRUITING"],
        // Note: Phase filtering would need to be done in the advanced filter
        // as the API doesn't have a direct phase filter
        advanced: "AREA[Phase]PHASE2"
      },
      pageSize: 20,
      countTotal: true
    };

    console.log('Searching for recruiting Phase 2 breast cancer trials...');
    console.log('Search parameters:', JSON.stringify(searchParams, null, 2));
    
    const result = await service.listStudies(searchParams, context);
    
    console.log(`\nFound ${result.totalCount || 0} total studies`);
    console.log(`Retrieved ${result.studies?.length || 0} studies in this page\n`);
    
    if (result.studies && result.studies.length > 0) {
      result.studies.forEach((study, index) => {
        const idModule = study.protocolSection?.identificationModule;
        const statusModule = study.protocolSection?.statusModule;
        const descriptionModule = study.protocolSection?.descriptionModule;
        const designModule = study.protocolSection?.designModule;
        const eligibilityModule = study.protocolSection?.eligibilityModule;
        const contactsLocationsModule = study.protocolSection?.contactsLocationsModule;
        const interventionsModule = study.protocolSection?.armsInterventionsModule;
        const sponsorModule = study.protocolSection?.sponsorCollaboratorsModule;

        const interventions = interventionsModule?.interventions
          ?.map((i) => i.name)
          .join(", ") ?? "N/A";

        const locations = [
          ...new Set(
            contactsLocationsModule?.locations
              ?.map((l) => l.country)
              .filter((c) => c) ?? [],
          ),
        ].join(", ") || "N/A";

        const phases = designModule?.phases?.join(", ") || "N/A";

        console.log(`${index + 1}. **NCT ID:** ${idModule?.nctId ?? "N/A"}`);
        console.log(`   **Title:** ${idModule?.briefTitle ?? idModule?.officialTitle ?? "N/A"}`);
        console.log(`   **Status:** ${statusModule?.overallStatus ?? "N/A"}`);
        console.log(`   **Study Type:** ${designModule?.studyType ?? "N/A"}`);
        console.log(`   **Phases:** ${phases}`);
        console.log(`   **Eligibility:** ${eligibilityModule?.sex ?? "ALL"}, ${eligibilityModule?.minimumAge ?? "N/A"}`);
        console.log(`   **Locations:** ${locations}`);
        console.log(`   **Summary:** ${descriptionModule?.briefSummary ?? "N/A"}`);
        console.log(`   **Interventions:** ${interventions}`);
        console.log(`   **Sponsor:** ${sponsorModule?.leadSponsor?.name ?? "N/A"}`);
        console.log('');
      });
    } else {
      console.log('No studies found matching the criteria.');
    }

  } catch (error) {
    console.error('Error searching for trials:', error);
  }
}

searchBreastCancerTrials();