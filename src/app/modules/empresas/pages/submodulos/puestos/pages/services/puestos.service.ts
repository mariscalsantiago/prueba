import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  private url:string = '';

  constructor(private http:HttpClient) { 

   // this.url = direcciones.area;
    this.url = '/api';

  }


  public getAllArea():Observable<any>{
     return this.http.get("/api/area/listar/todos");
  }


  public getById(id_user:number):Observable<any>{
    

    return this.http.get(`/api/persona/obtener/id/${id_user}`);

  }

  public filtrar(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);
     return this.http.post("/api/persona/lista/dinamica",json,httpOptions);
  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }


  public getAllCompany():Observable<any>{
     return this.http.get('/api/centroCostosCliente/lista/compania');
  }

}
