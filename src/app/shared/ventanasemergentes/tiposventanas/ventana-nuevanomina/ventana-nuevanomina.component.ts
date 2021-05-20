import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-ventana-nuevanomina',
  templateUrl: './ventana-nuevanomina.component.html',
  styleUrls: ['./ventana-nuevanomina.component.scss']
})
export class VentanaNuevanominaComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  @ViewChild("fechafin") fechafin!: ElementRef;

  public arreglogruposnomina: any = [];

  public myForm!: FormGroup;

  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private nominaOrdinariaPrd: NominaordinariaService) { }

  ngOnInit(): void {
    this.grupoNominaPrd.getAll(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arreglogruposnomina = datos.datos);
    this.myForm = this.creandoForm();

    this.suscripciones();
  }

  public suscripciones() {


    this.f.fechaIniPeriodo.valueChanges.subscribe(valor => {
      if (this.f.fechaIniPeriodo.valid) {
        this.f.fechaFinPeriodo.enable();
        this.fechafin.nativeElement.min = valor;
      } else {
        this.f.fechaFinPeriodo.disable();
        this.f.fechaFinPeriodo.setValue("");
      }
    })



  }


  public creandoForm() {

    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        grupoNomina: [, [Validators.required]],
        usuarioId: this.usuarioSistemaPrd.getUsuario().idUsuario,
        fechaIniPeriodo: [, [Validators.required]],
        fechaFinPeriodo: [{ value: '', disabled: true }, [Validators.required]],
        nombreNomina: [, [Validators.required]]
      }
    );
  }


  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }


  public guardar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas registrar la nómina?").then(valor => {
      if (valor) {
        this.salida.emit({ type: "guardar", datos: valor });
      }
    });
  }



  public enviarPeticion() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas crear la  nómina?").then(valor => {
      if (valor) {
        this.guardarNomina();
      }

    });
  }


  public guardarNomina() {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    let objEnviar = {
      ...this.myForm.value,
      fechaIniIncidencia: this.myForm.value.fechaIniPeriodo,
      fechaFinIncidencia: this.myForm.value.fechaFinPeriodo
    }

    this.nominaOrdinariaPrd.crearNomina(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.salida.emit({
        type: "guardar", datos: datos
      });
    },err =>{
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.salida.emit({
        type: "guardar", datos: "bueno"
      });
    });

  }


  public get f() {
    return this.myForm.controls;
  }

}
