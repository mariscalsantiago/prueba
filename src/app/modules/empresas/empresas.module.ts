import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent} from './pages/listaempresas/listaempresas.component'
import { ShareModule } from 'src/app/shared/share.module';

@NgModule({
    declarations: [EmpresasComponent, ListaEmpresasComponent],
    imports: [
      CommonModule,
      EmpresasRoutingModule,
      ReactiveFormsModule,
      ShareModule,
      FormsModule
    ],
    providers: []
  })
  export class EmpresasModule { }
