import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioService } from '../../services/usuario.service';


//Importamos para el lenguaje en mis fechas (SAMV)
import localeEn from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
registerLocaleData(localeEn, 'es-MX');

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {






  public cargando: Boolean = false;
  public tipoguardad: boolean = false;





  /*
    Directivas de filtros
  */


  public id_company: string = "";
  public idUsuario: any = "";
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;






  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  public esClienteEmpresa: boolean = false;



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public activarMultiseleccion: boolean = false;


  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private empresasProd: EmpresasService, private usuariosAuthPrd: UsuariosauthService) { }

  ngOnInit(): void {

    this.esClienteEmpresa = this.routerPrd.url.includes("/cliente/usuarios");




    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;

    this.usuariosPrd.getAllUsers(true).subscribe(datos => {
      this.arreglo = datos.datos;
      this.procesarTabla();
      this.cargando = false;
    });



    if (this.esClienteEmpresa) {
      this.companiPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);
    } else {
      this.empresasProd.getAllEmp(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloCompany = datos.datos);
    }




  }

  public procesarTabla() {
    let columnas: Array<tabla> = [
      new tabla("usuarioId", "ID"),
      new tabla("nombre", "Nombre"),
      new tabla("apellidoPat", "Primer apellido"),
      new tabla("apellidoMat", "Segundo apellido"),
      new tabla("email", "Correo electrónico"),
      new tabla("rolnombre", "Rol"),
      ((this.esClienteEmpresa) ? new tabla("esMulticliente", "Multicliente") : new tabla("empresa", "empresa")),
      new tabla("esActivo", "Estatus")
    ];

    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item["rolnombre"] = item?.rolId?.nombreRol;
        item["esMulticliente"] = item?.esMulticliente? "Sí":"No";
      }
    }

    this.arreglotabla = {
      columnas: columnas,
      filas: this.arreglo
    }
  }





  public verdetalle(obj: any) {
    if (obj == undefined) {
      this.routerPrd.navigate([(this.esClienteEmpresa) ? "cliente" : "", 'usuarios', 'detalle_usuario'], { state: { company: this.arregloCompany, usuario: obj } });
    } else {
      this.routerPrd.navigate([(this.esClienteEmpresa) ? "cliente" : "", 'usuarios', 'detalle_usuario'], { state: { company: this.arregloCompany, usuario: obj } });
    }
  }







  public guardarMultiseleccion(tipoguardad: boolean) {


    this.tipoguardad = tipoguardad;
    let mensaje = `¿Deseas ${tipoguardad ? "activar" : "desactivar"} estos usuarios?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            arregloUsuario.push( item["usuarioId"]);

          }
        }

        let objEnviar = {
          ids:arregloUsuario,
          esActivo: tipoguardad
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.usuariosAuthPrd.usuariosActivarDesactivar(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(valor => {
            if (valor) {
              for (let item of arregloUsuario) {
                for (let item2 of this.arreglo) {
                  if (item2.usuarioId === item) {
                    item2["esActivo"] = tipoguardad;
                    item2["seleccionado"] = false;
                    break;
                  }
                }
              }

              this.activarMultiseleccion = false;
            }
          });
        });
      }
    });



  }





  public filtrar() {

    this.cargando = true;


    let arregloenviar = [];
    
    if(!Boolean(this.id_company)){
      arregloenviar.push(this.usuariosSistemaPrd.getIdEmpresa());
      for(let item of this.arregloCompany){
        arregloenviar.push(item.centrocClienteId);
    }
    }else{
      arregloenviar.push(this.id_company);
    }
    


    let peticion = {
      idUsuario: this.idUsuario || null,
      nombre: this.nombre || null,
      apellidoPat: this.apellidoPat || null,
      apellidoMat: this.apellidoMat || null,
      fechaAlta: this.fechaRegistro || null,
      email: this.correoempresarial || null,
      idClientes: arregloenviar,
      esActivo: this.activo == 0? null:this.activo == 1
    }


    this.usuariosAuthPrd.filtrarUsuarios(peticion).subscribe(datos => {
      this.arreglo = datos.datos;
      this.procesarTabla();
      this.cargando = false;
    });
  }


  public recibirTabla(obj: any) {


    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;
      case "llave":
        this.generarllave(obj.datos);
        break;
    }

  }


  public generarllave(obj: any) {
    console.log(obj.email);
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas resetear y reenviar la clave de este usuario?").then((valor) => {
      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objenviar = {
          username: obj.email
        }

        this.usuariosSistemaPrd.enviarCorreorecuperacion(objenviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        });

      }
    });
  }



}








