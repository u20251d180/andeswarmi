import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';   // 👈 importa tu Navbar

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, NgOptimizedImage],   // 👈 lo añades aquí
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home { }
