# Example: Retrieving a Specific Clinical Study

This example demonstrates how to use the `clinicaltrials_get_study` tool to fetch detailed information for a single clinical trial using its NCT ID.

## Tool Call

The following tool call retrieves the full study data for trial `NCT06341426`.

```json
{
  "nctIds": "NCT06341426"
}
```

## Tool Response

```json
{
  "studies": [
    {
      "protocolSection": {
        "identificationModule": {
          "nctId": "NCT06341426",
          "orgStudyIdInfo": {
            "id": "23-5872"
          },
          "organization": {
            "fullName": "University Health Network, Toronto",
            "class": "OTHER"
          },
          "briefTitle": "Psilocybin-Assisted Psychotherapy for Treatment-Resistant Depression: Comparing One Versus Two Doses of Psilocybin",
          "officialTitle": "Psilocybin-Assisted Psychotherapy for Treatment-Resistant Depression: A Randomized Phase II Clinical Trial Comparing One Versus Two Psychedelic Doses of Psilocybin (PSI-1V2)",
          "acronym": "PSI-1V2"
        },
        "statusModule": {
          "statusVerifiedDate": "2024-04",
          "overallStatus": "RECRUITING",
          "expandedAccessInfo": {
            "hasExpandedAccess": false
          },
          "startDateStruct": {
            "date": "2024-02-05",
            "type": "ACTUAL"
          },
          "primaryCompletionDateStruct": {
            "date": "2028-02-01",
            "type": "ESTIMATED"
          },
          "completionDateStruct": {
            "date": "2028-08-01",
            "type": "ESTIMATED"
          },
          "studyFirstSubmitDate": "2024-03-04",
          "studyFirstSubmitQcDate": "2024-04-01",
          "studyFirstPostDateStruct": {
            "date": "2024-04-02",
            "type": "ACTUAL"
          },
          "lastUpdateSubmitDate": "2024-04-01",
          "lastUpdatePostDateStruct": {
            "date": "2024-04-02",
            "type": "ACTUAL"
          }
        },
        "sponsorCollaboratorsModule": {
          "responsibleParty": {
            "type": "PRINCIPAL_INVESTIGATOR",
            "investigatorFullName": "Joshua Rosenblat",
            "investigatorTitle": "Staff Psychiatrist, Assistant Professor, Clinician-Investigator",
            "investigatorAffiliation": "University Health Network, Toronto"
          },
          "leadSponsor": {
            "name": "University Health Network, Toronto",
            "class": "OTHER"
          },
          "collaborators": [
            {
              "name": "Centre for Addiction and Mental Health",
              "class": "OTHER"
            }
          ]
        },
        "oversightModule": {
          "oversightHasDmc": true,
          "isFdaRegulatedDrug": false,
          "isFdaRegulatedDevice": false,
          "isUsExport": false
        },
        "descriptionModule": {
          "briefSummary": "The purpose of this study is to see if one or two doses of psilocybin is more effective in relieving depressive symptoms in patients with treatment-resistant depression (TRD). Researchers also want to know if a second dose of psilocybin is safe and well-tolerated. This study will see if psilocybin is effective, safe, and well-tolerated by tracking changes in depressive symptoms, suicidality, and side effects. This study will also see if a second dose of psilocybin has an effect on quality of life, functioning, cognition (thinking, reasoning, remembering), and how long depressive symptoms improve (or worsen) after psilocybin is administered.",
          "detailedDescription": "During the past decade, there has been increased interest in the use of psilocybin as a novel treatment for mental health disorders, including treatment-resistant depression (TRD). Recent studies have suggested that psilocybin has the potential to relieve depressive symptoms when combined with psychotherapy (i.e., psilocybin-assisted psychotherapy \\[PAP\\]). Each psilocybin dosing session requires the use of extensive resources, including two specialized therapists supporting the patient for 6-8 hours per dosing session. If two doses of psilocybin prove to be more effective than a single dose of psilocybin in relieving depressive symptoms, then two doses should be the standard intervention for future trials and clinical application. However, if a second dose of psilocybin does not offer increased anti-depressant benefit from the first dose, then a second dose of psilocybin would only increase the risk of adverse side effects and cost of treatment. Therefore, the purpose of this study is to determine whether a second dose of psilocybin provides better efficacy, safety and tolerability than a single dose. The investigators hypothesize that two doses of psilocybin will be more beneficial compared to a single dose, and that there will be no significant difference between the groups (one dose versus two doses) in safety or tolerability.\n\nThe primary objective of assessing antidepressant efficacy will be evaluated by the change in the Montgomery-Åsberg Depression Rating Scale (MADRS) between baseline and Week 8. Safety and tolerability will be assessed using standardized adverse effects monitoring, in addition to close participant monitoring during the dosing day (e.g., blood pressure changes, dissociative and psychotomimetic effects, treatment-emergent manic symptoms, and suicidality). Secondary objectives include evaluating the effects of one versus two psilocybin doses on suicidality, quality of life, functioning, cognition, and duration of clinical benefits during the six month observational follow-up period. Exploratory objectives include evaluating predictors of response, such as static and dynamic clinical factors and expectancy effects, and cost-effectiveness of one versus two psilocybin doses."
        },
        "conditionsModule": {
          "conditions": [
            "Major Depressive Disorder",
            "Depression",
            "Treatment-Resistant Depression",
            "Mood Disorders"
          ],
          "keywords": [
            "Depression",
            "Major Depressive Disorder",
            "Treatment-Resistant Depression",
            "Mood Disorders",
            "Psilocybin",
            "Psychedelics",
            "Psychotherapy",
            "Psilocin",
            "Mental Disorders",
            "Hallucinogen",
            "Antidepressant",
            "Phase 2",
            "Phase II"
          ]
        },
        "designModule": {
          "studyType": "INTERVENTIONAL",
          "phases": ["PHASE2"],
          "designInfo": {
            "allocation": "RANDOMIZED",
            "interventionModel": "PARALLEL",
            "interventionModelDescription": "Participants will be randomized to two groups for the first dosing session in a 1:1 allocation: 1) non-psychedelic/placebo dose (psilocybin 1mg) or 2) psychedelic dose (psilocybin 25mg). All participants will receive a psychedelic dose (psilocybin 25mg) for their second dosing session.",
            "primaryPurpose": "TREATMENT",
            "maskingInfo": {
              "masking": "QUADRUPLE",
              "maskingDescription": "The first dose will be randomized and blinded (1mg psilocybin versus 25mg psilocybin), while the second dose will be open-label (25mg psilocybin).",
              "whoMasked": [
                "PARTICIPANT",
                "CARE_PROVIDER",
                "INVESTIGATOR",
                "OUTCOMES_ASSESSOR"
              ]
            }
          },
          "enrollmentInfo": {
            "count": 92,
            "type": "ESTIMATED"
          }
        },
        "armsInterventionsModule": {
          "armGroups": [
            {
              "label": "Two Doses of Psilocybin",
              "type": "ACTIVE_COMPARATOR",
              "description": "Two psychedelic doses (25mg of psilocybin + 25mg of psilocybin) taken in conjunction with psilocybin-assisted psychotherapy",
              "interventionNames": ["Drug: Two Psychedelic Doses Psilocybin"]
            },
            {
              "label": "Single Dose of Psilocybin",
              "type": "PLACEBO_COMPARATOR",
              "description": "One psychedelic dose (1mg of psilocybin + 25mg of psilocybin) taken in conjunction with psilocybin-assisted psychotherapy",
              "interventionNames": ["Drug: Single Psychedelic Dose Psilocybin"]
            }
          ],
          "interventions": [
            {
              "type": "DRUG",
              "name": "Single Psychedelic Dose Psilocybin",
              "description": "One psychedelic dose (1mg of psilocybin + 25mg of psilocybin) taken in conjunction with psilocybin-assisted psychotherapy",
              "armGroupLabels": ["Single Dose of Psilocybin"],
              "armNames": []
            },
            {
              "type": "DRUG",
              "name": "Two Psychedelic Doses Psilocybin",
              "description": "Two psychedelic doses (25 mg of psilocybin + 25mg of psilocybin) taken in conjunction with psilocybin-assisted psychotherapy",
              "armGroupLabels": ["Two Doses of Psilocybin"],
              "armNames": []
            }
          ]
        },
        "outcomesModule": {
          "primaryOutcomes": [
            {
              "measure": "Antidepressant Efficacy",
              "description": "Antidepressant efficacy will be evaluated using change in Montgomery-Åsberg Depression Rating Scale (MADRS) score, a clinician-administered depression severity rating scale where higher scores indicate greater severity of depression symptoms. The MADRS has been validated extensively in major depressive disorder (MDD) and treatment-resistant depression (TRD) patient population samples, and specifically in psilocybin trials.",
              "timeFrame": "Baseline to Week 8 (Primary Endpoint)"
            }
          ],
          "secondaryOutcomes": [
            {
              "measure": "Self-Reported Depression Symptoms",
              "description": "Self-assessment of depression symptoms using the Generalized Anxiety Disorder 7-Item where higher scores indicate greater severity.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Anxiety Symptoms",
              "description": "Self-assessment of anxiety symptoms using the 16-Item Quick Inventory for Depression Symptomatology where higher scores indicate greater severity.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Self-Reported Quality of Life",
              "description": "Self-assessment of quality of life measured by the World Health Organization-5, Well-Being Index where higher scores indicate a better quality of life score.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Subjective Functioning",
              "description": "Self-assessment of subjective function as measured by the Sheehan Disability Scale where higher scores indicate greater severity of disability symptoms.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Incidence of Treatment Emergent Adverse Events (Safety and Tolerability)",
              "description": "The incidence of adverse events will be measured throughout the trial. During dosing sessions, post-dose blood pressure changes will be recorded, as well as dissociative and psychotomimetic effects using the Clinician Administered Dissociative Symptom Scale (CADSS), the Brief Psychiatric Rating Scale-Positive Symptom Subscale (BPRS-PS), the Five-Dimensional Altered States of Consciousness (5D-ASC), the Ego-Dissolution Inventory (EDI) and the Mystical Experience Questionnaire (MEQ). Higher scores on these aforementioned scales indicate greater dissociation/altered perception as a measure of adverse psychological symptoms.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Cognitive Dysfunction",
              "description": "The Perceived Deficits Questionnaire-5 Item is a brief patient-rated scale that assesses cognitive dysfunction in people with depression. It is a 5-item questionnaire that is a subset of the larger 20-item questionnaires. Participants rank each item on frequency in the last week using a scale ranging from \"never\" to \"always\".",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Psychomotor Performance",
              "description": "The Digit Symbol Substitution Test is a pencil and paper test of psychomotor performance. Participants will be key grid of numbers and matching symbols and are asked to fill as many empty boxes as possible with the symbol matching each number. The score is the number of correct number-symbol matches achieved in 90 seconds.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Phonemic Word Fluency",
              "description": "The FAS Verbal Fluency Test is a measure of phonemic word fluency. The number of words recited that begin with the letters 'F', 'A', and 'S' within a one-minute time frame serves as a measure of word fluency.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Psychomotor Speed, Visual search, and Attention",
              "description": "The Trail Making Tests A and B require participants to connect numbered circles with a pencil as quickly as possible in a numerical or alternating alphanumeric sequence respectively. Shorter time to complete these tests and fewer errors denotes higher performance.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Verbal Learning and Memory",
              "description": "The California Verbal Learning test is a comprehensive, detailed assessment of verbal learning and memory deficits. The Standard and Alternate Forms include tests of immediate and delayed recall, and recognition. The number of words recalled or recognized accurately in each test denotes better performance and is compared using a standardized score across participants.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Working Memory, Attention and Executive Function",
              "description": "The Symbol Check game from THINC-it is inspired by the one-back task and the Spotter game from THINC-it is inspired by the Choice Reaction Time task. These measures are performed consecutively and are scored based on speed and accuracy.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Effort-Based Decision Making",
              "description": "The Effort Expenditure for Reward Task is a behavioral paradigm that measures effort-based decision-making. Participants are presented with a series of repeated trials in which they are able to choose between performing a \"hard-task\" or an \"easy-task\" in order to earn varying amounts of monetary reward. The test is scored based on what task the participant selects and performance on each task.",
              "timeFrame": "Baseline to 6 month follow-up"
            }
          ],
          "otherOutcomes": [
            {
              "measure": "Participant Blinding Success",
              "description": "The success of blinding of patients will be assessed by computation of Bang's blinding index. This scale is scored on a scale of -1 to 1 where 1 indicates a complete lack of blinding, 0 is consistent with perfect blinding and -1 indicates opposite guessing of unblinding.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Expectancy Effects",
              "description": "The impact of expectancy bias will also be evaluated using the Stanford Expectations of Treatment Scale (SETS), a validated tool for measuring expectancy in trials. This assessment uses a Likert scale from 0 (not agree at all) to 6 (fully agree) for statements about positive and negative expectancies.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Quality of Clinician-Patient Therapeutic Relationship",
              "description": "The clinician-patient therapeutic relationship will be assessed with the Scale to Assess the Therapeutic Relationship - Patient Version (STAR-P). The STAR-P is measured on a Likert scale ranging from 0 to 4 for 3 different subscales: positive collaboration, positive clinician input, and non-supportive clinician input.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Qualitative Narrative Feedback",
              "description": "Qualitative narrative feedback will be obtained from participants and therapists for potential experiences that may have not been demonstrated on other measures. Answering the questionnaire to provide feedback is optional throughout enrolment in the study.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "Percentage Restarting Antidepressants",
              "description": "The percentage of participants that restart antidepressant medications after completion of the trial, during the six-month observational period, will be monitored at each study visit with a medication review.",
              "timeFrame": "Baseline to 6 month follow-up"
            },
            {
              "measure": "EEG Predictors of Response",
              "description": "Electroencephalogram (EEG) results will be analyzed using spectral domain analysis, current source density analysis, and entropy analysis. EEG features captured at Day 0 (Visit 2) will be used to extract predictors of response to single vs two dosing session. Changes in EEG wave frequencies (Hz) between Visit 2 and Visit 5, and between Visit 2 and Visit 11 will be assessed.",
              "timeFrame": "Baseline to 8 weeks"
            }
          ]
        },
        "eligibilityModule": {
          "eligibilityCriteria": "Inclusion Criteria:\n\n1. Adults 18 to 65 years old.\n2. Must be deemed to have capacity to provide informed consent.\n3. Must sign and date the informed consent form.\n4. Stated willingness to comply with all study procedures.\n5. Ability to read and communicate in English, such that their literacy and comprehension is sufficient for understanding the consent form and study questionnaires, as evaluated by study staff obtaining consent.\n6. Meets DSM-5 criteria for MDD, currently experiencing a Major Depressive Episode (MDE) without psychotic features, as diagnosed by a mood disorder specialist. Diagnosis will be confirmed using the Mini-International Neuropsychiatric Interview (MINI).\n7. Current MDE must be moderate to severe, as determined by a MADRS score greater than 21.\n8. Have not responded to at least two trials of antidepressants at an adequate dosage and duration based on the Antidepressant Treatment History Form Short Form (ATHF-SF) with no upper limit on the number of treatment failures.\n9. Ability to take oral medication.\n10. Individuals who are capable of becoming pregnant: use of highly effective contraception for at least 1 months prior to screening and agreement to use such a method during study participation in addition to monthly check-ins by study staff to determine the first day of their last menstrual period;\n11. Individuals who are capable of making their partner pregnant: use of condoms or other methods for the duration of study participation to ensure effective contraception with partner.\n12. Individuals who are willing to taper off concomitant medications (antidepressants, antipsychotics, mood stabilizers, ketamine, esketamine, monoaminergic medicines, and stimulants) for a minimum of 1-month prior to Baseline (V2, Day 0) and whose physician confirms that it is safe for them to do so.\n13. Individuals who are willing to not receive additional psychotherapy (outside of the therapy provided as part of the study) during the 8-week trial and whose physician confirms that it is safe for them to do so; however, they may continue seeing their therapist before and after this time period.\n14. Individuals who have a caregiver that will be able to bring them home after treatment sessions and stay with them for a minimum of 24 hours after discharge;\n15. Agreement to adhere to Lifestyle Considerations (section 4.5) throughout study duration.\n\nExclusion Criteria:\n\n1. Lifetime history of mania, hypomania or psychosis as determined by clinical psychiatric assessment and the MINI.\n2. Current symptoms of mania, hypomania or mixed features, as determined by the Young Mania Rating Scale (YMRS) score greater than 12.\n3. Substance, cannabis, or alcohol use disorder within the past 3 months or lifetime history of hallucinogen use disorder as determined by the MINI and urine drug screen.\n4. Major neurocognitive disorder, as determined by clinical assessment, including administration of the Montreal Cognitive Assessment (MoCA).\n5. Have active suicidal ideation as determined by the C-SSRS and/or clinical interview (significant suicide risk is defined by suicidal ideation as endorsed by items 4 or 5 of the C-SSRS) or active suicidality requiring involuntary inpatient treatment or recent suicide attempts within the past 3 months.\n6. Presence of a relative or absolute contraindication to psilocybin (within the past 12 months),, including a drug allergy, recent stroke history, uncontrolled hypertension, low or labile blood pressure, recent myocardial infarction (within the past 12 months),, cardiac arrhythmic, severe coronary artery disease, or moderate to severe renal (Glomerular Filtration Rate (GFR) less than 45ml/min/1.73 m2) or hepatic impairment (Child-Pugh B: 7 to 9 points and Child-Pugh C: 10 to 15 points).\n7. Pregnant as assessed by a urine pregnancy test at Screening (V1) or individual's that intend to become pregnant during the study or are breastfeeding.\n8. Treatment with another investigational drug or other intervention within 30 days of Baseline (V2).\n9. Participants who will receive any form of brain stimulation (e.g., rTMS, ECT) during the trial or have within 30 days before Baseline (V2).\n10. Individuals who have had changes to psychiatric medications 30 days before entering the trial, outside of as needed (PRN) medications.\n11. Any DSM-5 lifetime diagnosis of a schizophrenia-spectrum disorder; obsessive- compulsive disorder, psychotic disorder (unless substance induced or due to a medical condition), bipolar I or II disorder, paranoid personality disorder, or borderline personality disorder as determined by medical history, the M.I.N.I clinical interview, and the International Personality Disorder Examination (IPDE) administered at Screening (V1).\n12. Any first-degree relative with a diagnosis of schizophrenia-spectrum disorder; psychotic disorder (unless substance-induced or due to a medical condition); or bipolar I or II disorder as determined by the family medical history form and discussions with the participant.\n13. Uncontrolled seizure disorder or a seizure within the past 12 months\n14. Presence of baseline prolonged QTc or Torsade de Pointes as measured by the ECG or a history of long QTc syndrome or related risk factors.\n15. Use of classic psychedelic drugs within the previous 6 months, including but not limited to psilocybin, psilocin, DMT, LSD, ayahuasca, mescaline, peyote, 5-methoxy-N,N-dimethyltryptamine (5-MeO-DMT).\n16. Any other clinically significant physical illness including chronic infectious diseases or any other major concurrent illness that, in the opinion of the investigator, may interfere with the interpretation of the study results or constitute a health risk for the participant if they take part in the study.",
          "healthyVolunteers": false,
          "sex": "ALL",
          "minimumAge": "18 Years",
          "maximumAge": "65 Years",
          "stdAges": ["ADULT", "OLDER_ADULT"]
        },
        "contactsLocationsModule": {
          "centralContacts": [
            {
              "name": "Danica Johnson, BScH",
              "role": "CONTACT",
              "phone": "416-603-5800",
              "phoneExt": "3796",
              "email": "danica.johnson@uhn.ca"
            },
            {
              "name": "Zoe Doyle, RN",
              "role": "CONTACT",
              "email": "zoe.doyle@uhn.ca"
            }
          ],
          "overallOfficials": [
            {
              "name": "Joshua Rosenblat, MD, MSc",
              "affiliation": "University Health Network, Toronto",
              "role": "PRINCIPAL_INVESTIGATOR"
            }
          ],
          "locations": [
            {
              "facility": "Toronto Western Hospital",
              "status": "RECRUITING",
              "city": "Toronto",
              "state": "Ontario",
              "zip": "M5T 2S8",
              "country": "Canada",
              "contacts": [
                {
                  "name": "Danica Johnson, BScH",
                  "role": "CONTACT",
                  "email": "danica.johnson@uhn.ca"
                },
                {
                  "name": "Zoe Doyle, RN",
                  "role": "CONTACT",
                  "email": "zoe.doyle@uhn.ca"
                },
                {
                  "name": "Joshua Rosenblat, MD, MSc",
                  "role": "PRINCIPAL_INVESTIGATOR"
                }
              ],
              "geoPoint": {
                "lat": 43.70011,
                "lon": -79.4163
              }
            }
          ]
        }
      },
      "derivedSection": {
        "miscInfoModule": {
          "versionHolder": "2025-07-25"
        },
        "conditionBrowseModule": {
          "meshes": [
            {
              "id": "D003863",
              "term": "Depression"
            },
            {
              "id": "D003866",
              "term": "Depressive Disorder"
            },
            {
              "id": "D003865",
              "term": "Depressive Disorder, Major"
            },
            {
              "id": "D061218",
              "term": "Depressive Disorder, Treatment-Resistant"
            },
            {
              "id": "D019964",
              "term": "Mood Disorders"
            }
          ],
          "ancestors": [],
          "browseLeaves": [
            {
              "id": "M7058",
              "name": "Depression",
              "asFound": "Depression",
              "relevance": "HIGH"
            },
            {
              "id": "M7061",
              "name": "Depressive Disorder",
              "asFound": "Depression",
              "relevance": "HIGH"
            },
            {
              "id": "M7060",
              "name": "Depressive Disorder, Major",
              "asFound": "Major Depressive Disorder",
              "relevance": "HIGH"
            },
            {
              "id": "M29783",
              "name": "Depressive Disorder, Treatment-Resistant",
              "asFound": "Treatment Resistant Depression",
              "relevance": "HIGH"
            },
            {
              "id": "M21835",
              "name": "Mood Disorders",
              "asFound": "Mood Disorders",
              "relevance": "HIGH"
            }
          ],
          "browseBranches": [
            {
              "abbrev": "BXM",
              "name": "Behaviors and Mental Disorders"
            },
            {
              "abbrev": "All",
              "name": "All Conditions"
            }
          ]
        },
        "interventionBrowseModule": {
          "meshes": [
            {
              "id": "D011562",
              "term": "Psilocybin"
            },
            {
              "id": "D006213",
              "term": "Hallucinogens"
            }
          ],
          "ancestors": [
            {
              "id": "D045505",
              "term": "Physiological Effects of Drugs"
            }
          ],
          "browseLeaves": [
            {
              "id": "M14419",
              "name": "Psilocybin",
              "asFound": "2/day",
              "relevance": "HIGH"
            },
            {
              "id": "M9305",
              "name": "Hallucinogens",
              "asFound": "White blood cell count",
              "relevance": "HIGH"
            }
          ],
          "browseBranches": [
            {
              "abbrev": "PsychDr",
              "name": "Psychotropic Drugs"
            },
            {
              "abbrev": "All",
              "name": "All Drugs and Chemicals"
            }
          ]
        }
      },
      "hasResults": false
    }
  ]
}
```
