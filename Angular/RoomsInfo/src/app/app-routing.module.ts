import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetRoomsByFloorIdComponent } from './get-rooms-by-floor-id/get-rooms-by-floor-id.component';
import { ValidateMrnNoComponent } from './validate-mrn-no/validate-mrn-no.component';

const routes: Routes = [
  {path:'rooms', component:GetRoomsByFloorIdComponent},
  {path:'vmrn', component:ValidateMrnNoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
