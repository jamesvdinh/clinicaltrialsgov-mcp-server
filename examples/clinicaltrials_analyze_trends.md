# Example: Analyzing Clinical Trial Trends

This example demonstrates how to use the `clinicaltrials_analyze_trends` tool to get an aggregated overview of clinical studies.

## Tool Call

The following tool call searches for studies related to "psilocybin" and "depression" and requests an analysis of the results by status, country, and sponsor type.

```json
{
  "query": {
    "cond": "depression",
    "term": "psilocybin"
  },
  "analysisType": ["countByStatus", "countByCountry", "countBySponsorType"]
}
```

## Tool Response

```markdown
Successfully analyzed 88 studies for trend 'countByStatus'.

Analysis Results:

- RECRUITING: 34
- ACTIVE_NOT_RECRUITING: 8
- WITHDRAWN: 7
- COMPLETED: 22
- NOT_YET_RECRUITING: 11
- UNKNOWN: 5
- TERMINATED: 1

---

Successfully analyzed 88 studies for trend 'countByCountry'.

Analysis Results:

- Canada: 27
- United States: 244
- Czechia: 9
- Ireland: 5
- Netherlands: 7
- United Kingdom: 25
- Switzerland: 4
- Germany: 6
- Denmark: 2
- France: 6
- Poland: 5
- Spain: 8
- Sweden: 9
- Jamaica: 1
- Pakistan: 1
- Portugal: 1
- Brazil: 1
- Belgium: 1
- New Zealand: 1

---

Successfully analyzed 88 studies for trend 'countBySponsorType'.

Analysis Results:

- OTHER: 73
- INDUSTRY: 13
- NETWORK: 2
```
