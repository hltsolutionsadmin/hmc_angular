import { Injectable } from '@angular/core';
import { Test } from '../models/test';
@Injectable({
  providedIn: 'root'
})
export class TestsService {
 tests: Test[] = [
    {
      id: 1,
      name: 'Complete Blood Count',
      category: 'Blood Test',
      enabled: true,
      subTests: [
        {
          name: 'Hemoglobin',
          unit: 'g/dL',
          range: '13-17',
          method: 'Spectrophotometry',
          sample: 'Blood',
          price: 150,
          enabled: true,
        },
        {
          name: 'RBC Count',
          unit: 'million/uL',
          range: '4.5-5.9',
          method: 'Automated Cell Counter',
          sample: 'Blood',
          price: 120,
          enabled: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Liver Function Test',
      category: 'Blood Test',
      enabled: true,
      subTests: [
        {
          name: 'ALT (SGPT)',
          unit: 'U/L',
          range: '7-56',
          method: 'Enzymatic',
          sample: 'Blood',
          price: 200,
          enabled: true,
        },
        {
          name: 'Bilirubin Total',
          unit: 'mg/dL',
          range: '0.3-1.2',
          method: 'Colorimetric',
          sample: 'Blood',
          price: 180,
          enabled: false,
        },
      ],
    },
  ];


  getAll(): Test[] {
    return [...this.tests];
  }

  add(test: Omit<Test, 'id'>) {
    const id = Math.max(0, ...this.tests.map(t => t.id)) + 1;
    this.tests.push({ id, ...test });
  }

  update(id: number, patch: Partial<Test>) {
    const idx = this.tests.findIndex(t => t.id === id);
    if (idx > -1) this.tests[idx] = { ...this.tests[idx], ...patch };
  }

  remove(id: number) {
    this.tests = this.tests.filter(t => t.id !== id);
  }

  toggleEnabled(id: number) {
    const t = this.tests.find(x => x.id === id);
    if (t) t.enabled = !t.enabled;
  }
}
