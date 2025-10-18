import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categorySubject = new BehaviorSubject<string>('Todos');
  category$ = this.categorySubject.asObservable();

  setCategory(category: string) {
    this.categorySubject.next(category);
     localStorage.setItem('selectedCategory', category);
  }

  

  get currentCategory(): string {
    return this.categorySubject.getValue();
  }
}
