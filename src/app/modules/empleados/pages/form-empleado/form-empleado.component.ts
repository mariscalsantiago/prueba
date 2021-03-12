import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public activado = [
  { tab: true, form: true, disabled: false }, 
  { tab: false, form: false, disabled: false }, 
  { tab: false, form: false, disabled: false },
  { tab: false, form: false, disabled: false }, 
  { tab: false, form: false, disabled: false } ];

  public ocultarDetalleTransfrencia:boolean = true;
  public ocultarempleada:boolean = false;

  

  public mostrarDetalleTransferencia:boolean = false;

  public datosPersona:any={
    personaId:190
  };


  public cambiaValor: boolean = false;

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {
  }


  public recibir(elemento: any) {
    this.ocultarempleada = true;

    switch (elemento.type) {
      case "informacion":
        this.datosPersona = elemento.datos;
        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].disabled = false;
        this.activado[0].form = false;
        break;
      case "domicilio":
        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].disabled = false;
        this.activado[1].form = false;
        
        break;
      case "preferencias":

        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].disabled = false;
        this.activado[2].form = false;
        
        break;
      case "empleo":
        debugger;
        this.datosPersona.metodopago = elemento.datos;
        this.ocultarDetalleTransfrencia = this.datosPersona.metodopago.metodoPagoId !== 4;

        if(!this.ocultarDetalleTransfrencia){
          this.activado[4].tab = true;
          this.activado[4].form = true;
          this.activado[4].disabled = false;
          this.activado[3].form = false;
        }else{
          this.routerPrd.navigate(['/empleados']);
        }

        this.ocultarempleada = true;
        break;
    }

  }


  



  public recibiendoUserInsertado(evento:any){
    this.datosPersona = evento;
  }


}
