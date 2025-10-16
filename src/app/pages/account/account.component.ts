import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  isEditing = false;

  user = {
    name: 'Camila Yokoo',
    email: 'camilayokoo@gmail.com',
    password: '************'
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    console.log('Datos guardados:', this.user);
    this.isEditing = false;
  }
}
