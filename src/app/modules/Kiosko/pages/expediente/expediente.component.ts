import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent implements OnInit {

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public cargando: boolean = false;
  public idEmpleado: number = 0;

  public arreglo: any = [];
  public arregloDocumentos:any = [];
  public tipodocumento:string = "";

  constructor(public configuracionPrd: ConfiguracionesService, private empleadosPrd: EmpleadosService,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private documentosPrd: DocumentosService) { }

  ngOnInit(): void {

    this.cargando = true;

    this.documentosPrd.getDocumentosEmpleado().subscribe(datos => this.arregloDocumentos = datos.datos);
    this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      if (!datos.resultado) {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      } else {
        this.idEmpleado = datos.datos.personaId;
        this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(), this.idEmpleado).subscribe(datos => {
          this.crearTabla(datos);
        });
      }
    });
  }

  public crearTabla(datos: any) {

    this.arreglo = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombreArchivo", "Nombre"),
      new tabla("fechaCargaDocumento", "Fecha"),
      new tabla("tipoDocumento", "Tipo de documento")
    ]

    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item.fechaCarga = (new Date(item.fechaCarga).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaCargaDocumento = datepipe.transform(item.fechaCarga, 'dd-MMM-y')?.replace(".", "");

        item.tipoDocumento = item.tipoDocumento?.nombre;
      }
    }

    this.arreglotabla = {
      columnas: columnas,
      filas: this.arreglo
    };
    this.cargando = false;
  }

  public filtrar() {

  }

  public recibirTabla(obj: any) {
  }


}
