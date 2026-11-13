/*
 * FACULTY CONTENT — VERIFY BEFORE LAUNCH
 *
 * Dr. Ambuj: qualification (DM, MD) and departments (Cardiology, Medicine) are
 * confirmed from MGA faculty records. The bio is a placeholder until the full
 * profile is supplied.
 *
 * Dr. Richa, Dr. Sagar, Dr. Meet Jha: the NAMES are confirmed. Everything else
 * (qualification, focus, bio, qualifications, focusAreas) is sample content.
 * It must be verified and replaced with each doctor's real credentials before
 * the site goes live.
 *
 * No institutions, hospitals, cities, years, registration numbers, awards or
 * experience figures are included on purpose. Add only verified facts.
 *
 * photo: set to an image URL (e.g. '/doctors/dr-meet-jha.jpg') when available;
 * null shows the doctor's initials.
 */
export const doctors = [
  {
    id: 'dr-ambuj',
    name: 'Dr. Ambuj',
    qualification: 'DM, MD',
    focus: 'Cardiology',
    photo: null,
    bio: [
      'Bio pending: [full profile to be supplied: current role, institution, clinical interests].',
    ],
    qualifications: ['DM', 'MD'],
    focusAreas: ['Cardiology', 'Medicine'],
  },
  {
    id: 'dr-richa',
    name: 'Dr. Richa',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
    focus: 'Heart Failure & Cardiomyopathy',
    photo: null,
    bio: [
      'Dr. Richa is a cardiologist with a clinical focus on heart failure and cardiomyopathy, covering diagnosis, risk assessment and long-term medical management.',
      'As faculty, Dr. Richa teaches sessions on guideline-directed therapy, the interpretation of echocardiography findings in heart failure and the follow-up of patients with chronic heart disease.',
    ],
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'],
    focusAreas: [
      'Heart Failure',
      'Cardiomyopathy',
      'Echocardiography',
      'Guideline-Directed Therapy',
    ],
  },
  {
    id: 'dr-sagar',
    name: 'Dr. Sagar',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
    focus: 'Electrophysiology & Arrhythmia',
    photo: null,
    bio: [
      'Dr. Sagar is a cardiologist whose clinical interest is cardiac electrophysiology, including the evaluation and management of heart rhythm disorders.',
      'As faculty, Dr. Sagar teaches ECG interpretation, the approach to common arrhythmias such as atrial fibrillation, and the principles of cardiac device therapy.',
    ],
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'],
    focusAreas: [
      'Electrophysiology',
      'Arrhythmia Management',
      'ECG Interpretation',
      'Atrial Fibrillation',
    ],
  },
  {
    id: 'dr-meet-jha',
    name: 'Dr. Meet Jha',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
    focus: 'Interventional Cardiology',
    photo: null,
    bio: [
      'Dr. Meet Jha is a cardiologist whose clinical work centres on interventional cardiology, including the assessment and catheter-based management of coronary artery disease.',
      'As faculty, Dr. Jha teaches case-based sessions on coronary angiography, patient selection for intervention and the follow-up care of patients after a procedure.',
    ],
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'],
    focusAreas: [
      'Interventional Cardiology',
      'Coronary Artery Disease',
      'Acute Coronary Syndromes',
      'Coronary Angiography',
    ],
  },
]

export const getDoctorById = (id) => doctors.find((d) => d.id === id)
