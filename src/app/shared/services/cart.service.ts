import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/storefront';

const STORAGE_KEY = 'hmc_cart_v1';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readFromStorage());
  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.itemsSubject.value.length;
  }

  add(item: CartItem): void {
    const next = [...this.itemsSubject.value, item];
    this.set(next);
  }

  remove(id: string): void {
    const next = this.itemsSubject.value.filter((x) => x.id !== id);
    this.set(next);
  }

  clear(): void {
    this.set([]);
  }

  subtotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);
  }

  savings(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      const discounted = item.discountPrice ?? item.price;
      return sum + Math.max(0, item.price - discounted);
    }, 0);
  }

  private set(items: CartItem[]): void {
    this.itemsSubject.next(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

