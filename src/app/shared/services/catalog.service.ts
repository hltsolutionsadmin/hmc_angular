import { Injectable } from '@angular/core';
import { StoreBanner, StoreCategory, StoreOffer, StorePackage, StoreTest } from '../models/storefront';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  getBanners(): StoreBanner[] {
    return [
      {
        id: 'b1',
        title: 'Full Body Checkup',
        subtitle: 'Up to 35% off • Free home sample collection',
        ctaLabel: 'Explore packages',
        ctaLink: '/layout/tests',
        theme: 'mint'
      },
      {
        id: 'b2',
        title: 'Diabetes Care',
        subtitle: 'HbA1c + Sugar + Lipid Profile in one smart package',
        ctaLabel: 'Shop diabetes tests',
        ctaLink: '/layout/tests?cat=diabetes',
        theme: 'blue'
      },
      {
        id: 'b3',
        title: 'Women Wellness',
        subtitle: 'Hormones • Vitamins • Thyroid — curated for you',
        ctaLabel: 'View recommendations',
        ctaLink: '/layout/tests?cat=women',
        theme: 'violet'
      }
    ];
  }

  // getCategories(): StoreCategory[] {
  //   return [
  //     { id: 'blood', title: 'Blood Tests', description: 'CBC, Lipid, LFT & more', icon: 'bloodtype' },
  //     { id: 'thyroid', title: 'Thyroid', description: 'TSH, T3, T4 panels', icon: 'monitor_heart' },
  //     { id: 'diabetes', title: 'Diabetes', description: 'Sugar, HbA1c, Insulin', icon: 'vaccines' },
  //     { id: 'fullbody', title: 'Full Body', description: 'Complete health packages', icon: 'health_and_safety' },
  //     { id: 'vitamin', title: 'Vitamins', description: 'D, B12 and essentials', icon: 'sunny' },
  //     { id: 'hormone', title: 'Hormones', description: 'Hormonal wellness tests', icon: 'spa' },
  //     { id: 'liver', title: 'Liver', description: 'LFT & related markers', icon: 'science' },
  //     { id: 'kidney', title: 'Kidney', description: 'KFT & renal profile', icon: 'water_drop' },
  //     { id: 'heart', title: 'Heart', description: 'Cardiac risk checks', icon: 'favorite' },
  //     { id: 'women', title: 'Women Health', description: 'PCOS, thyroid & more', icon: 'female' },
  //     { id: 'men', title: 'Men Health', description: 'Fitness & wellness', icon: 'male' },
  //     { id: 'senior', title: 'Senior Care', description: 'Age-friendly packages', icon: 'elderly' }
  //   ];
  // }

  getFeaturedTests(): StoreTest[] {
    return [
      {
        id: 't_cbc',
        name: 'Complete Blood Count (CBC)',
        categoryId: 'blood',
        categoryTitle: 'Blood Tests',
        description: 'Quick snapshot of your overall health — anemia',
        price: 499,
        discountPrice: 349,
        rating: 4.7,
        trustBadges: ['NABL', 'FastReports', 'HomeCollection'],
        reportTime: '24 hrs',
        fastingRequired: false,
        parametersCount: "available",
        included: ['Hemoglobin', 'RBC', 'WBC', 'Platelets', 'Hematocrit']
      },
      {
        id: 't_hba1c',
        name: 'HbA1c (Glycated Hemoglobin)',
        categoryId: 'diabetes',
        categoryTitle: 'Diabetes',
        description: '3-month average blood sugar indicator.',
        price: 799,
        discountPrice: 549,
        rating: 4.6,
        trustBadges: ['Trusted', 'FastReports'],
        reportTime: '24 hrs',
        fastingRequired: false,
        parametersCount: "available"
      },
      {
        id: 't_thyroid',
        name: 'Thyroid Profile (T3, T4, TSH)',
        categoryId: 'thyroid',
        categoryTitle: 'Thyroid',
        description: 'Balanced thyroid screening for metabolism & energy.',
        price: 899,
        discountPrice: 599,
        rating: 4.5,
        trustBadges: ['NABL', 'HomeCollection'],
        reportTime: '24 hrs',
        fastingRequired: false,
        parametersCount: "available"
      },
      {
        id: 't_vitd',
        name: 'Vitamin D (25-OH)',
        categoryId: 'vitamin',
        categoryTitle: 'Vitamins',
        description: 'Important for bones, immunity and mood.',
        price: 1499,
        discountPrice: 999,
        rating: 4.7,
        trustBadges: ['FastReports'],
        reportTime: '48 hrs',
        fastingRequired: false,
        parametersCount: "available"
      }
    ];
  }

  getPopularPackages(): StorePackage[] {
    return [
      {
        id: 'p_basic',
        name: 'Smart Health Basic',
        description: 'A compact package for routine wellness screening.',
        price: 1999,
        discountPrice: 1299,
        includesCount: 59,
        reportTime: '24-48 hrs',
        highlight: 'Most booked'
      },
      {
        id: 'p_diabetes',
        name: 'Diabetes Care Plus',
        description: 'Ideal for diabetes monitoring and cardiac risk.',
        price: 2499,
        discountPrice: 1699,
        includesCount: 71,
        reportTime: '24-48 hrs',
        highlight: 'Doctor recommended'
      },
      {
        id: 'p_wellness',
        name: 'Full Body Advance',
        description: 'Comprehensive health check with vitamins & thyroid.',
        price: 3999,
        discountPrice: 2599,
        includesCount: 92,
        reportTime: '24-48 hrs'
      }
    ];
  }

  getOffers(): StoreOffer[] {
    return [
      { id: 'o1', title: 'Extra 10% off on ₹1499+', description: 'Use code on checkout to save more.', code: 'HEALTH10', ctaLabel: 'Apply on cart', theme: 'green' },
      { id: 'o2', title: 'Free doctor consult', description: 'On select full body packages this week.', theme: 'blue' },
      { id: 'o3', title: 'Senior citizen offer', description: 'Special pricing on senior care packages.', theme: 'amber' },
      { id: 'o4', title: 'Women wellness combo', description: 'Save big on thyroid + vitamins combo.', theme: 'violet' }
    ];
  }

  getAllTests(): StoreTest[] {
    const featured = this.getFeaturedTests();
    return [
      ...featured,
      {
        id: 't_lft',
        name: 'Liver Function Test (LFT)',
        categoryId: 'liver',
        categoryTitle: 'Liver',
        description: 'Key liver enzymes and bilirubin markers.',
        price: 999,
        discountPrice: 699,
        rating: 4.4,
        trustBadges: ['NABL'],
        reportTime: '24 hrs',
        fastingRequired: true,
        parametersCount: "available"
      },
      {
        id: 't_kft',
        name: 'Kidney Function Test (KFT)',
        categoryId: 'kidney',
        categoryTitle: 'Kidney',
        description: 'Creatinine, urea and electrolyte screening.',
        price: 999,
        discountPrice: 749,
        rating: 4.5,
        trustBadges: ['Trusted'],
        reportTime: '24 hrs',
        fastingRequired: false,
        parametersCount: "available"
      },
      {
        id: 't_lipid',
        name: 'Lipid Profile',
        categoryId: 'heart',
        categoryTitle: 'Heart',
        description: 'Cholesterol breakdown and cardiac risk score.',
        price: 899,
        discountPrice: 599,
        rating: 4.6,
        trustBadges: ['FastReports'],
        reportTime: '24 hrs',
        fastingRequired: true,
        parametersCount: "available"
      }
    ];
  }
}

