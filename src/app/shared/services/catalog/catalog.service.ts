import { Injectable } from '@angular/core';
import { StoreBanner, StoreCategory, StoreOffer, StorePackage, StoreTest } from '../../models/storefront.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {

  /* ─────────────── CATEGORIES ─────────────── */
  getCategories(): StoreCategory[] {
    return [
      { id: 'blood',    code: 'BLOOD',    name: 'Blood Tests',       description: 'CBC, ESR, Blood Group & more',      icon: 'bloodtype' },
      { id: 'fullbody', code: 'FULLBODY', name: 'Full Body Checkup', description: 'Complete wellness packages',         icon: 'health_and_safety' },
      { id: 'diabetes', code: 'DIABETES', name: 'Diabetes',          description: 'Sugar, HbA1c, Insulin',             icon: 'vaccines' },
      { id: 'thyroid',  code: 'THYROID',  name: 'Thyroid',           description: 'TSH, T3, T4 panels',               icon: 'monitor_heart' },
      { id: 'heart',    code: 'HEART',    name: 'Heart',             description: 'Cardiac risk & cholesterol',        icon: 'favorite' },
      { id: 'liver',    code: 'LIVER',    name: 'Liver',             description: 'LFT, SGOT, SGPT markers',          icon: 'science' },
      { id: 'kidney',   code: 'KIDNEY',   name: 'Kidney',            description: 'KFT, Creatinine, Urea',            icon: 'water_drop' },
      { id: 'vitamin',  code: 'VITAMIN',  name: 'Vitamins',          description: 'D, B12, Iron & essentials',        icon: 'sunny' },
    ];
  }

  /* ─────────────── ALL TESTS (DUMMY DATA) ─────────────── */
  getAllTests(): StoreTest[] {
    return [

      /* ── BLOOD TESTS ── */
      {
        id: 't_cbc',
        name: 'Complete Blood Count (CBC)',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Full blood picture — checks for anaemia, infection, clotting issues and more.',
        price: 499, discountPrice: 349, rating: 4.8,
        trustBadges: ['NABL', 'FastReports', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '24 Parameters',
        included: ['Haemoglobin', 'RBC', 'WBC', 'Platelets', 'Hematocrit', 'MCV', 'MCH', 'MCHC'],
      },
      {
        id: 't_esr',
        name: 'ESR (Erythrocyte Sedimentation Rate)',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Detects inflammation in the body — useful for arthritis, infections & autoimmune disorders.',
        price: 199, discountPrice: 149, rating: 4.5,
        trustBadges: ['NABL'],
        reportTime: '4 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_bloodgroup',
        name: 'Blood Group & Rh Typing',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Determine your ABO blood group and Rh factor. Essential for transfusions & pregnancy.',
        price: 150, discountPrice: 99, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '2 hrs', fastingRequired: false, parametersCount: '2 Parameters',
      },
      {
        id: 't_hemoglobin',
        name: 'Haemoglobin (Hb)',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Screen for anaemia quickly. Low Hb causes fatigue, dizziness and weakness.',
        price: 120, discountPrice: 89, rating: 4.4,
        trustBadges: ['FastReports'],
        reportTime: '2 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_wbc_diff',
        name: 'WBC Differential Count',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Breaks down white blood cell types to detect bacterial or viral infections.',
        price: 299, discountPrice: 199, rating: 4.5,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '6 hrs', fastingRequired: false, parametersCount: '8 Parameters',
      },
      {
        id: 't_platelet',
        name: 'Platelet Count',
        categoryId: 'blood', categoryTitle: 'Blood Tests',
        description: 'Checks for dengue, ITP, and bleeding disorders with a simple platelet count.',
        price: 180, discountPrice: 129, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '4 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },

      /* ── FULL BODY CHECKUP ── */
      {
        id: 't_basic_health',
        name: 'Basic Health Checkup',
        categoryId: 'fullbody', categoryTitle: 'Full Body Checkup',
        description: 'Entry-level wellness screen — CBC, sugar, liver, kidney and urine in one package.',
        price: 1499, discountPrice: 999, rating: 4.7,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '59 Parameters',
        included: ['CBC', 'Blood Sugar', 'LFT', 'KFT', 'Urine Routine'],
      },
      {
        id: 't_smart_health',
        name: 'Smart Health Advance',
        categoryId: 'fullbody', categoryTitle: 'Full Body Checkup',
        description: 'Comprehensive annual checkup — includes thyroid, vitamins, cardiac and hormones.',
        price: 3499, discountPrice: 1999, rating: 4.8,
        trustBadges: ['NABL', 'HomeCollection', 'FastReports'],
        reportTime: '48 hrs', fastingRequired: true, parametersCount: '92 Parameters',
        included: ['CBC', 'Thyroid', 'Lipid', 'LFT', 'KFT', 'Vitamin D', 'B12', 'HbA1c'],
      },
      {
        id: 't_senior_checkup',
        name: 'Senior Citizen Checkup',
        categoryId: 'fullbody', categoryTitle: 'Full Body Checkup',
        description: 'Curated for 50+ — checks heart, diabetes, kidney, bones and immunity levels.',
        price: 2999, discountPrice: 1799, rating: 4.7,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '48 hrs', fastingRequired: true, parametersCount: '78 Parameters',
      },
      {
        id: 't_women_wellness',
        name: "Women's Wellness Package",
        categoryId: 'fullbody', categoryTitle: 'Full Body Checkup',
        description: 'Thyroid, iron, hormones, vitamins, and PCOS markers — made for women.',
        price: 2499, discountPrice: 1499, rating: 4.8,
        trustBadges: ['NABL', 'HomeCollection', 'FastReports'],
        reportTime: '48 hrs', fastingRequired: true, parametersCount: '65 Parameters',
      },

      /* ── DIABETES ── */
      {
        id: 't_hba1c',
        name: 'HbA1c (Glycated Haemoglobin)',
        categoryId: 'diabetes', categoryTitle: 'Diabetes',
        description: '3-month average blood sugar — the gold standard for diabetes monitoring.',
        price: 799, discountPrice: 549, rating: 4.7,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_fbs',
        name: 'Fasting Blood Sugar (FBS)',
        categoryId: 'diabetes', categoryTitle: 'Diabetes',
        description: 'Measures glucose after 8 hrs fasting to screen for diabetes and pre-diabetes.',
        price: 120, discountPrice: 89, rating: 4.5,
        trustBadges: ['FastReports'],
        reportTime: '2 hrs', fastingRequired: true, parametersCount: '1 Parameter',
      },
      {
        id: 't_ppbs',
        name: 'Post-Prandial Blood Sugar (PPBS)',
        categoryId: 'diabetes', categoryTitle: 'Diabetes',
        description: 'Blood sugar 2 hrs after a meal — checks how your body handles glucose.',
        price: 120, discountPrice: 89, rating: 4.4,
        trustBadges: ['FastReports'],
        reportTime: '2 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_insulin',
        name: 'Insulin (Fasting)',
        categoryId: 'diabetes', categoryTitle: 'Diabetes',
        description: 'Measures insulin levels to assess insulin resistance — key for PCOS & type 2 diabetes.',
        price: 899, discountPrice: 649, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '1 Parameter',
      },
      {
        id: 't_diabetes_panel',
        name: 'Diabetes Care Panel',
        categoryId: 'diabetes', categoryTitle: 'Diabetes',
        description: 'Complete diabetes management: FBS, PPBS, HbA1c, kidney and urine tests.',
        price: 1899, discountPrice: 1199, rating: 4.8,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '16 Parameters',
      },

      /* ── THYROID ── */
      {
        id: 't_tsh',
        name: 'TSH (Thyroid Stimulating Hormone)',
        categoryId: 'thyroid', categoryTitle: 'Thyroid',
        description: 'First-line thyroid test — detects both hypo and hyperthyroidism.',
        price: 399, discountPrice: 249, rating: 4.7,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_thyroid_profile',
        name: 'Thyroid Profile (T3, T4, TSH)',
        categoryId: 'thyroid', categoryTitle: 'Thyroid',
        description: 'Full thyroid function panel — T3, T4 and TSH for metabolism and energy.',
        price: 899, discountPrice: 599, rating: 4.8,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '3 Parameters',
        included: ['T3 (Triiodothyronine)', 'T4 (Thyroxine)', 'TSH'],
      },
      {
        id: 't_anti_tpo',
        name: 'Anti-TPO (Thyroid Antibody)',
        categoryId: 'thyroid', categoryTitle: 'Thyroid',
        description: 'Detects autoimmune thyroid disease — Hashimoto\'s and Graves\' disease.',
        price: 999, discountPrice: 699, rating: 4.5,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_free_t3_t4',
        name: 'Free T3 & Free T4',
        categoryId: 'thyroid', categoryTitle: 'Thyroid',
        description: 'More accurate than total T3/T4 — used for precise thyroid function assessment.',
        price: 799, discountPrice: 549, rating: 4.6,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '2 Parameters',
      },

      /* ── HEART ── */
      {
        id: 't_lipid',
        name: 'Lipid Profile (Cholesterol)',
        categoryId: 'heart', categoryTitle: 'Heart',
        description: 'Full cholesterol breakdown — Total, LDL, HDL, Triglycerides & cardiac risk.',
        price: 899, discountPrice: 599, rating: 4.7,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '9 Parameters',
        included: ['Total Cholesterol', 'LDL', 'HDL', 'VLDL', 'Triglycerides'],
      },
      {
        id: 't_cardiac_risk',
        name: 'Cardiac Risk Panel',
        categoryId: 'heart', categoryTitle: 'Heart',
        description: 'Comprehensive heart health: lipids + hs-CRP + homocysteine + ECG markers.',
        price: 2499, discountPrice: 1499, rating: 4.8,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '15 Parameters',
      },
      {
        id: 't_hs_crp',
        name: 'hs-CRP (High Sensitivity CRP)',
        categoryId: 'heart', categoryTitle: 'Heart',
        description: 'Sensitive marker of inflammation — used to predict heart disease risk.',
        price: 799, discountPrice: 549, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_homocysteine',
        name: 'Homocysteine',
        categoryId: 'heart', categoryTitle: 'Heart',
        description: 'Elevated levels increase heart attack and stroke risk — especially in young patients.',
        price: 1299, discountPrice: 899, rating: 4.5,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '1 Parameter',
      },

      /* ── LIVER ── */
      {
        id: 't_lft',
        name: 'Liver Function Test (LFT)',
        categoryId: 'liver', categoryTitle: 'Liver',
        description: 'Key liver enzymes and bilirubin — detects fatty liver, hepatitis & jaundice.',
        price: 999, discountPrice: 699, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: true, parametersCount: '11 Parameters',
        included: ['SGOT', 'SGPT', 'Alkaline Phosphatase', 'Bilirubin', 'Total Protein', 'Albumin'],
      },
      {
        id: 't_sgot_sgpt',
        name: 'SGOT & SGPT (Liver Enzymes)',
        categoryId: 'liver', categoryTitle: 'Liver',
        description: 'Two most important liver enzymes — elevated levels indicate liver damage.',
        price: 399, discountPrice: 269, rating: 4.5,
        trustBadges: ['FastReports'],
        reportTime: '6 hrs', fastingRequired: false, parametersCount: '2 Parameters',
      },
      {
        id: 't_hep_b',
        name: 'Hepatitis B Surface Antigen (HBsAg)',
        categoryId: 'liver', categoryTitle: 'Liver',
        description: 'Detects active Hepatitis B infection — essential for all adults.',
        price: 399, discountPrice: 279, rating: 4.7,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_hep_c',
        name: 'Hepatitis C Antibody (HCV)',
        categoryId: 'liver', categoryTitle: 'Liver',
        description: 'Screens for Hepatitis C virus infection — often symptom-free for years.',
        price: 499, discountPrice: 349, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },

      /* ── KIDNEY ── */
      {
        id: 't_kft',
        name: 'Kidney Function Test (KFT)',
        categoryId: 'kidney', categoryTitle: 'Kidney',
        description: 'Creatinine, urea, uric acid and electrolytes — full renal function check.',
        price: 999, discountPrice: 749, rating: 4.7,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '12 Parameters',
        included: ['Creatinine', 'Blood Urea Nitrogen', 'Uric Acid', 'Sodium', 'Potassium', 'Chloride'],
      },
      {
        id: 't_creatinine',
        name: 'Serum Creatinine',
        categoryId: 'kidney', categoryTitle: 'Kidney',
        description: 'Most common kidney marker — elevated creatinine signals kidney stress.',
        price: 199, discountPrice: 149, rating: 4.5,
        trustBadges: ['FastReports'],
        reportTime: '4 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_urine_routine',
        name: 'Urine Routine & Microscopy',
        categoryId: 'kidney', categoryTitle: 'Kidney',
        description: 'Detects UTI, protein in urine, kidney stones & early renal disease.',
        price: 199, discountPrice: 149, rating: 4.4,
        trustBadges: ['FastReports'],
        reportTime: '4 hrs', fastingRequired: false, parametersCount: '18 Parameters',
      },
      {
        id: 't_microalbumin',
        name: 'Microalbumin (Urine)',
        categoryId: 'kidney', categoryTitle: 'Kidney',
        description: 'Early sign of diabetic kidney disease — detects protein leakage before symptoms.',
        price: 599, discountPrice: 399, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '24 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },

      /* ── VITAMINS ── */
      {
        id: 't_vitd',
        name: 'Vitamin D (25-OH)',
        categoryId: 'vitamin', categoryTitle: 'Vitamins',
        description: 'Important for bones, immunity and mood — deficiency is extremely common in India.',
        price: 1499, discountPrice: 999, rating: 4.7,
        trustBadges: ['NABL', 'FastReports'],
        reportTime: '48 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_vitb12',
        name: 'Vitamin B12',
        categoryId: 'vitamin', categoryTitle: 'Vitamins',
        description: 'Deficiency causes tingling, fatigue and nerve damage — very common in vegetarians.',
        price: 799, discountPrice: 549, rating: 4.7,
        trustBadges: ['NABL'],
        reportTime: '48 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_iron',
        name: 'Iron Studies (Fe, TIBC, Ferritin)',
        categoryId: 'vitamin', categoryTitle: 'Vitamins',
        description: 'Full iron panel — detects iron-deficiency anaemia and iron overload.',
        price: 999, discountPrice: 699, rating: 4.6,
        trustBadges: ['NABL'],
        reportTime: '48 hrs', fastingRequired: true, parametersCount: '4 Parameters',
      },
      {
        id: 't_folate',
        name: 'Folate (Folic Acid)',
        categoryId: 'vitamin', categoryTitle: 'Vitamins',
        description: 'Critical during pregnancy — deficiency causes neural tube defects and anaemia.',
        price: 799, discountPrice: 599, rating: 4.5,
        trustBadges: ['NABL'],
        reportTime: '48 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
      {
        id: 't_calcium',
        name: 'Calcium (Serum)',
        categoryId: 'vitamin', categoryTitle: 'Vitamins',
        description: 'Checks bone health, muscle function and parathyroid activity.',
        price: 250, discountPrice: 179, rating: 4.4,
        trustBadges: ['FastReports'],
        reportTime: '6 hrs', fastingRequired: false, parametersCount: '1 Parameter',
      },
    ];
  }

  /* ─────────────── CONVENIENCE FILTERS ─────────────── */
  getFeaturedTests(): StoreTest[] {
    const ids = ['t_cbc', 't_hba1c', 't_thyroid_profile', 't_vitd', 't_lipid', 't_kft', 't_lft', 't_smart_health'];
    return this.getAllTests().filter(t => ids.includes(t.id));
  }

  getTestsByCategory(categoryId: string): StoreTest[] {
    if (!categoryId) return this.getAllTests();
    return this.getAllTests().filter(t => t.categoryId === categoryId);
  }

  /* ─────────────── BANNERS ─────────────── */
  getBanners(): StoreBanner[] {
    return [
      { id: 'b1', title: 'Full Body Checkup', subtitle: 'Up to 35% off • Free home sample collection', ctaLabel: 'Book Now', ctaLink: '/layout/tests', theme: 'mint' },
      { id: 'b2', title: 'Diabetes Care',      subtitle: 'HbA1c + Sugar + Lipid Profile in one smart package', ctaLabel: 'Book Now', ctaLink: '/layout/tests', theme: 'blue' },
      { id: 'b3', title: 'Women Wellness',     subtitle: 'Hormones • Vitamins • Thyroid — curated for you', ctaLabel: 'Book Now', ctaLink: '/layout/tests', theme: 'violet' },
    ];
  }

  /* ─────────────── PACKAGES ─────────────── */
  getPopularPackages(): StorePackage[] {
    return [
      { id: 'p_basic',    name: 'Smart Health Basic',   description: 'A compact package for routine wellness screening.',        price: 1999, discountPrice: 1299, includesCount: 59, reportTime: '24-48 hrs', highlight: 'Most booked' },
      { id: 'p_diabetes', name: 'Diabetes Care Plus',   description: 'Ideal for diabetes monitoring and cardiac risk.',          price: 2499, discountPrice: 1699, includesCount: 71, reportTime: '24-48 hrs', highlight: 'Doctor recommended' },
      { id: 'p_wellness', name: 'Full Body Advance',    description: 'Comprehensive health check with vitamins & thyroid.',      price: 3999, discountPrice: 2599, includesCount: 92, reportTime: '24-48 hrs' },
    ];
  }

  /* ─────────────── OFFERS ─────────────── */
  getOffers(): StoreOffer[] {
    return [
      { id: 'o1', title: 'Extra 10% off on ₹1499+', description: 'Use code on checkout to save more.', code: 'HEALTH10', ctaLabel: 'Apply on cart', theme: 'green' },
      { id: 'o2', title: 'Free doctor consult',       description: 'On select full body packages this week.', theme: 'blue' },
      { id: 'o3', title: 'Senior citizen offer',       description: 'Special pricing on senior care packages.',               theme: 'amber' },
      { id: 'o4', title: 'Women wellness combo',       description: 'Save big on thyroid + vitamins combo.',                  theme: 'violet' },
    ];
  }
}
