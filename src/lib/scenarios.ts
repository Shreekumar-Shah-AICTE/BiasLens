import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'hiring',
    title: 'Hiring Algorithm',
    icon: '💼',
    domain: 'Employment',
    description: 'An AI system used by a Fortune 500 company to screen 50,000+ job applications annually. It scores candidates 0-100 based on resume text, education history, work experience, and geographic data.',
    datasetInfo: '50,000 applications • 12 features • 3 years of historical decisions',
    prompt: `Analyze this AI hiring system for bias:

System: An automated resume screening algorithm used by a large tech company. 
Dataset: 50,000 job applications over 3 years.
Features used: Name, University attended, Years of experience, Previous company names, Skills listed, GPA, City/Zip code, Graduation year, Number of job changes, Cover letter sentiment score, GitHub activity score, LinkedIn connections count.
Decision: Binary - "Advance to Interview" or "Reject"

Historical outcomes show:
- 62% of male applicants advanced vs 41% of female applicants
- Applicants from top-20 universities advanced at 78% vs 34% from other schools
- Average approval for suburban zip codes: 58%, urban zip codes: 44%, rural: 31%
- Candidates with gaps in employment rejected at 89% regardless of explanation

Perform a comprehensive bias audit. Find hidden proxy variables, demographic disparities, and unfair correlations. Be specific with statistics.`
  },
  {
    id: 'lending',
    title: 'Loan Approval',
    icon: '🏦',
    domain: 'Financial Services',
    description: 'A machine learning model deployed by a national bank to approve or deny personal loan applications. Processes 200,000+ applications per year with automated decisioning.',
    datasetInfo: '200,000 applications • 18 features • 5 years of lending data',
    prompt: `Analyze this AI lending system for bias:

System: Automated loan approval model used by a national bank for personal loans ($5K-$50K).
Dataset: 200,000 loan applications over 5 years.
Features used: Annual income, Credit score, Debt-to-income ratio, Employment length, Home ownership status, Zip code, Number of credit inquiries, Loan amount requested, Purpose of loan, Number of existing accounts, Payment history length, Monthly expenses, Education level, Marital status, Number of dependents, Type of employer (public/private/self), Bank account age, Mobile vs desktop application channel.
Decision: "Approved", "Denied", or "Manual Review"

Historical outcomes show:
- Approval rate for white neighborhoods: 67%, Black neighborhoods: 38%, Hispanic neighborhoods: 42%
- Self-employed applicants denied at 71% vs 35% for corporate employees
- Mobile applicants denied 23% more often than desktop applicants
- Single parents denied at 2.1x the rate of married applicants with same income
- Zip codes with median income >$75K approved at 74%, <$35K approved at 29%

Perform a comprehensive bias audit. Find hidden proxy variables, especially those that appear neutral but correlate with race, gender, or socioeconomic status.`
  },
  {
    id: 'healthcare',
    title: 'Medical Triage',
    icon: '🏥',
    domain: 'Healthcare',
    description: 'An AI-powered patient triage system used in emergency departments to prioritize patients. Assigns urgency scores that determine wait times and resource allocation.',
    datasetInfo: '120,000 patient records • 15 features • 2 years of triage data',
    prompt: `Analyze this AI medical triage system for bias:

System: Emergency department AI triage system that assigns urgency scores (1-5) to incoming patients.
Dataset: 120,000 patient encounters over 2 years at a large urban hospital network.
Features used: Age, Reported pain level (1-10), Vital signs (BP, heart rate, temperature, O2 saturation), Chief complaint text, Insurance type, Primary language, Time of arrival, Mode of arrival (ambulance/walk-in/transfer), Previous visit history, Chronic condition flags, BMI, Zip code of residence, Referring physician (if any), Accompanying person present (yes/no).
Decision: Urgency score 1 (immediate) to 5 (non-urgent), determining wait time and resource allocation.

Historical outcomes show:
- Black patients assigned urgency score 4-5 (low priority) at 47% vs 31% for white patients with similar symptoms
- Non-English speakers waited 34 minutes longer on average
- Patients with public insurance (Medicaid) scored 0.8 points lower urgency than private insurance for identical presentations
- Women reporting chest pain scored 1.2 points lower urgency than men
- Walk-in patients scored lower than ambulance arrivals regardless of actual severity
- Patients from zip codes with lower median income received lower urgency scores

Perform a comprehensive bias audit. Focus especially on how insurance type and language serve as hidden proxies for race and socioeconomic status in medical decision-making. This is literally life-or-death.`
  }
];
