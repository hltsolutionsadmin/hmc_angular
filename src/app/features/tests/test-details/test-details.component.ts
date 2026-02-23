import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TestItem {
  id: number;
  name: string;
  category: string;
  description: string;
  detailedDescription: string;
  price: number;
  sampleRequired: boolean;
  tat: string;
  isActive: boolean;
  preparationInstructions?: string;
  testIncludes?: string[];
  reportDelivery?: string;
  clinicalSignificance?: string;
}

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css']
})
export class TestDetailsComponent implements OnInit {
  test: TestItem | undefined;
  testId: number = 0;
  
  // Dummy test data - in a real app, this would come from a service
  private testData: TestItem[] = [
    {
      id: 1, 
      name: 'CBC', 
      category: 'Blood Test', 
      description: 'Complete Blood Count',
      detailedDescription: 'A Complete Blood Count (CBC) is a common blood test that evaluates your overall health and detects a wide range of disorders, including anemia, infection, and leukemia.',
      price: 450, 
      sampleRequired: true, 
      tat: '24 hrs', 
      isActive: true,
      preparationInstructions: 'Fasting is not required for this test. No special preparation is needed.',
      testIncludes: ['Red blood cell count', 'White blood cell count', 'Hemoglobin', 'Hematocrit', 'Platelet count'],
      reportDelivery: 'Digital report available within 24 hours',
      clinicalSignificance: 'Helps evaluate overall health and detect a variety of disorders including anemia, infection, and leukemia.'
    },
    {
      id: 2, 
      name: 'LFT', 
      category: 'Blood Test', 
      description: 'Liver Function Test',
      detailedDescription: 'Liver Function Tests (LFTs) are blood tests used to help diagnose and monitor liver disease or damage by measuring the levels of proteins, liver enzymes, and bilirubin in your blood.',
      price: 650, 
      sampleRequired: true, 
      tat: '24 hrs', 
      isActive: true,
      preparationInstructions: 'Fasting for 10-12 hours is required. Only water is allowed during the fasting period.',
      testIncludes: ['Bilirubin', 'Albumin', 'Total protein', 'ALP', 'ALT', 'AST'],
      reportDelivery: 'Digital report available within 24 hours',
      clinicalSignificance: 'Helps diagnose liver diseases such as hepatitis, monitor treatment of liver disease, and check for liver damage.'
    },
    {
      id: 3, 
      name: 'MRI Brain', 
      category: 'MRI', 
      description: 'Brain MRI scan',
      detailedDescription: 'A Brain MRI (Magnetic Resonance Imaging) uses powerful magnets and radio waves to produce detailed images of the brain and brain stem, helping to diagnose tumors, bleeding, swelling, and other brain abnormalities.',
      price: 3500, 
      sampleRequired: false, 
      tat: 'Same day', 
      isActive: false,
      preparationInstructions: 'No special preparation is needed. Remove all metal objects before the scan. Inform the technician if you have any metal implants or pacemakers.',
      testIncludes: ['Detailed brain images in multiple planes', '3D reconstruction if needed', 'Radiologist interpretation'],
      reportDelivery: 'Report available within 24-48 hours',
      clinicalSignificance: 'Helps diagnose brain tumors, stroke, multiple sclerosis, dementia, and other brain disorders.'
    },
    {
      id: 4, 
      name: 'Chest X-Ray', 
      category: 'X-Ray', 
      description: 'Chest imaging',
      detailedDescription: 'A chest X-ray is a non-invasive imaging test that produces images of the structures inside your chest, including your heart, lungs, blood vessels, airways, and the bones of your chest and spine.',
      price: 500, 
      sampleRequired: false, 
      tat: '2 hrs', 
      isActive: true,
      preparationInstructions: 'Wear loose, comfortable clothing. You may be asked to wear a gown and remove any jewelry or metal objects that might interfere with the image.',
      testIncludes: ['Frontal and lateral views', 'Radiologist interpretation'],
      reportDelivery: 'Report available within 2-4 hours',
      clinicalSignificance: 'Helps diagnose conditions such as pneumonia, heart failure, lung cancer, tuberculosis, and other lung and heart conditions.'
    },
    {
      id: 5, 
      name: 'ECG', 
      category: 'Cardiology', 
      description: 'Heart electrical activity test',
      detailedDescription: 'An Electrocardiogram (ECG or EKG) records the electrical signals in your heart to help detect heart problems and monitor heart health.',
      price: 300, 
      sampleRequired: false, 
      tat: '30 min', 
      isActive: true,
      preparationInstructions: 'Avoid exercising or drinking cold water immediately before the test. Wear comfortable clothing that allows access to your chest, arms, and legs.',
      testIncludes: ['12-lead ECG', 'Rhythm strip', 'Cardiologist interpretation'],
      reportDelivery: 'Report available within 1 hour',
      clinicalSignificance: 'Helps diagnose heart conditions such as irregular heartbeats, heart attacks, and other heart problems.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.testId = +params['id'];
      this.loadTestDetails();
    });
  }

  private loadTestDetails(): void {
    const foundTest = this.testData.find(test => test.id === this.testId);
    
    if (foundTest) {
      this.test = foundTest;
    } else {
      this.snackBar.open('Test not found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/tests']);
    }
  }

  bookTest(): void {
    if (this.test) {
      // In a real app, this would navigate to a booking page or open a booking dialog
      this.snackBar.open(`Booking ${this.test.name} test...`, 'Close', {
        duration: 2000
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tests']);
  }
}
