/**
 * @fileoverview Provides functions for cleaning and simplifying JSON responses
 * from the ClinicalTrials.gov API.
 * @module src/utils/clinicaltrials/jsonCleaner
 */

import { Study, StudySchema } from "../../services/clinical-trials-gov/types.js";
import { logger } from "../internal/logger.js";

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
 * Ensures that the `armNames` property in each intervention is an array.
 * This handles cases where the API might return a null or undefined value.
 * @param study - The study object to clean.
 * @returns A new study object with `armNames` guaranteed to be an array.
 */
function ensureArmNamesArray(study: Study): Study {
  const cleanedStudy = JSON.parse(JSON.stringify(study));

  const interventions =
    cleanedStudy.protocolSection?.armsInterventionsModule?.interventions;
  if (interventions) {
    interventions.forEach(
      (intervention: {
        type: string;
        name: string;
        description: string;
        armNames: string[];
      }) => {
        if (!intervention.armNames) {
          intervention.armNames = [];
        }
      },
    );
  }

  return cleanedStudy;
}

/**
 * Cleans a single study object by applying all available cleaning functions.
 * @param study - The study object to clean.
 * @returns A cleaned study object.
 */
export function cleanStudy(study: Study): Study {
  const result = StudySchema.safeParse(study);
  if (!result.success) {
    const rawKeys = new Set(Object.keys(study));
    const schemaKeys = new Set(Object.keys(StudySchema.shape));
    const extraKeys = [...rawKeys].filter((key) => !schemaKeys.has(key));
    if (extraKeys.length > 0) {
      logger.warning(`Stripped extra keys from study: ${extraKeys.join(", ")}`);
    }
  }

  let cleanedStudy = study;
  cleanedStudy = cleanBrowseModules(cleanedStudy);
  cleanedStudy = filterBrowseLeavesByRelevance(cleanedStudy);
  cleanedStudy = ensureArmNamesArray(cleanedStudy);
  // Add other cleaning functions here as needed
  return cleanedStudy;
}
