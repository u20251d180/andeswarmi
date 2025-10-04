import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  sidebarOpen = false;
//Este metodo es para abrir y cerrar el sidebar, una vez que se haga click en el boton del navbar de hamburguesa
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
