import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-listachats-activos',
  templateUrl: './listachats-activos.component.html',
  styleUrls: ['./listachats-activos.component.scss']
})
export class ListachatsActivosComponent implements OnInit {

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }


  public cargando: boolean = false;
  constructor(private ventanaPrd: VentanaemergenteService, private chatPrd: ChatService) { }

  ngOnInit(): void {


    this.cargando = true;
    this.chatPrd.getListaChatActivos().subscribe(datos => {

      
        this.construirTabla(datos.datos);
    });

  }


  public construirTabla(obj:any) {

    let columnas: Array<tabla> = [
      new tabla("nombreempleado", "Empleado"),
      new tabla("mensajeInicialEmpleado", "Mensaje"),
      new tabla("fecha", "Fecha",false,false,true),
    ]

    if(obj){
        for(let item of obj){
            item["nombreempleado"] = item.personaId?.nombre+" "+item.personaId.apellidoPaterno+" ";
            item["nombreempleado"] += item.personaId?.apellidoMaterno?"":item.personaId?.apellidoMaterno

            var datePipe = new DatePipe("es-MX");
            item["fecha"] = (new Date(item.fechaMensajeIncialEmpleado).toUTCString()).replace(" 00:00:00 GMT", "");
            item["fecha"] = datePipe.transform(item["fecha"], 'dd-MMM-y')?.replace(".", "");
    
        }
    }


    this.arreglotabla = {
      columnas: columnas,
      filas: obj
    };

    this.cargando = false;
  }


  public recibirTabla(obj: any) {

  }

  public editarMensaje() {
    this.ventanaPrd.showVentana(this.ventanaPrd.mensajechat)
  }

}
