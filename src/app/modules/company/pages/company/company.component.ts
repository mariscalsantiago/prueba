import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {


  public cargando:Boolean = false;

  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;

     

  /*
    Directivas de filtros
  */


  public id_company:number = 1;



  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private companyProd:CompanyService) { }

  ngOnInit(): void {


    this.cargando = true;

      this.companyProd.getByCompany(this.id_company).subscribe(datos =>{
        this.arreglo = datos.data;

        this.cargando = false;
      });

  }


  public verdetallecom(obj:any){
    debugger;
    this.cargando = true;
    this.routerPrd.navigate(['company','detalle_company'],{state:{data:obj}});
    this.cargando = false;
    

  }


  public activarMultiseleccion(){
      this.multiseleccion = true;
  }


  public guardarMultiseleccion(){
    this.multiseleccionloading = true;
      setTimeout(() => {
        this.multiseleccionloading = false;
        this.multiseleccion = false;
      }, 3000);
  }


  public cancelarMulti(){
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }

}
