import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ImssService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.registroPatronal}/guardar`,json,httpOptions);

  }
}
