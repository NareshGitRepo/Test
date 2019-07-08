import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginatorComponent } from './paginator/paginator.component';

const routes: Routes = [
  {path:'paginator', component:PaginatorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
