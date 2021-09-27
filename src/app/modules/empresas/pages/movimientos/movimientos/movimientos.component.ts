import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})

export class MovimientosComponent implements OnInit {

  public empresa: any;

  public idEmpresa: number = 0;
  public arreglo: any = [];
  public cargandoIcon: boolean = false;
  public cargando: boolean = false;
  public fechaMovimiento: any;
  public fechaMovimientoFinal: string = ""; 
  public objFiltro: any = [];
  public nombre: any = "";
  public apellidoPaterno: any = "";
  public apellidoMaterno: any = "";
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }
  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };



  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit() {
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();
    this.filtrar();
  }

  public traerTabla(obj:any) {

    this.arreglo = obj.datos;

    const columnas: Array<tabla> = [
      new tabla("nombrecompleado", "Nombre de usuario"),
      new tabla("rol", "Rol"),
      new tabla("modulo", "Módulo"),
      new tabla("movimiento", "Movimiento"),
      new tabla("fechaMovimiento", "Fecha de movimiento")
    ];


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }
    
    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item["nombrecompleado"] = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? "":item.apellidoMaterno}`;

        //if(item.fechaMovimiento !== undefined ){
        //item.fecha = new DatePipe("es-MX").transform(item.fechaMovimiento, 'dd-MMM-y');
        //}
      }
    }
   
    
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public filtrar() {
    
    this.objFiltro = [];        
    if (this.fechaMovimiento != "" && this.fechaMovimiento != undefined) {
    
/*       const fecha1 = new Date(this.fechaMovimiento).toUTCString().replace("GMT", "");
      this.fechaMovimientoFinal = `${new Date(fecha1).getTime()}`; */
      this.fechaMovimientoFinal = this.fechaMovimiento; 

    }else{

      this.fechaMovimientoFinal = ""
    }

    this.cargando = true;
      if(this.nombre != ''){
        this.objFiltro = {
          ...this.objFiltro,
          nombre: this.nombre
        };
        }
        if(this.apellidoPaterno != ''){
          this.objFiltro = {
            ...this.objFiltro,
            apellidoPaterno: this.apellidoPaterno
          };
        } 
        if(this.apellidoMaterno != ''){
            this.objFiltro = {
              ...this.objFiltro,
              apellidoMaterno: this.apellidoMaterno
            };
        }

       
        this.objFiltro = {
          ...this.objFiltro,
          centroClienteId: this.idEmpresa,
          fechaMovimiento: this.fechaMovimientoFinal
        };
      this.empresasPrd.bitacoraMovimientoslistar(this.objFiltro).subscribe(datos => {
      this.traerTabla(datos);

      });
    }

  }



