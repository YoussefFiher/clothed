import { Component } from '@angular/core';
@Component({ selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.css'] })
export class HeaderComponent {
  menuOpen = false;
  scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
}
