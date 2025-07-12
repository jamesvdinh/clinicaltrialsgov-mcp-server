/**
 * @fileoverview Provides functions for cleaning and simplifying JSON responses
 * from the ClinicalTrials.gov API.
 * @module src/utils/clinicaltrials/jsonCleaner
 */

import { Study } from "../../services/clinical-trials-gov/types.js";

/**
 * Removes duplicate and redundant information from the browse modules
 * of a clinical study object.
 * @param study - The study object to clean.
 * @returns A new study object with cleaned browse modules.
 */
interface BrowseLeaf {
  term?: string;
  name?: string;
  relevance?: string;
}

interface BrowseModule {
  browseLeaves?: BrowseLeaf[];
  ancestors?: { term?: string }[];
}

function cleanBrowseModules(study: Study): Study {
  const cleanedStudy = JSON.parse(JSON.stringify(study));

  const cleanModule = (module: BrowseModule | undefined) => {
    if (module && module.browseLeaves && module.ancestors) {
      const leafTerms = new Set<string>();
      module.browseLeaves.forEach((leaf: BrowseLeaf) => {
        if (leaf.term) leafTerms.add(leaf.term);
        if (leaf.name) leafTerms.add(leaf.name);
      });

      module.ancestors = module.ancestors.filter(
        (ancestor) => ancestor.term && !leafTerms.has(ancestor.term),
      );
    }
  };

  cleanModule(cleanedStudy.derivedSection?.conditionBrowseModule);
  cleanModule(cleanedStudy.derivedSection?.interventionBrowseModule);

  return cleanedStudy;
}

/**
 * Filters browse leaves to only include those with high relevance.
 * @param study - The study object to clean.
 * @returns A new study object with filtered browse leaves.
 */
function filterBrowseLeavesByRelevance(study: Study): Study {
  const cleanedStudy = JSON.parse(JSON.stringify(study));

  const filterModule = (module: BrowseModule | undefined) => {
    if (module && module.browseLeaves) {
      module.browseLeaves = module.browseLeaves.filter(
        (leaf) => leaf.relevance !== "LOW",
      );
    }
  };

  filterModule(cleanedStudy.derivedSection?.conditionBrowseModule);
  filterModule(cleanedStudy.derivedSection?.interventionBrowseModule);

  return cleanedStudy;
}

/**
 * Cleans a single study object by applying all available cleaning functions.
 * @param study - The study object to clean.
 * @returns A cleaned study object.
 */
export function cleanStudy(study: Study): Study {
  let cleanedStudy = study;
  cleanedStudy = cleanBrowseModules(cleanedStudy);
  cleanedStudy = filterBrowseLeavesByRelevance(cleanedStudy);
  // Add other cleaning functions here as needed
  return cleanedStudy;
}
