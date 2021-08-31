import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss']
})
export class DetalleUsuarioComponent implements OnInit {

  public tamanio: number = 0;
  @ViewChild("nombre") public nombre!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerHeight;

  }


  public myForm!: FormGroup;
  public insertar: boolean = false;
  public fechaActual: any = "";;
  public objusuario: any = {};
  public arregloCompany: any;
  public summitenviado: boolean = false;
  public companiasenviar:any = [];
  public arregloRoles: any = [];
  public inabilitar:boolean = false;

  public esClienteEmpresa:boolean = false;


  constructor(private formBuilder: FormBuilder, private usuariosPrd: UsuarioService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService, private rolesPrd: RolesService,
    private usuariosSistemaPrd: UsuarioSistemaService, private usuariosAuth: UsuariosauthService,public configuracionPrd:ConfiguracionesService) {

    let datePipe = new DatePipe("es-MX");

    let fecha = new Date();
    this.fechaActual = datePipe.transform(fecha, 'dd-MMM-y')?.replace(".", "");

    
  }

  ngOnInit(): void {
    
    this.esClienteEmpresa = this.routerPrd.url.includes("/cliente/usuarios");
    this.arregloCompany = history.state.company == undefined ? [] : history.state.company;
    
    this.insertar = !Boolean(history.state.usuario);
    this.objusuario = history.state.usuario;
    this.objusuario = this.objusuario == undefined ? {}:this.objusuario;

    console.log(this.objusuario);

    this.verificarCompaniasExista();

    

    

  
    this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), true).subscribe(datos => this.arregloRoles = datos.datos);
    

    this.objusuario.centrocClienteId = {};


    this.myForm = this.createForm(this.objusuario);

    if(!this.insertar && this.esClienteEmpresa){
        let companiaSeleccionada = this.arregloCompany.find((o:any) => o["centrocClienteId"] == this.myForm.controls.centrocClienteId.value);
        this.myForm.controls.centrocClienteId.setValue(companiaSeleccionada.razonSocial);
        
    }

    if(!this.esClienteEmpresa && this.objusuario.rolId?.rolId == 2){
         this.myForm.controls.nombre.disable();
         this.myForm.controls.apellidoPaterno.disable();
         this.myForm.controls.apellidoMaterno.disable();
         this.myForm.controls.correoelectronico.disable();
         this.myForm.controls.rol.disable();
         this.myForm.controls.centrocClienteId.disable();
         this.inabilitar = true;

      }


      this.suscripciones();


      if(this.usuariosSistemaPrd.esCliente() && this.usuariosSistemaPrd.getVersionSistema() == 1){
        if(this.objusuario){
          if(this.objusuario.rolId.rolId != 1){
            this.myForm.controls.multicliente.disable();
            this.myForm.controls.multicliente.setValue(false);
            this.myForm.controls.centrocClienteId.disable();
          }
        }
    }

  }

  public suscripciones(){
    this.myForm.controls.rol.valueChanges.subscribe(valor =>{
      console.log(this.usuariosSistemaPrd.getVersionSistema())
      
      if(this.usuariosSistemaPrd.esCliente() && this.usuariosSistemaPrd.getVersionSistema() == 1){
          if(valor != 1){
            this.myForm.controls.multicliente.disable();
            this.myForm.controls.multicliente.setValue(false);
            let companiaSeleccionada = this.arregloCompany.find((o:any) => o["centrocClienteId"] == this.usuariosSistemaPrd.usuario.centrocClienteId);
            this.myForm.controls.centrocClienteId.setValue(companiaSeleccionada.razonSocial);
            this.myForm.controls.centrocClienteId.disable();
            return;
          }
      }


      this.myForm.controls.multicliente.enable();
      this.myForm.controls.centrocClienteId.enable();
    });
  }


  ngAfterViewInit(): void {

    if (!this.insertar)
      this.nombre.nativeElement.focus();

  }


  public verificarCompaniasExista() {


    if (this.arregloCompany.length == 0) {
      this.cancelar();
    }
  }


  public createForm(obj: any) {

    if(!this.insertar){
      let verificador = obj.esMulticliente == undefined ? false:obj.esMulticliente=="Sí";
      if(verificador){
          this.companiasenviar = obj.centrocClientes;
      }else{
        this.companiasenviar = [];
      }
    }


    return this.formBuilder.group({



      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPat, [Validators.required]],
      apellidoMaterno: [obj.apellidoMat],
      correoelectronico: [obj.email?.toLowerCase(), [Validators.required, Validators.email]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : new DatePipe("es-MX").transform(obj.fechaAlta,"dd/MM/yyyy")), disabled: true }, [Validators.required]],
      centrocClienteId: [this.insertar?"":obj.centrocClientes[0].centrocClienteId, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      personaId: [{ value: obj.usuarioId, disabled: true }],
      multicliente: obj.esMulticliente == undefined ? false:obj.esMulticliente=="Sí",
      rol:[obj.rolId?.rolId,Validators.required],
      nombrecliente:{value:this.usuariosSistemaPrd.getUsuario().nombreEmpresa,disabled:true},
      usuarioId:obj.usuarioId


    });
  }





  public enviarPeticion() {

    let companiaSeleccionada = this.arregloCompany.find((o:any)=>o["razonSocial"].includes(this.myForm.value.centrocClienteId));
    



    this.summitenviado = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;
    }

    let mensaje = this.insertar ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar los datos del usuario?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {

       

        let obj = this.myForm.getRawValue();

        let companysend = [];
        if(obj.multicliente){
          for(let item of this.companiasenviar){
            companysend.push(item.centrocClienteId);
          }
        }else{
           if(this.esClienteEmpresa){
            let companiaSeleccionada = this.arregloCompany.find((o:any)=>o["razonSocial"].includes(obj.centrocClienteId));
            obj.idRazonSocial = companiaSeleccionada.centrocClienteId;
           }else{
            obj.idRazonSocial = obj.centrocClienteId;
           }
        }

        let objAuthEnviar = {
          nombre: obj.nombre,
          apellidoPat: obj.apellidoPaterno,
          apellidoMat: obj.apellidoMaterno,
          email: obj.correoelectronico?.toLowerCase(),
          centrocClienteIds:obj.multicliente?companysend : [obj.idRazonSocial],
          rolId: obj.rol,
          esMulticliente:obj.multicliente,
          usuarioId:obj.usuarioId,
          esActivo:obj.esActivo
        }




        if (this.insertar) {
          delete objAuthEnviar.usuarioId;
          delete objAuthEnviar.esActivo

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosAuth.guardar(objAuthEnviar).subscribe((datos) => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => {
                if (datos.resultado) {
                  if(this.esClienteEmpresa){
                    this.routerPrd.navigate(["/cliente/usuarios"])
                  }else{
                    this.routerPrd.navigate(["/usuarios"])
                  }
                }
              });
          });


        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
        
          this.usuariosAuth.modificar(objAuthEnviar).subscribe(datos =>{
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => {
                if (datos.resultado) {
                  if(this.esClienteEmpresa){
                    this.routerPrd.navigate(["/cliente/usuarios"])
                  }else{
                    this.routerPrd.navigate(["/usuarios"])
                  }
                }
              });
          });
        }
      }
    });

  }




  get f() { return this.myForm.controls; }





  public cancelar() {

    if(this.esClienteEmpresa){
      this.routerPrd.navigate(["/cliente/usuarios"])
    }else{
      this.routerPrd.navigate(["/usuarios"])
    }
  }


  public cambiarMultiempresa() {


  }


  public recibirEtiquetas(evento: any) {
    this.myForm.controls.centrocClienteId.setValue(evento[0].centrocClienteId);
    this.companiasenviar = evento;

  }




}
