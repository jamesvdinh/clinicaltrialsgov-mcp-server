/**
 * @fileoverview Service for interacting with the ClinicalTrials.gov API.
 * This module provides a singleton class `ClinicalTrialsGovService` that encapsulates
 * all network requests to the ClinicalTrials.gov API, handles response validation,
 * and implements backing up of API responses to the local filesystem.
 * @module src/services/clinical-trials-gov/ClinicalTrialsGovService
 */

import { writeFileSync } from "fs";
import path from "path";
import { config } from "../../config/index.js";
import { BaseErrorCode, McpError } from "../../types-global/errors.js";
import { logger, type RequestContext } from "../../utils/index.js";
import { fetchWithTimeout } from "../../utils/network/fetchWithTimeout.js";
import type { FieldNode, PagedStudies, Study } from "./types.js";

const BASE_URL = "https://clinicaltrials.gov/api/v2";

/**
 * A service class to interact with the ClinicalTrials.gov API.
 * It handles request construction, API communication, and response backup.
 */
export class ClinicalTrialsGovService {
  /**
   * Fetches a single study by its NCT ID.
   * @param nctId - The NCT ID of the study.
   * @param context - The request context for logging.
   * @returns A promise that resolves with the study data.
   */
  public async fetchStudy(
    nctId: string,
    context: RequestContext,
  ): Promise<Study> {
    const url = `${BASE_URL}/studies/${nctId}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `study_${nctId}_${timestamp}.json`;
    return this.fetchAndBackup<Study>(url, fileName, context);
  }

  /**
   * Searches for studies based on a set of query parameters.
   * @param params - The query parameters for the search.
   * @param context - The request context for logging.
   * @returns A promise that resolves with a paged list of studies.
   */
  public async listStudies(
    params: Record<string, any>,
    context: RequestContext,
  ): Promise<PagedStudies> {
    const queryParams = new URLSearchParams();

    if (params.query) {
      for (const [key, value] of Object.entries(params.query)) {
        if (value) {
          queryParams.set(`query.${key}`, String(value));
        }
      }
    }

    if (params.filter) {
      for (const [key, value] of Object.entries(params.filter)) {
        if (value) {
          if (Array.isArray(value)) {
            queryParams.set(`filter.${key}`, value.join(","));
          } else {
            queryParams.set(`filter.${key}`, String(value));
          }
        }
      }
    }

    if (params.fields) {
      queryParams.set("fields", params.fields.join(","));
    }
    if (params.sort) {
      queryParams.set("sort", params.sort.join(","));
    }
    if (params.pageSize) {
      queryParams.set("pageSize", String(params.pageSize));
    }
    if (params.pageToken) {
      queryParams.set("pageToken", params.pageToken);
    }
    if (params.countTotal) {
      queryParams.set("countTotal", "true");
    }

    const url = `${BASE_URL}/studies?${queryParams.toString()}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `studies_${timestamp}.json`;

    return this.fetchAndBackup<PagedStudies>(url, fileName, context);
  }

  /**
   * Fetches the study metadata.
   * @param params - Parameters for filtering metadata.
   * @param context - The request context for logging.
   * @returns A promise that resolves with the field node data.
   */
  public async getStudyMetadata(
    params: { includeIndexedOnly?: boolean; includeHistoricOnly?: boolean },
    context: RequestContext,
  ): Promise<FieldNode[]> {
    const queryParams = new URLSearchParams();
    if (params.includeIndexedOnly)
      queryParams.set("includeIndexedOnly", "true");
    if (params.includeHistoricOnly)
      queryParams.set("includeHistoricOnly", "true");

    const url = `${BASE_URL}/studies/metadata?${queryParams.toString()}`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `metadata_${timestamp}.json`;
    return this.fetchAndBackup<FieldNode[]>(url, fileName, context);
  }

  /**
   * Fetches API statistics.
   * @param statType - The type of statistics to retrieve.
   * @param params - Additional parameters for the statistics request.
   * @param context - The request context for logging.
   * @returns A promise that resolves with the statistical data.
   */
  public async getApiStats(
    statType: "studySize" | "fieldValues" | "listFieldSizes",
    params: { fields?: string[]; types?: string[] },
    context: RequestContext,
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.fields) {
      queryParams.set("fields", params.fields.join(","));
    }
    if (params.types) {
      queryParams.set("types", params.types.join(","));
    }

    let endpoint: string;
    switch (statType) {
      case "studySize":
        endpoint = "size";
        break;
      case "fieldValues":
        endpoint = "field/values";
        break;
      case "listFieldSizes":
        endpoint = "list/sizes";
        break;
      default:
        throw new McpError(
          BaseErrorCode.INVALID_INPUT,
          `Invalid statType: ${statType}`,
        );
    }

    let url = `${BASE_URL}/stats/${endpoint}`;
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `stats_${statType}_${timestamp}.json`;
    return this.fetchAndBackup<any>(url, fileName, context);
  }

  /**
   * A generic fetch method that handles backing up the response.
   * It always fetches live data and writes it to a backup file if the data path is configured.
   * @param url - The URL to fetch.
   * @param fileName - The file name to use for the backup.
   * @param context - The request context for logging.
   * @returns A promise that resolves with the fetched data.
   */
  private async fetchAndBackup<T>(
    url: string,
    fileName: string,
    context: RequestContext,
  ): Promise<T> {
    logger.debug(`[API] Fetching from ${url}`, context);
    const fetchOptions = {
      headers: { Accept: "application/json" },
    };
    logger.debug(
      `[API] Fetch options: ${JSON.stringify(fetchOptions)}`,
      context,
    );

    const response = await fetchWithTimeout(
      url,
      15000, // 15-second timeout for potentially complex queries
      context,
      fetchOptions,
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`[API] Error response body: ${errorBody}`, context);
      const message =
        response.status === 404
          ? `Study not found. ${errorBody}`
          : `API request failed with status ${response.status}: ${response.statusText}`;
      throw new McpError(BaseErrorCode.SERVICE_UNAVAILABLE, message, {
        url,
        status: response.status,
        body: errorBody,
      });
    }

    const data = (await response.json()) as T;

    if (config.clinicalTrialsDataPath) {
      const filePath = path.join(config.clinicalTrialsDataPath, fileName);
      try {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.debug(`[Backup] Wrote to ${filePath}`, context);
      } catch (error) {
        logger.error(`Failed to write backup file: ${filePath}`, {
          ...context,
          error,
        });
      }
    } else {
      logger.debug(
        "[Backup] Skipping backup because data path is not configured.",
        context,
      );
    }

    return data;
  }
}
