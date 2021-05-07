import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  public scrollCompany:number = 1;


  constructor() { }

  public getScrollCompany(scroll:number){
    
      if(scroll !== 0){
          this.scrollCompany = scroll;
      }
      return this.scrollCompany;
  }
}
