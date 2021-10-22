import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'path';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public id_company: number = 0;
  public centrocClienteId: any = "";
  public rfc: any = "";
  public nombre: string = "";
  public razonSocial: string = "";
  public fechaAlta: any = null;
  public esActivo: string = "";

  public modal: boolean = false;
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public iconType: string = "";
  public tamanio: number = 0;
  public cargando: Boolean = false;
  public peticion: any = [];

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public changeIconDown: boolean = false;
  public multiempresa : string = '0';
  public multiempresaFin : boolean = false;

  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arreglotabla:any = {
    columnas: [],
    filas: []
  };

  public arreglotablaDesglose:any = {
    columnas: [],
    filas: []
  };

  public esRegistrar:boolean = false;
  public esEditar:boolean = false;

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private routerPrd: Router, private companyProd: CompanyService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    debugger;
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    
    this.establecerPermisos();
    
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;
    
    this.companyProd.getAll().subscribe(datos => {
      this.arreglo = datos.datos;

      let columnas: Array<tabla> = [
        new tabla("url", "imagen"),
        new tabla("centrocClienteId", "ID cliente"),
        new tabla("razonSocial", "Razón social	"),
        new tabla("nombre", "Nombre de cliente"),
        new tabla("rfc", "RFC"),
        new tabla("fechaAltab", "Fecha de registro en el sistema"),
        new tabla("activo", "Estatus de cliente")
      ];
      
      if (this.arreglo !== undefined) {
        for (let item of this.arreglo) {
          item.fechaAltab = new DatePipe("es-MX").transform(item.fechaAlta, 'dd-MMM-y');

              if(item.esActivo){
                item.activo = 'Activo'
               }
               if(!item.esActivo){
               item.activo = 'Inactivo'
               }
        }
      }

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;
    });

  }


  public verdetallecom(obj: any) {
    this.routerPrd.navigate(['company', 'detalle_company', 'nuevo'], { state: { datos: undefined } });
  }

  public establecerPermisos(){

    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
  }

  public filtrar() {
    
    this.cargando = true;

/*     let fechar = "";

    if (this.fechaAlta != undefined || this.fechaAlta != null) {

      if (this.fechaAlta != "") {

        const fecha1 = new Date(this.fechaAlta).toUTCString().replace("GMT", "");
        fechar = `${new Date(fecha1).getTime()}`;


      }

    } */
    delete this.peticion.multiempresa;
    if(this.multiempresa == '1'){
      this.multiempresaFin = true;
      this.peticion = {
        ...this.peticion,
        multiempresa: this.multiempresaFin,
      }
      
    }
    else if(this.multiempresa == '2'){
      this.multiempresaFin = false;
      this.peticion = {
        ...this.peticion,
        multiempresa: this.multiempresaFin,
      }
    }

    let actboo: string = "";

    if (this.esActivo == "1") {
      actboo = "true";
    } else if (this.esActivo == "2") {
      actboo = "false";
    }

    
    this.peticion = {
      ...this.peticion,
      centrocClienteId: this.centrocClienteId,
      rfc: this.rfc,
      nombre: this.nombre,
      razonSocial: this.razonSocial,
      fechaAlta: this.fechaAlta,
      esActivo: actboo,
    }
    
    
    this.companyProd.filtrar(this.peticion).subscribe(datos => {
      this.arreglo = datos.datos;



      this.arreglo = datos.datos;

      let columnas: Array<tabla> = [
        new tabla("url", "imagen"),
        new tabla("centrocClienteId", "ID cliente"),
        new tabla("razonSocial", "Razón social	"),
        new tabla("nombre", "Nombre de cliente"),
        new tabla("rfc", "RFC"),
        new tabla("fechaAltab", "Fecha de registro en el sistema"),
        new tabla("activo", "Estatus de cliente")
      ];

      if (this.arreglo !== undefined) {
        for (let item of this.arreglo) {
          item.fechaAltab = new DatePipe("es-MX").transform(item.fechaAlta, 'dd-MMM-y');

          if(item.esActivo){
            item.activo = 'Activo'
           }
           if(!item.esActivo){
           item.activo = 'Inactivo'
           }

        }
      }
      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;


      this.cargando = false;

    });



  }


  public activarMultiseleccion() {
    this.multiseleccion = true;
  }


  public guardarMultiseleccion() {
    this.multiseleccionloading = true;
    setTimeout(() => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    }, 3000);
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }



  public recibirTabla(obj: any) {
    if (obj.type == "editar") {
      this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
  }


}
