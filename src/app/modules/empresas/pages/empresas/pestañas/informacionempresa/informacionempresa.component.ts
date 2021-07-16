import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/modules/company/services/company.service';
import { DatosempresaService } from 'src/app/modules/empresas/services/datosempresa/datosempresa.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-informacionempresa',
  templateUrl: './informacionempresa.component.html',
  styleUrls: ['./informacionempresa.component.scss']
})
export class InformacionempresaComponent implements OnInit {
  @ViewChild("nombre") nombre!: ElementRef;

  @Output() enviado = new EventEmitter();

  @Input() datos: any;




  public obj: any = {};
  public myform!: FormGroup;
  public arregloregimen: any = [];
  public arregloactividad: any = [];
  public arregloactividad2: any = [];
  public imagen: any = undefined;
  public idNivel: number = 1;
  public idNivel2: number = 2;
  public cargando: Boolean = false;
  public cargandoImg: boolean = false;


  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empresaPrd: DatosempresaService, private routerPrd: Router, private modalPrd: ModalService, private companyPrd: CompanyService,
    private authUsuariosPrd: UsuariosauthService, private usuariosSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {
    this.obj = this.datos.empresa;

    this.myform = this.createForm(this.obj);
    this.suscripciones();

    this.catalogosPrd.getRegimenFiscal(true).subscribe(datos => this.arregloregimen = datos.datos);

    this.catalogosPrd.getActividadEconomica(this.idNivel).subscribe(datos => this.arregloactividad = datos.datos);
    if (!this.datos.insertar) {
      this.catalogosPrd.getActividadEconomica2(this.idNivel2, this.datos.empresa.padreActividadEconomicaId?.sectorCActividadEconomica?.actividadEconomicaId).subscribe(datos => {
        this.arregloactividad2 = datos.datos
      });
      this.cargandoImg = true;
      this.companyPrd.getEmpresaById(this.datos.empresa.centrocClienteId).subscribe(datos => {
        this.cargandoImg = false;
        this.imagen = datos.datos?.imagen;

      });
    }


  }

  public suscripciones() {
    this.myform.controls.regimenfiscalId.valueChanges.subscribe(valor => {
      let permitido: boolean = (valor == 606 || valor == 612 || valor == 621);
      this.realizarValidacionRegimen(permitido);

      console.log(this.myform.controls);
    });


    let permitido: boolean = (this.myform.controls.regimenfiscalId.value == 606 || this.myform.controls.regimenfiscalId.value == 612 || this.myform.controls.regimenfiscalId.value == 621);
    this.realizarValidacionRegimen(permitido);


    this.myform.controls.key.valueChanges.subscribe(datos => {
      console.log("Se hace un cambio", datos);
    });


  }

  public realizarValidacionRegimen(permitido: boolean) {
    if (permitido) {
      this.myform.controls.razonSocial.clearValidators();
      this.myform.controls.razonSocial.updateValueAndValidity();
      this.myform.controls.curp.setValidators([Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]);
      this.myform.controls.curp.updateValueAndValidity();
      console.log("Hace las validaciones");
    } else {
      this.myform.controls.razonSocial.setValidators([Validators.required]);
      this.myform.controls.razonSocial.updateValueAndValidity();
      this.myform.controls.curp.setValidators([Validators.pattern(ConfiguracionesService.regexCurp)]);
      this.myform.controls.curp.updateValueAndValidity();
      console.log("NO HACE");
    }
  }


  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }

  public recibirImagen(imagen: any) {
    this.imagen = imagen;
  }
  public createForm(obj: any) {

    if (this.datos.empresa?.certificadoSelloDigitalId) {
      obj.cer = 'Certificado de sello digital cargado';
      obj.key = 'Llave de certificado de sello digital cargado';
      obj.contrasenia = "1234566789";
    }

    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      razonSocial: [obj.razonSocial, [Validators.required]],
      actividadEconomicaId: [obj.padreActividadEconomicaId?.sectorCActividadEconomica?.actividadEconomicaId, [Validators.required]],
      actividadEconomicaId2: [obj.actividadEconomicaId?.actividadEconomicaId, [Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]],
      regimenfiscalId: [obj.regimenfiscalId?.regimenfiscalId, [Validators.required]],
      centrocClienteId: obj.centrocClienteId,
      tieneCurp: [obj.tieneCurp],
      cer: [{ value: obj.cer, disabled: true }, [Validators.required]],
      key: [{ value: obj.key, disabled: true }, [Validators.required]],
      contrasenia: [{ value: obj.contrasenia, disabled: this.datos.empresa?.certificadoSelloDigitalId }, [Validators.required]],
      esActivo: [{ value: (this.datos.insertar) ? true : obj.esActivo, disabled: this.datos.insertar }, [Validators.required]],

    });
  }

  public validarActividad2(actividad: any) {
    actividad = this.arregloactividad.find((value: any) => value['descripcion'] === actividad).actividadEconomicaId
    if (actividad) {
      this.catalogosPrd.getActividadEconomica2(this.idNivel2, actividad).subscribe(datos => this.arregloactividad2 = datos.datos);
    }
  }

  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);

  }


  public enviarFormulario() {

    if (this.myform.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      Object.values(this.myform.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    let titulo: string = this.datos.insertar ? "¿Deseas guardar cambios?" : "¿Deseas actualizar los datos de la empresa?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        this.guardarCambios();
      }
    });;




  }



  public get f() {
    return this.myform.controls;
  }


  public guardarCambios() {
    let obj = this.myform.getRawValue();
    if (!Boolean(obj.key) && !Boolean(obj.cer)) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "No se ha cargado el .cer y .key, favor de elegir archivos de certificado ");
      return;
    }

    console.log("Form", obj);


    let objenviar :any = {
      nombre: obj.nombre,
      razonSocial: obj.razonSocial,
      cerKeyConstrasenia: false,
      rfc: obj.rfc,
      regimenfiscalId: {
        regimenfiscalId: obj.regimenfiscalId
      },
      centroCostosCentrocClienteId: {
        centrocClienteId: (this.usuariosSistemaPrd.esCliente()) ? this.usuariosSistemaPrd.getIdEmpresa() : this.usuariosSistemaPrd.getUsuario().centrocClienteIdPadre
      },
      actividadEconomicaId: {
        actividadEconomicaId: this.arregloactividad2.find((value: any) => value.actividadEconomicaId === obj.actividadEconomicaId2).actividadEconomicaId
      },
      imagen: this.imagen,
      curp: obj.curp,
      cer: obj.cer,
      key: obj.key,
      contrasenia: obj.contrasenia,
      esActivo: obj.esActivo,
      centrocClienteId: 0
    }


    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    if (this.datos.insertar) {
      this.empresaPrd.save(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        if (datos.resultado) {
          this.datos.empresa.centrocClienteEmpresa = datos.datos.centrocClienteId;

          let objVersionEnviar = {
            centrocClienteId: datos.datos.centrocClienteId,
            versionId: this.usuariosSistemaPrd.getVersionSistema()
          };
          this.authUsuariosPrd.guardarVersionsistema(objVersionEnviar).subscribe(datosVersion => {
            if (!datosVersion.resultado) {
              this.modalPrd.showMessageDialog(datosVersion.resultado, datosVersion.mensaje);
            }
          });

          this.enviado.emit({ type: 'informacion' });
        }

      });

    } else {
      objenviar.centrocClienteId = this.datos.empresa.centrocClienteId;
      objenviar.cerKeyConstrasenia = !this.myform.controls.cer.value.includes("Certificado de sello digital") && !this.myform.controls.key.value.includes("Llave de certificado");
      objenviar.certificadoSelloDigitalId = this.datos.empresa?.certificadoSelloDigitalId;
      if(!objenviar.cerKeyConstrasenia){
          delete objenviar.cer;
          delete objenviar.key;
      }
      this.empresaPrd.modificar(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            this.enviado.emit({ type: 'informacion' });
          }
        });
      });
    }

  }


  public abrirCer() {

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".cer";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      //this.inputcer.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myform.controls.cer.setValue(this.arrayBufferToBase64(datos));
          this.myform.controls.contrasenia.enable();

        });


      }
    }
  }

  public abrirKey() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".key";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      // this.inputkey.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myform.controls.key.setValue(this.arrayBufferToBase64(datos));
          this.myform.controls.contrasenia.enable();
        });


      }

    }
  }

  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
