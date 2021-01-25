import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleempresasComponent } from './pages/detalleempresas/detalleempresas.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent } from './pages/listaempresas/listaempresas.component';


const routes: Routes = [{
  path:'',
  children:[
    {
       path:'listaempresas',
       component:ListaEmpresasComponent
    },
    {
      path: 'listaempresas/empresas/:tipoinsert',
      component: EmpresasComponent
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/contactosRRH/empresascontactosrrh.module").then(m => m.empresasContactosRrhModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/cuentasbancarias/empresascuentasbancarias.module").then(m => m.empresasCuentasBancariasModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/representantelegal/empresarepresentantelegal.module").then(m => m.empresaRepresentanteLegalModule)
    }
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class EmpresasRoutingModule { }