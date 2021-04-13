import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { nominasRoutingModule } from "./nominas-routing.module";
import { NominasActivasComponent } from "./pages/activa/nominas-activas/nominas-activas.component";
import { NominaComponent } from './pages/activa/nomina/nomina.component';
import { ShareModule } from "src/app/shared/share.module";
import { CalcularComponent } from './pages/activa/nomina/pestañas/calcular/calcular.component';
import { PagarComponent } from './pages/activa/nomina/pestañas/pagar/pagar.component';
import { TimbrarComponent } from './pages/activa/nomina/pestañas/timbrar/timbrar.component';
import { CompletarComponent } from './pages/activa/nomina/pestañas/completar/completar.component';

@NgModule({
    declarations:[NominasActivasComponent, NominaComponent, CalcularComponent, PagarComponent, TimbrarComponent, CompletarComponent],
    imports:[CommonModule,ReactiveFormsModule,FormsModule,HttpClientModule,nominasRoutingModule,ShareModule]
})
export class nominasModule{

}