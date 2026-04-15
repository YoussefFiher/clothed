import { Component } from '@angular/core';
@Component({ selector: 'app-home-view', templateUrl: './home-view.component.html', styleUrls: ['./home-view.component.css'] })
export class HomeViewComponent {
  categories = [
    {icon:'fa-solid fa-shirt',label:'Vêtements'},
    {icon:'fa-solid fa-shoe-prints',label:'Chaussures'},
    {icon:'fa-solid fa-book',label:'Livres'},
    {icon:'fa-solid fa-bag-shopping',label:'Accessoires'},
  ];
}
