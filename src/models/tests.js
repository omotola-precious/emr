export const tests = {
  fbc: {
    name: 'Full Blood Count',
    wcc: -1,
    pcv: -1,
    platelet: -1
  },
  lft: {
    name: 'Liver Function Test',
    ast: -1,
    alt: -1,
    ggt: -1,
    albumin: -1,
    bilirubin: -1,
    alp: -1
  },
  eucr: {
    name: 'Electrolytes, Urea and Creatinine',
    na: -1,
    k: -1,
    cl: -1,
    hco3: -1,
    urea: -1,
    cr: -1
  },
  flp: {
    name: 'Fasting Lipid Profile',
    hdl: -1,
    ldl: -1,
    total_cholesterol: -1,
    triglycerides: -1
  },
  fbg: {
    name: 'Fasting Blood Glucose',
    fbg: -1
  },
  ubt: {
    name: 'Urea Breath Test',
    findings: ['Positive', 'Negative']
  },
  ugie: {
    name: 'Upper GI Endoscopy',
    findings: ''
  },
  colonoscopy: {
    name: 'Colonoscopy',
    findings: ''
  },
  abd_uss: {
    name: 'Abdominal Ultrasound',
    findings: ''
  },
  abd_ct: {
    name: 'Abdominal CT',
    findings: ''
  },
  mrcp: {
    name: 'Magnetic Resonance Cholangiopancreatography',
    findings: ''
  },
  ercp: {
    name: 'Endoscopic Retrograde Cholangiopancreatography',
    findings: ''
  },
  tumour_markers: {
    name: 'Tumour Markers',
    cea: -1,
    ca199: -1,
    afp: -1,
    ca125: -1
  },
  viral_screening: {
    name: 'Viral Screening',
    hbsag: ['Positive', 'Negative'],
    antihbc: ['Positive', 'Negative'],
    antihcv: ['Positive', 'Negative']
  },
  autoantibodies: {
    name: 'Autoantibodies',
    ana: -1,
    crp: -1,
    esr: -1
  },
  ptinr: {
    name: 'PT/INR',
    value: -1
  },
  blood_culture: {
    name: 'Blood Culture',
    findings: ''
  },
  saag: {
    name: 'Serum Ascites Albumin Gradient',
    value: -1
  },
  amylase: {
    name: 'Amylase',
    value: -1
  },
  lipase: {
    name: 'Lipase',
    value: -1
  },
  ascitic_fluid_analysis: {
    name: 'Ascitic Fluid Analysis',
    findings: ''
  },
  stool_antigen: {
    name: 'Stool Antigen',
    findings: ''
  }
}

export function getForStorage(dictionary, key, section) {
  /*

  The purpose of this function is to convert templates for clerking into
  format that can be stored in the patient's data.

  parameters:
    dictionary:
      type: object
      description: object of symptoms, signs and tests.

    key:
      type: string
      description: key used to access the specific symptom, sign or test from
        the dictionary above.
    
    section:
      type: string
      description: used as a key on the dictionary to set it to the key parameter

  */

  // symptom, sign or test
  key = key.toLowerCase();
  const item = dictionary[key.replace(/ /g, "_")];

  for (const key in item) {
    if(Object.hasOwn(item, key)) {
      this[key] = typeof item[key] === 'boolean' ? false : "";
    }
  }
  
  this.name = item.name;
  
  this[section] = key;
  return this;
}