export interface YogaPoseDefinition {
  id: string;
  name: string;
  sanskritName: string;
  category: 'Asana' | 'Pranayama' | 'Restorative' | 'Flow' | 'Inversion';
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  targetOrgans: string[];
  clinicalCategory: 'hypertension' | 'diabetes' | 'spine_joint' | 'stress_sleep' | 'core_balance';
  recommendedHoldSeconds: number;
  caloriesPerMinute: number;
  videoEmbedId: string;
  videoUrl: string;
  alignmentCheckpoints: string[];
  svgIcon: string;
}

export const YOGA_POSES_DATABASE: YogaPoseDefinition[] = [
  {
    id: 'tadasana',
    name: 'Mountain Pose',
    sanskritName: 'Tāḍāsana (ताड़ासन)',
    category: 'Asana',
    level: 'Beginner',
    targetOrgans: ['Spine', 'Ankles', 'Proprioception', 'Pelvic Floor'],
    clinicalCategory: 'spine_joint',
    recommendedHoldSeconds: 60,
    caloriesPerMinute: 3.0,
    videoEmbedId: 'E1xym-F_B84',
    videoUrl: 'https://www.youtube.com/watch?v=E1xym-F_B84',
    alignmentCheckpoints: [
      'Root down evenly through the big toe ball, pinky toe ball, and both heel corners.',
      'Engage quadriceps softly to lift the kneecaps without hyperextending.',
      'Lengthen tailbone downward while drawing lower belly in toward spine.',
      'Roll shoulders up, back, and gently down; reach crown of head skyward.'
    ],
    svgIcon: 'tadasana'
  },
  {
    id: 'vrikshasana',
    name: 'Tree Pose',
    sanskritName: 'Vṛkṣāsana (वृक्षासन)',
    category: 'Asana',
    level: 'Beginner',
    targetOrgans: ['Neuromuscular Pathways', 'Hip Abductors', 'Ankles'],
    clinicalCategory: 'core_balance',
    recommendedHoldSeconds: 45,
    caloriesPerMinute: 3.5,
    videoEmbedId: 'wdln9qWYloU',
    videoUrl: 'https://www.youtube.com/watch?v=wdln9qWYloU',
    alignmentCheckpoints: [
      'Fix gaze onto an unmoving point (Drishti) at eye level.',
      'Press standing foot firmly into mat while lifting inner arch.',
      'Place sole of lifted foot against inner calf or inner thigh — never on knee joint.',
      'Bring hands to heart center (Anjali Mudra) or extend arms overhead in a gentle V.'
    ],
    svgIcon: 'vrikshasana'
  },
  {
    id: 'bhujangasana',
    name: 'Cobra Pose',
    sanskritName: 'Bhujaṅgāsana (भुजंगासन)',
    category: 'Asana',
    level: 'Beginner',
    targetOrgans: ['Spinal Extensors', 'Thorax', 'Kidneys', 'Adrenal Glands'],
    clinicalCategory: 'spine_joint',
    recommendedHoldSeconds: 40,
    caloriesPerMinute: 4.2,
    videoEmbedId: 'Y8UNFem5qHc',
    videoUrl: 'https://www.youtube.com/watch?v=Y8UNFem5qHc',
    alignmentCheckpoints: [
      'Lie face down, tops of feet grounded, hands under shoulders.',
      'Hug elbows tight against the ribs; draw shoulder blades down away from ears.',
      'Inhale and lift the sternum forward and up using spinal erector muscles.',
      'Keep pubic bone anchored to the mat to protect the lower lumbar spine.'
    ],
    svgIcon: 'bhujangasana'
  },
  {
    id: 'balasana',
    name: "Child's Pose",
    sanskritName: 'Bālāsana (बालासन)',
    category: 'Restorative',
    level: 'All Levels',
    targetOrgans: ['Lumbar Spine', 'Vagus Nerve', 'Hip Rotators', 'Sacrum'],
    clinicalCategory: 'stress_sleep',
    recommendedHoldSeconds: 90,
    caloriesPerMinute: 2.2,
    videoEmbedId: '2MJGg-dUKh0',
    videoUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
    alignmentCheckpoints: [
      'Big toes touch together, knees opened wide to accommodate ribs.',
      'Sink hips deeply back onto the heels without straining.',
      'Walk fingertips forward and gently rest forehead on the mat.',
      'Direct slow diaphragmatic breaths into the back ribs and kidneys.'
    ],
    svgIcon: 'balasana'
  },
  {
    id: 'adho_mukha_svanasana',
    name: 'Downward Dog Pose',
    sanskritName: 'Adho Mukha Śvānāsana (अधोमुख श्वानासन)',
    category: 'Inversion',
    level: 'Intermediate',
    targetOrgans: ['Hamstrings', 'Cerebral Circulation', 'Shoulder Girdle', 'Lats'],
    clinicalCategory: 'spine_joint',
    recommendedHoldSeconds: 60,
    caloriesPerMinute: 4.8,
    videoEmbedId: 'Y0GDgQqt-bA',
    videoUrl: 'https://www.youtube.com/watch?v=Y0GDgQqt-bA',
    alignmentCheckpoints: [
      'Spread fingers wide with index fingers pointing straight forward.',
      'Press through index knuckles and thumb webs to protect the wrists.',
      'Send sitting bones up and back, forming an inverted V-shape.',
      'Pedal heels gently toward the floor; bend knees if hamstrings are tight.'
    ],
    svgIcon: 'adho_mukha_svanasana'
  },
  {
    id: 'setu_bandhasana',
    name: 'Bridge Pose',
    sanskritName: 'Setu Bandhāsana (सेतुबंधासन)',
    category: 'Asana',
    level: 'Beginner',
    targetOrgans: ['Thyroid', 'Posterior Chain', 'Gluteals', 'Heart'],
    clinicalCategory: 'hypertension',
    recommendedHoldSeconds: 45,
    caloriesPerMinute: 4.0,
    videoEmbedId: 'ju3-J4lIOVY',
    videoUrl: 'https://www.youtube.com/watch?v=ju3-J4lIOVY',
    alignmentCheckpoints: [
      'Feet parallel and hip-width apart, knees directly stacked above ankles.',
      'Press through heels to lift hips, keeping thighs parallel.',
      'Interlace fingers under sacrum and roll upper arm bones inward.',
      'Keep chin slightly lifted off chest to protect cervical spine.'
    ],
    svgIcon: 'setu_bandhasana'
  },
  {
    id: 'trikonasana',
    name: 'Triangle Pose',
    sanskritName: 'Trikoṇāsana (त्रिकोणासन)',
    category: 'Asana',
    level: 'Intermediate',
    targetOrgans: ['Thoracic Spine', 'Obliques', 'Hamstrings', 'Abdominal Organs'],
    clinicalCategory: 'spine_joint',
    recommendedHoldSeconds: 45,
    caloriesPerMinute: 4.2,
    videoEmbedId: 'h60lC7mCaFA',
    videoUrl: 'https://www.youtube.com/watch?v=h60lC7mCaFA',
    alignmentCheckpoints: [
      'Front foot turned out 90 degrees; back foot angled inward slightly.',
      'Hinge deeply from the front hip crease rather than bending from the waist.',
      'Rest bottom hand on shin or yoga block without collapsing chest forward.',
      'Reach top arm straight to the sky and expand across both collarbones.'
    ],
    svgIcon: 'trikonasana'
  },
  {
    id: 'paschimottanasana',
    name: 'Seated Forward Bend',
    sanskritName: 'Paścimottānāsana (पश्चिमोत्तानासन)',
    category: 'Asana',
    level: 'Beginner',
    targetOrgans: ['Pancreatic Beta Cells', 'Hamstrings', 'Parasympathetic System'],
    clinicalCategory: 'diabetes',
    recommendedHoldSeconds: 60,
    caloriesPerMinute: 3.2,
    videoEmbedId: 'wVdOp3h1nog',
    videoUrl: 'https://www.youtube.com/watch?v=wVdOp3h1nog',
    alignmentCheckpoints: [
      'Sit tall with legs straight forward and active flexed feet.',
      'Inhale arms overhead to create length through entire spinal column.',
      'Hinge forward from the pelvic hips leading with sternum, not nose.',
      'Hold onto shins or outer feet; maintain gentle micro-bend in knees if needed.'
    ],
    svgIcon: 'paschimottanasana'
  },
  {
    id: 'viparita_karani',
    name: 'Legs Up the Wall',
    sanskritName: 'Viparīta Karaṇī (विपरीत करणी)',
    category: 'Restorative',
    level: 'All Levels',
    targetOrgans: ['Venous Blood Return', 'Lymphatic Vessels', 'Heart', 'Nervous System'],
    clinicalCategory: 'hypertension',
    recommendedHoldSeconds: 120,
    caloriesPerMinute: 1.8,
    videoEmbedId: 'TzahhHZvOks',
    videoUrl: 'https://www.youtube.com/watch?v=TzahhHZvOks',
    alignmentCheckpoints: [
      'Sit sideways next to a wall, then swing legs up vertically.',
      'Rest lower back flush against the floor or on a folded bolster.',
      'Open arms out at 45 degrees with palms facing upward.',
      'Close eyes, soften jaw, and allow gravity to circulate venous blood smoothly.'
    ],
    svgIcon: 'viparita_karani'
  },
  {
    id: 'marjaryasana_bitilasana',
    name: 'Cat-Cow Flow',
    sanskritName: 'Mārjāryāsana-Biṭilāsana (मार्जariasana-बितिलासन)',
    category: 'Flow',
    level: 'Beginner',
    targetOrgans: ['Intervertebral Discs', 'Abdominal Viscera', 'Neck', 'Spine'],
    clinicalCategory: 'spine_joint',
    recommendedHoldSeconds: 60,
    caloriesPerMinute: 3.5,
    videoEmbedId: 'LIVJZZyZ2qM',
    videoUrl: 'https://www.youtube.com/watch?v=LIVJZZyZ2qM',
    alignmentCheckpoints: [
      'Wrists directly under shoulders, knees directly under hip joints.',
      'Cow: Inhale, dip the belly toward mat, open chest, lift tailbone and gaze.',
      'Cat: Exhale, doming spine toward ceiling, draw navel toward backbone, tuck chin.',
      'Move fluidly with breath rhythm, undulating vertebra by vertebra.'
    ],
    svgIcon: 'marjaryasana'
  },
  {
    id: 'pavanamuktasana',
    name: 'Wind-Relieving Pose',
    sanskritName: 'Pavanamuktāsana (पवनमुक्तासन)',
    category: 'Restorative',
    level: 'Beginner',
    targetOrgans: ['Gastrointestinal Tract', 'Colon', 'Lumbar Spine'],
    clinicalCategory: 'diabetes',
    recommendedHoldSeconds: 60,
    caloriesPerMinute: 2.8,
    videoEmbedId: 'NgfIcmyH2nU',
    videoUrl: 'https://www.youtube.com/watch?v=NgfIcmyH2nU',
    alignmentCheckpoints: [
      'Lie flat on your back, taking a complete relaxed exhalation.',
      'Bend both knees into chest and wrap arms around the shins.',
      'Keep shoulders and back of head flat on the mat without straining neck.',
      'Feel gentle abdominal compression massaging ascending and descending colon.'
    ],
    svgIcon: 'pavanamuktasana'
  },
  {
    id: 'ardha_matsyendrasana',
    name: 'Half Spinal Twist',
    sanskritName: 'Ardha Matsyendrāsana (अर्धमत्स्येन्द्रासन)',
    category: 'Asana',
    level: 'Intermediate',
    targetOrgans: ['Pancreas', 'Liver', 'Gallbladder', 'Spinal Rotators'],
    clinicalCategory: 'diabetes',
    recommendedHoldSeconds: 45,
    caloriesPerMinute: 3.8,
    videoEmbedId: 'wJpyMgbxytU',
    videoUrl: 'https://www.youtube.com/watch?v=wJpyMgbxytU',
    alignmentCheckpoints: [
      'Sit with both sit-bones firmly grounded on the floor.',
      'Cross right foot over left thigh, planting right sole flat on the mat.',
      'Inhale to grow tall through the spine before initiating the twist.',
      'Exhale and twist from thoracic ribcage; place left arm outside right knee.'
    ],
    svgIcon: 'ardha_matsyendrasana'
  },
  {
    id: 'anulom_vilom',
    name: 'Alternate Nostril Pranayama',
    sanskritName: 'Anuloma Viloma (अनुलोम विलोम प्राणायाम)',
    category: 'Pranayama',
    level: 'All Levels',
    targetOrgans: ['Autonomic Nervous System', 'Bronchial Airways', 'Vagus Nerve'],
    clinicalCategory: 'hypertension',
    recommendedHoldSeconds: 120,
    caloriesPerMinute: 2.0,
    videoEmbedId: 'lrkW_6vGqvE',
    videoUrl: 'https://www.youtube.com/watch?v=lrkW_6vGqvE',
    alignmentCheckpoints: [
      'Sit comfortably upright in Sukhasana or on a chair with spine erect.',
      'Right hand in Vishnu Mudra: index and middle fingers folded against palm.',
      'Close right nostril with thumb; inhale smoothly through left for 4 counts.',
      'Close left with ring finger; release thumb and exhale through right for 8 counts.'
    ],
    svgIcon: 'anulom_vilom'
  },
  {
    id: 'surya_namaskar',
    name: 'Sun Salutation Flow',
    sanskritName: 'Sūrya Namaskāra (सूर्य नमस्कार)',
    category: 'Flow',
    level: 'Intermediate',
    targetOrgans: ['Heart', 'Lungs', 'Whole Body Musculature', 'Circulation'],
    clinicalCategory: 'core_balance',
    recommendedHoldSeconds: 90,
    caloriesPerMinute: 5.5,
    videoEmbedId: 'IPuN-b71HgQ',
    videoUrl: 'https://www.youtube.com/watch?v=IPuN-b71HgQ',
    alignmentCheckpoints: [
      'Cycle smoothly through all 12 postures maintaining continuous breath.',
      'Inhale on chest opening expansions (Hastauttanasana, Bhujangasana).',
      'Exhale on forward spinal folds (Padahastasana, Adho Mukha Svanasana).',
      'Maintain steady rhythmic tempo without holding or forcing breath.'
    ],
    svgIcon: 'surya_namaskar'
  },
  {
    id: 'shavasana',
    name: 'Corpse Pose (Restorative)',
    sanskritName: 'Śavāsana (शवासन)',
    category: 'Restorative',
    level: 'All Levels',
    targetOrgans: ['Brain Waves', 'Autonomic Nervous System', 'Systolic Pressure'],
    clinicalCategory: 'stress_sleep',
    recommendedHoldSeconds: 180,
    caloriesPerMinute: 1.5,
    videoEmbedId: 'AEuhWQnUpoc',
    videoUrl: 'https://www.youtube.com/watch?v=AEuhWQnUpoc',
    alignmentCheckpoints: [
      'Lie completely flat with legs comfortably separated, feet falling open naturally.',
      'Arms away from body with palms turned upward toward the sky.',
      'Systematically scan and soften forehead, eyes, jaw, shoulders, and hips.',
      'Surrender all conscious control of the breath; rest in natural quiet stillness.'
    ],
    svgIcon: 'shavasana'
  }
];

export const CLINICAL_FOCUS_AREAS = [
  {
    id: 'all',
    label: 'All Therapeutic Poses',
    description: 'Complete classical repertoire of therapeutic asanas and pranayama',
    color: 'emerald'
  },
  {
    id: 'hypertension',
    label: 'Blood Pressure & Heart',
    description: 'Vagus nerve stimulation, venous drainage, and systolic reduction',
    color: 'rose'
  },
  {
    id: 'diabetes',
    label: 'Diabetes & Digestion',
    description: 'Abdominal compression and pancreatic beta-cell stimulation',
    color: 'amber'
  },
  {
    id: 'spine_joint',
    label: 'Spine & Joint Health',
    description: 'Disc hydration, postural decompression, and arthritis care',
    color: 'blue'
  },
  {
    id: 'stress_sleep',
    label: 'Stress, Anxiety & Insomnia',
    description: 'Parasympathetic downregulation and nervous system relaxation',
    color: 'indigo'
  },
  {
    id: 'core_balance',
    label: 'Balance & Fall Prevention',
    description: 'Proprioception, single-leg stability, and vestibular strength',
    color: 'purple'
  }
];

export function getPoseById(id?: string): YogaPoseDefinition | undefined {
  if (!id) return undefined;
  return YOGA_POSES_DATABASE.find((p) => p.id.toLowerCase() === id.toLowerCase());
}
