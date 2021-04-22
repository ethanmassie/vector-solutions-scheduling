import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeMgmtComponent } from './employee-mgmt/employee-mgmt.component';
import { NoEmployeeComponent } from './employee-mgmt/no-employee/no-employee.component';
import { ViewEmployeeComponent } from './employee-mgmt/view-employee/view-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'mgmt', pathMatch: 'full'},
  { path: 'mgmt', component: EmployeeMgmtComponent, children: [
    { path: '', component: NoEmployeeComponent },
    { path: ':employeeNumber', component: ViewEmployeeComponent }
  ]},
  { path: 'create', component: EmployeeCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
