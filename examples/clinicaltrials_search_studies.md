# Example: Searching for Clinical Studies

This example demonstrates how to use the `clinicaltrials_search_studies` tool to find clinical trials based on specific criteria.

## Tool Call

The following tool call searches for studies related to "psilocybin" and "depression".

```json
{
  "query": {
    "cond": "depression",
    "term": "psilocybin"
  },
  "countTotal": true
}
```

## Tool Response

```markdown
Successfully retrieved 10 studies.

- **NCT ID:** NCT06341426
- **Title:** Psilocybin-Assisted Psychotherapy for Treatment-Resistant Depression: Comparing One Versus Two Doses of Psilocybin
- **Status:** RECRUITING
- **Summary:** The purpose of this study is to see if one or two doses of psilocybin is more effective in relieving depressive symptoms in patients with treatment-resistant depression (TRD). Researchers also want to know if a second dose of psilocybin is safe and well-tolerated. This study will see if psilocybin is effective, safe, and well-tolerated by tracking changes in depressive symptoms, suicidality, and side effects. This study will also see if a second dose of psilocybin has an effect on quality of life, functioning, cognition (thinking, reasoning, remembering), and how long depressive symptoms improve (or worsen) after psilocybin is administered.
- **Interventions:** Single Psychedelic Dose Psilocybin, Two Psychedelic Doses Psilocybin
- **Sponsor:** University Health Network, Toronto

---

- **NCT ID:** NCT06230757
- **Title:** Psilocybin for Treatment-Resistant Depression
- **Status:** RECRUITING
- **Summary:** The purpose of this study is to evaluate the efficacy of psilocybin on the symptom of anhedonia in individuals with treatment-resistant major depressive disorder.
- **Interventions:** Psilocybin 25mg, Placebo (active placebo)
- **Sponsor:** University of Colorado, Denver

---

- **NCT ID:** NCT03554174
- **Title:** Psilocybin - Induced Neuroplasticity in the Treatment of Major Depressive Disorder
- **Status:** ACTIVE_NOT_RECRUITING
- **Summary:** The primary goal of this pilot study is to investigate whether psilocybin alters neuroplasticity in people with major depressive disorder. The primary hypothesis is that psilocybin will result in neuroplastic changes that parallel improvement in symptoms of depression.
- **Interventions:** Low Dose Psilocybin, Placebo, Medium Dose Psilocybin
- **Sponsor:** Yale University

---

- **NCT ID:** NCT05381974
- **Title:** The Effects of Psilocybin on Self-Focus and Self-Related Processing in Treatment Resistant MDD
- **Status:** WITHDRAWN
- **Summary:** This open-label fMRI study will assess the effects of a single dose of psilocybin on rumination and the neural correlates of rumination in individuals with treatment-resistant major depressive disorder.
- **Interventions:** Psilocybin
- **Sponsor:** Massachusetts General Hospital

---

- **NCT ID:** NCT04519957
- **Title:** Long Term Follow Up Study to COMP 001 And COMP 003 Trials (P-TRD LTFU)
- **Status:** COMPLETED
- **Summary:** The primary objective of this study is to assess the long-term efficacy of psilocybin with respect to use of new antidepressant treatment, hospitalisations for depression, suicidality, and depressive severity rated using the Montgomery and Asberg Depression Rating Scale (MADRS) over a total of 52 weeks (compared across the 1 mg, 10 mg and 25 mg psilocybin groups from COMP 001).
- **Interventions:** N/A
- **Sponsor:** COMPASS Pathways

---

- **NCT ID:** NCT05042466
- **Title:** Northwest Therapies Trauma Psilocybin Study Compassionate Use Study
- **Status:** NOT_YET_RECRUITING
- **Summary:** The on-boarding of unregulatable trauma in the United States has reached 20%, which is 1/5 of the population. A population of this magnitude, by definition has now reached an epidemic classification. The population with chronic illness as stated: PTSD, Chronic Depression, MS, HIV, and SARS-CoV-2- Long Haulers Syndrome. These chronic conditions/illnesses many lead to death and are often the cause or perpetuate unregulated trauma and create an unstable population. Psychiatrists have testified before congress that the SSSRI medications are not fully functional cures and are not working for patients. Enchanced Psilocybin micro-dosing at the levels of 0.15g. ranging to 0.33g. every other day an 0.50g. for monthly maintenance of neural pathway production is proving to shave back the highjacked nervous system, thus stopping or rerouting the ruminating neurotransmitters, by rerouting thru new neural pathways. The body has a additional natural pathway in place then to decrease/stop these thoughts by have open pathways to process the thought differently. Serotonin is a neurotransmitter and which is the most famous of all the neurotransmitters. Serotonin is very similar in its compound structure to the plant medicine family of psilocybin, serotonin and psilocybin work very similarly with the 5h2A receptor in the human cortex ( the outer cortex of the brain ). Enhanced Microdosing of psilocybin at the levels of 0.15 to 0.33 and of 1 gram to 1.5 grams monthly for maintenance of the newly opened neural pathways is postulated to be a mental health game changer. Psilocybin helps shave back the highjacked nervous system which is a condition known as the diagnosis (SSD) Somatic Symptom Disorder. This research is believed accurate by proof on previous studies to process the subconscious held in the subconscious and shave back the somatic feelings resulting from the trauma of the individuals who have on-boarded chronic disease(s) of Trauma,PTSD, Unregulated Chronic Depression, MS, Cancer, HIV, and SARS-CoV-2- Long Haulers Syndrome.
- **Interventions:** Trauma
- **Sponsor:** NWTraumatherapies

---

- **NCT ID:** NCT06141876
- **Title:** Evaluation of Psilocybin-Assisted Psychotherapy in Treating Severe Depression in Patients With PTSD
- **Status:** NOT_YET_RECRUITING
- **Summary:** Post-Traumatic Stress Disorder (PTSD) is a mental disorder that may develop in people who have been exposed to a traumatic event, including actual or threatened death, serious injury, or sexual violence. Exposure to a traumatic event is defined as directly experiencing the event, learning about the event, or repeated exposure to details of the event. PTSD is often accompanied by other psychiatric and physical comorbidities, both of which are associated with elevated healthcare costs. Depression, psychosis and suicide rates are consistently reported in greater proportion of PTSD patients. Despite the overwhelming impact of PTSD and comorbid depression, there is a shortfall of effective treatments with few side effects that target the broad range of symptoms, including depression.

Psilocybin has been studied for the treatment of depression, anxiety, tobacco and alcohol use disorders, obsessive-compulsive disorder, end of life depression and anxiety, demonstrating safety and efficacy for a variety of indications, with no significant adverse events occurring during the course of treatment and follow-up. Notably, in a participant group distinguished by long-standing, moderate to severe major depressive disorder, two doses of psilocybin-assisted therapy were found to be as effective in antidepressant effects as 6 weeks of daily escitalopram, a commonly used SSRI. Promising results found in these studies have led to psilocybin recently receiving breakthrough designation from the US FDA for its potential therapeutic effect in the treatment of depression.

Based on previous research, psilocybin has demonstrated a favorable safety profile and has shown preliminary efficacy against depression as well as other symptoms that typically affect patients with PTSD. Unlike traditional SSRIs which are associated with treatment-resistance and addiction, psilocybin requires few doses to improve a wide-range of symptoms and has not been linked with physical dependence. Furthermore, the effect of other psychedelics can vary greatly and may potentially exacerbate existing conditions.
- **Interventions:** APEX-002-A02, Placebo
- **Sponsor:** Apex Labs Ltd.

---

- **NCT ID:** NCT06518720
- **Title:** Treatment With Psilocybin for Chronic Neuropathic Pain and Depression (TRANSCEND)
- **Status:** RECRUITING
- **Summary:** Psilocybin, the chemical component of "magic mushrooms", has been administered with psychotherapy in several randomized clinical trials (RCTs) showing large and sustained antidepressant effects.

The purpose of this study is to assess the feasibility, tolerability, and preliminary efficacy of psilocybin therapy for adults with chronic neuropathic pain and co-morbid treatment resistant depression.
- **Interventions:** Psilocybin 25 mg
- **Sponsor:** Centre for Addiction and Mental Health

---

- **NCT ID:** NCT06512220
- **Title:** Imaging the Effects of Serotonin 2A Receptor Modulation on Synaptic Density in Treatment-resistant Depression (SYNVEST)
- **Status:** RECRUITING
- **Summary:** Limit: 5000 characters. Psilocybin, the chemical component of "magic mushrooms", has been administered with psychotherapy in several randomized clinical trials (RCTs) showing large and sustained antidepressant effects. In healthy volunteers, the psychedelic effects of psilocybin have been shown to be blocked by administration of certain medications such as risperidone.

The purpose of this study is to use an established SV2A radiotracer produced at our Centre to determine the feasibility of integrating PET imaging in to psilocybin trials. The preliminary imaging data will assess whether psilocybin's antidepressant effects are related to changes in synaptic density in adults with TRD, and whether any changes in synaptic density are associated with psilocybin's actions on the 5-HT2AR.
- **Interventions:** Psilocybin 25 mg, Risperidone 1 MG
- **Sponsor:** Centre for Addiction and Mental Health

---

- **NCT ID:** NCT06943573
- **Title:** Psilocybin-Assisted Therapy for Treatment-Resistant Depression in Bipolar II Disorder
- **Status:** NOT_YET_RECRUITING
- **Summary:** This study is a 12-week (in addition to up to 30 days of screening) randomized, double-blind, placebo-controlled, parallel-group trial. The primary objective of this study is to assess the effectiveness, safety, and tolerability of single-dose psilocybin (25 mg)-assisted therapy in comparison to active placebo (1 mg micro-dose) psilocybin-assisted therapy in patients with bipolar II depression who have not responded to adequate trials with at least two first or second-line treatments for bipolar II depression (i.e. quetiapine, lithium, lamotrigine, sertraline, or venlafaxine as monotherapy or adjunctive therapy, or bupropion adjunctive therapy). The active placebo is a substance that looks identical to the study medication but contains less therapeutic ingredients, and thus is less capable of producing the transformative and meaningful aspects of psychedelic experience compared to the 25 mg dose. Participants will have a total of 11 study visits over a period of up to 16 weeks, which includes 5 therapy sessions from trained study therapists.
- **Interventions:** psilocybin (25 mg), psilocybin 1mg micro-dose
- **Sponsor:** Lakshmi N Yatham

Next Page Token: NF0g5JCHlfcswg
Total Count: 88
```
