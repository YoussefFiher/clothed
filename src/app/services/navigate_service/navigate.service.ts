import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  private showPutArticles :boolean = false;

  setShowPutArticles (value : boolean) :void {
    this.showPutArticles = value;
  }

  getShowPutArticles () :boolean {
    return this.showPutArticles;
  }
  constructor() { }
}
