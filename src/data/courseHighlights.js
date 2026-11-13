// Detail-page extras derived from each course's own API description.
// Every phrase here is copied from that description; getTopics/getLearningMethods
// re-check it against the live text, so nothing shows that the description doesn't say.

const topicsBySlug = {
  'fellowship-in-pediatric-cardiology': [
    'congenital heart disease',
    'fetal cardiology',
    'neonatal cardiovascular emergencies',
    'pediatric arrhythmias',
    'cardiomyopathies',
    'rheumatic heart disease',
    'pulmonary hypertension',
    'heart failure',
    'ECG interpretation',
    'echocardiography',
    'electrophysiology',
    'pediatric cardiac critical care',
  ],
  'fellowship-in-cardiac-surgery': [
    'coronary artery bypass grafting',
    'complex valvular surgery',
    'aortic and root surgery',
    'congenital and structural heart disease',
    'cardiopulmonary bypass',
    'myocardial protection',
    'minimally invasive and robotic cardiac surgery',
    'mechanical circulatory support',
    'ECMO',
    'ventricular assist devices',
    'heart failure and transplantation',
    'cardiac trauma',
  ],
  'fellowship-in-clinical-cardiology': [
    'coronary artery disease',
    'acute coronary syndromes',
    'heart failure',
    'hypertension',
    'arrhythmias',
    'cardiomyopathies',
    'vascular disorders',
    'preventive cardiology',
    'cardiovascular emergencies',
    'advanced ECG interpretation',
    'echocardiography',
    'cardiac CT/MRI',
  ],
  'fellowship-in-echocardiography': [
    'advanced transthoracic echocardiography (TTE)',
    'Doppler assessment',
    'valvular heart disease',
    'diastolic function',
    'cardiomyopathies',
    'pulmonary hypertension',
    'stress echocardiography',
    'transesophageal echocardiography (TEE)',
    'contrast echocardiography',
    'point-of-care cardiac ultrasound',
    'speckle-tracking and strain imaging',
    'cardio-oncology imaging',
  ],
  'fellowship-in-pediatric-echocardiography': [
    'pediatric cardiac anatomy and physiology',
    'systematic transthoracic echocardiography',
    'color and spectral Doppler',
    'congenital heart diseases',
    'patent ductus arteriosus',
    'coarctation of the aorta',
    'tetralogy of Fallot',
    'transposition of the great arteries',
    'Kawasaki disease',
    'targeted neonatal echocardiography',
    'point-of-care cardiac ultrasound',
    'strain imaging',
  ],
  'fellowship-in-interventional-cardiology': [
    'coronary angiography',
    'percutaneous coronary intervention (PCI)',
    'chronic total occlusion (CTO) intervention',
    'left-main and bifurcation disease',
    'intravascular ultrasound (IVUS)',
    'optical coherence tomography (OCT)',
    'atherectomy',
    'intravascular lithotripsy',
    'drug-coated balloons',
    'cardiogenic shock and mechanical circulatory support',
    'TAVR',
    'left atrial appendage occlusion',
  ],
}

// Order matters only for display. `icon` is a key into the detail page's icon set.
const learningMethods = [
  { phrase: 'case-based learning', icon: 'case' },
  { phrase: 'recorded video lectures', icon: 'video' },
  { phrase: 'live interactive sessions', icon: 'live' },
  { phrase: 'expert-led sessions', icon: 'people' },
  { phrase: 'didactic lectures', icon: 'lecture' },
  { phrase: 'seminars', icon: 'lecture' },
  { phrase: 'workshops', icon: 'people' },
  { phrase: 'case discussions', icon: 'case' },
  { phrase: 'clinical scenarios', icon: 'pulse' },
  { phrase: 'simulation labs', icon: 'lab' },
  { phrase: 'live surgical observerships', icon: 'live' },
  { phrase: 'digital resources', icon: 'screen' },
  { phrase: 'e-books', icon: 'book' },
  { phrase: 'assignments', icon: 'pencil' },
  { phrase: 'MCQ-based assessments', icon: 'quiz' },
]

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export function getTopics(course) {
  const text = (course?.description || '').toLowerCase()
  return (topicsBySlug[course?.slug] || [])
    .filter((topic) => text.includes(topic.toLowerCase()))
    .map(capitalize)
}

export function getLearningMethods(course) {
  const text = (course?.description || '').toLowerCase()
  return learningMethods
    .filter((m) => text.includes(m.phrase.toLowerCase()))
    .map((m) => ({ label: capitalize(m.phrase), icon: m.icon }))
}

export function hasLiveAndRecorded(course) {
  const text = course?.description || ''
  return /\blive\b/i.test(text) && /\brecorded\b/i.test(text)
}
