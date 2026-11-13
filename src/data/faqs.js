// Shared FAQ content. Each item is { question, answer }.

// Kept as its own constant so course pages can leave it out (see courseFallbackFaqs).
const whichCoursesFaq = {
  question: 'Which courses can I join?',
  answer:
    'We offer the PG Diploma in Clinical Cardiology, Fellowship in Interventional Cardiology and Certificate in Clinical Cardiology. You can view the details of each on the Courses page.',
}

// Also shown on the Terms page (Eligibility section).
export const eligibilityAnswer =
  'Medical Global Academy provides training facilities for MBBS, MD, and other degree holders in the medical field. To enroll in our courses, you must hold a valid degree in a related field (e.g., MBBS, MD, etc.) from a recognized institution.'

// General questions, shown in full on the Home page.
export const generalFaqs = [
  {
    question: 'What is the eligibility criteria for these programs?',
    answer: eligibilityAnswer,
  },
  {
    question: 'How are the programs delivered?',
    answer:
      'Specialist-led faculty teach through case-based learning, so you practise real diagnosis and treatment decisions, not just theory.',
  },
  {
    question: 'How do I enrol in a program?',
    answer:
      'Click "Talk to Counsellor" on this page or call us on +91 9310027474, and our team will guide you through the next steps.',
  },
  {
    question: 'Is the certification recognised?',
    answer:
      'Yes. Our programs are CPD accredited and aligned with the American Council of Training & Development (ACTD).',
  },
  whichCoursesFaq,
  {
    question: 'Can I study online while I keep working?',
    answer:
      'Yes. Learning is online and flexible, with live and recorded sessions, so you can fit it around your clinical work.',
  },
]

// Fallback for course pages without their own FAQs: the general list minus the course list question.
export const courseFallbackFaqs = generalFaqs.filter((faq) => faq !== whichCoursesFaq)

export const fellowshipFaqs = [
  {
    question: 'Who is eligible for the Fellowship in Clinical Cardiology?',
    answer:
      'The fellowship is designed for medical graduates, including MBBS doctors and specialists, who want to strengthen their skills in clinical cardiology. Eligibility can vary, so please speak with our counsellors to confirm that your qualifications meet the requirements.',
  },
  {
    question: 'Can MBBS doctors apply for the Fellowship in Clinical Cardiology?',
    answer:
      'Yes. Eligible MBBS doctors can apply for the Fellowship in Clinical Cardiology to develop practical skills in cardiovascular diagnosis, ECG interpretation, patient evaluation, and cardiac care.',
  },
  {
    question: 'How can I enroll in the Fellowship in Clinical Cardiology?',
    answer:
      'You can enroll by contacting our counsellors, who will guide you through registration and the documents required. Use the "Talk to Counsellor" button on this page to get started.',
  },
  {
    question: 'What does the Clinical Cardiology Fellowship include?',
    answer:
      'The fellowship covers core areas of clinical cardiology, such as cardiovascular diagnosis, ECG interpretation, patient evaluation, and cardiac care. Learning combines structured sessions, case-based discussions, and assessments to build practical, job-ready skills.',
  },
  {
    question: 'Can practicing doctors join the Clinical Cardiology Fellowship?',
    answer:
      'Yes. The fellowship is well suited to practicing doctors who want to upgrade their cardiology knowledge alongside their clinical work. Our counsellors can help you plan your learning around your practice schedule.',
  },
]

// Course-specific FAQs, keyed by API slug. Courses not listed here use courseFallbackFaqs.
// TODO: write course-specific FAQs for:
//   fellowship-in-cardiac-surgery, fellowship-in-preventive-cardiology,
//   fellowship-in-pediatric-cardiology, fellowship-in-pediatric-echocardiography,
//   fellowship-in-neonatal-echocardiography, fellowship-in-echocardiography,
//   fellowship-in-cardiothoracic-surgery, pg-diploma-in-echocardiography,
//   pg-diploma-in-clinical-cardiology, certificate-in-clinical-cardiology,
//   fellowship-in-pediatric-cardiac-surgery, fellowship-in-cardiovascular,
//   fellowship-in-minimally-invasive-cardiac-surgery, fellowship-in-cardiac-intervention,
//   fellowship-in-fetal-echocardiography, certificate-in-echocardiography,
//   certificate-in-ecg-interpretation, fellowship-in-interventional-cardiology
export const courseFaqs = {
  'fellowship-in-clinical-cardiology': fellowshipFaqs,
}
