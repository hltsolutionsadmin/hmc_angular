import { Injectable } from '@angular/core';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [
    { id: '1', name: 'Hematology', description: 'Blood related tests', status: true },
    { id: '2', name: 'Biochemistry', description: 'Chemical analysis of body fluids', status: true },
    { id: '3', name: 'Microbiology', description: 'Microorganism detection', status: true },
    { id: '4', name: 'Pathology', description: 'Tissue examination', status: true }
  ];

  constructor() { }

  getAll(): Category[] {
    return [...this.categories];
  }

  getById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  add(category: Omit<Category, 'id'>): void {
    const newCategory: Category = {
      ...category,
      id: (this.categories.length + 1).toString()
    };
    this.categories.push(newCategory);
  }

  update(id: string, category: Partial<Category>): void {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], ...category };
    }
  }

  remove(id: string): void {
    this.categories = this.categories.filter(c => c.id !== id);
  }

  toggleStatus(id: string): void {
    const category = this.getById(id);
    if (category) {
      category.status = !category.status;
      this.update(id, { status: category.status });
    }
  }
}
