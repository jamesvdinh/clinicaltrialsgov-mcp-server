/**
 * @fileoverview Defines the TypeScript types for the ClinicalTrials.gov API.
 * These types are based on the API's OpenAPI specification and are used
 * throughout the server for type safety and data consistency.
 * @module src/services/clinical-trials-gov/types
 */

/**
 * Represents a single clinical study.
 * This is a placeholder and will be expanded as the tool is implemented.
 */
export interface Study {
  protocolSection: {
    identificationModule: {
      nctId: string;
      orgStudyIdInfo: {
        id: string;
      };
      organization: {
        fullName: string;
        class: string;
      };
      briefTitle: string;
      officialTitle: string;
      acronym: string;
    };
  };
}

/**
 * Represents a paged list of studies.
 */
export interface PagedStudies {
  studies: Study[];
  nextPageToken?: string;
  totalCount?: number;
}

/**
 * Represents a node in the study data model tree.
 */
export interface FieldNode {
  name: string;
  type: string;
  description: string;
  children?: FieldNode[];
}

/**
 * Represents the possible status values for a study.
 */
export enum Status {
  ActiveNotRecruiting = "ACTIVE_NOT_RECRUITING",
  Completed = "COMPLETED",
  EnrollingByInvitation = "ENROLLING_BY_INVITATION",
  NotYetRecruiting = "NOT_YET_RECRUITING",
  Recruiting = "RECRUITING",
  Suspended = "SUSPENDED",
  Terminated = "TERMINATED",
  Withdrawn = "WITHDRAWN",
  Unknown = "UNKNOWN",
}
