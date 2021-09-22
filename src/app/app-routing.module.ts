import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneComponent } from "./scene/scene.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'scene',
    pathMatch: 'full'
  },
  {
    path: 'scene',
    component: SceneComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
