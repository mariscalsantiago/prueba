import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-contacto',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss']
})
export class DetalleContactoComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;

  public myFormcont!: FormGroup;
  public arreglo: any = [];
  public contacto: boolean = false;
  public listcontacto: boolean = false;
  public compania: boolean = true;
  public companiaprincipal: boolean = true;
  public insertar: boolean = false;
  public fechaActual: string = "";
  public objcontacto: any;
  public fechaAlta: string = "";
  public cargando: Boolean = false;
  public centrocClienteId: number = 1;
  public datosEmpresa: any;

  public submitEnviado: boolean = false;



  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
    });


    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();



    this.fechaActual = `${dia}/${mes}/${anio}`;

  }

  ngOnInit(): void {

    this.objcontacto = history.state.datos == undefined ? {} : history.state.datos;
    this.datosEmpresa = history.state.empresa == undefined ? {} : history.state.empresa;

    this.myFormcont = this.createFormcont((this.objcontacto));

  }


  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcont(obj: any) {
    let datePipe = new DatePipe("en-MX");
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      curp: [obj.curp, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
      emailCorporativo: [obj.emailCorporativo, [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : datePipe.transform(new Date(), 'dd/MM/yyyy')), disabled: true }, [Validators.required]],
      personaId: obj.personaId

    });
  }

  public enviarPeticioncont() {

    this.submitEnviado = true;
    console.log(this.myFormcont.value);

    if (this.myFormcont.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let mensaje = this.insertar ? "¿Deseas registrar el contacto?" : "¿Deseas actualizar los datos del contacto inicial?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let obj = this.myFormcont.value;
        obj = {
          ...obj,
          fechaAlta: this.fechaActual,
        };
        let objEnviar: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          curp: obj.curp,
          //fechaAlta: obj.fechaAlta,
          emailCorporativo: obj.emailCorporativo,
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal,
          contactoInicialTelefono: obj.contactoInicialTelefono,
          centrocClienteId: {
            centrocClienteId: this.datosEmpresa.centrocClienteId
          }
        }


        if (this.insertar) {
          this.companyPrd.savecont(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } }));

            this.compania = false;
            this.contacto = true;

          });
        } else {

          objEnviar.personaId = obj.personaId;

          this.companyPrd.modificarCont(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } }));;
            this.listcontacto = true;
            this.compania = false;

          });
        }

      }
    })

  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/company"]);
  }


  public regresarPantallaPrincipal() {
    this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } });
  }



  get f() { return this.myFormcont.controls; }


}
