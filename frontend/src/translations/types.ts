export interface TranslationSchema {
  // First-time language selection
  select_language_title: string;
  select_language_subtitle: string;
  continue: string;
  current_language: string;
  change_language: string;
  language_settings: string;
  language_settings_desc: string;

  // Navigation
  nav_dashboard: string;
  nav_reports: string;
  nav_chat: string;
  nav_symptoms: string;
  nav_risk: string;
  nav_diet: string;
  nav_exercise: string;
  nav_health: string;
  nav_profile: string;
  nav_admin: string;
  nav_logout: string;
  nav_daily_tip: string;
  nav_daily_tip_desc: string;
  active_status: string;

  // Common UI & Actions
  save: string;
  saving: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  download: string;
  upload: string;
  submit: string;
  search: string;
  loading: string;
  success: string;
  error: string;
  disclaimer: string;
  view_details: string;
  back: string;
  next: string;
  close: string;
  retry: string;

  // Medical Conditions & Diseases
  heart_disease: string;
  diabetes: string;
  stroke: string;
  hypertension: string;
  comprehensive_risk: string;
  fever: string;
  cough: string;
  headache: string;
  chest_pain: string;
  fatigue: string;

  // Risk Levels & Statuses
  low_risk: string;
  moderate_risk: string;
  high_risk: string;
  critical_risk: string;
  normal: string;
  elevated: string;
  abnormal: string;
  attention_required: string;

  // Health Metrics
  blood_pressure: string;
  heart_rate: string;
  blood_glucose: string;
  hba1c: string;
  cholesterol: string;
  weight: string;
  sleep: string;
  water_intake: string;
  steps: string;
  bmi: string;

  // Medical Reports
  reports_title: string;
  reports_subtitle: string;
  upload_new_report: string;
  compare_reports: string;
  report_date: string;
  report_type: string;
  report_status: string;
  ai_summary: string;
  key_biomarkers: string;
  doctor_questions: string;
  reference_range: string;
  extracted_value: string;
  translate_report: string;
  original_english: string;

  // AI Assistant Chat
  chat_title: string;
  chat_subtitle: string;
  chat_placeholder: string;
  new_conversation: string;
  past_conversations: string;
  chat_how_can_help: string;
  chat_empty_sub: string;
  voice_auto_read: string;
  voice_listening: string;
  citations: string;

  // Symptoms Helper
  symptoms_title: string;
  symptoms_subtitle: string;
  select_symptoms: string;
  symptom_severity: string;
  duration_days: string;
  analyze_symptoms: string;
  triage_result: string;
  recommended_specialist: string;
  immediate_actions: string;
  red_flags: string;
  mild: string;
  moderate: string;
  severe: string;

  // Meal & Diet Plan
  diet_title: string;
  diet_subtitle: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  diet_preferences: string;
  generate_diet_plan: string;

  // Exercise & Yoga
  exercise_title: string;
  exercise_subtitle: string;
  yoga_therapy: string;
  asanas: string;
  duration_minutes: string;
  intensity_level: string;
  instructions: string;
  breathing_cue: string;
  benefits: string;
  precautions: string;
  generate_workout_plan: string;

  // Daily Tracker
  tracker_title: string;
  tracker_subtitle: string;
  log_vitals: string;
  vitals_history: string;
  daily_goal: string;
  today_progress: string;

  // Profile
  profile_title: string;
  profile_subtitle: string;
  personal_info: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  blood_group: string;
  emergency_contact: string;
  allergies: string;
  existing_conditions: string;
  profile_updated_success: string;
}
