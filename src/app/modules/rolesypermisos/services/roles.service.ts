import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { modulos } from 'src/app/core/modelos/modulos';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }


  public getListaRol(): Observable<modulos> {
    return this.http.get<modulos>(`${direcciones.roles}`);
  }

  public getListaModulos(activo: boolean): Observable<modulos[]> {
    return this.http.get<any>(`${direcciones.modulos}/listar/todosActivo/${activo}`)
      .pipe(map(valor => valor.datos));
  }


  public getListaTodosSistema(): Observable<any> {
    return this.http.get(`${direcciones.roles}/listar/todosActivo/true`);
  }


  public guardarRol(obj: any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.roles}/guardar`, json, httpOptions);
  }

  public modificarRol(obj: any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.roles}/modificar`, json, httpOptions);
  }

  public guardarPermisoxModulo(obj: any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.permisos}/agregar`, json, httpOptions);
  }



  public quitarPermisoxModulo(obj: any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.permisos}/quitar`, json, httpOptions);
  }

 
  public getPermisosxRol(idRol:number,activo:boolean):Observable<any>{
      return this.http.get(`${direcciones.permisos}/rol/${idRol}/listar/todosActivo/${activo}`);
  }

  public eliminarRol(id:number):Observable<any>{
      return this.http.delete(`${direcciones.roles}/eliminar/${id}`);
  }

}
