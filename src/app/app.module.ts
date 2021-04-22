import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeStore } from './employee.store';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeMgmtComponent } from './employee-mgmt/employee-mgmt.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NoEmployeeComponent } from './employee-mgmt/no-employee/no-employee.component';
import { ViewEmployeeComponent } from './employee-mgmt/view-employee/view-employee.component';
import { ShiftDialogComponent } from './employee-mgmt/view-employee/shift-dialog/shift-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeCreateComponent,
    EmployeeMgmtComponent,
    NoEmployeeComponent,
    ViewEmployeeComponent,
    ShiftDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    // material imports
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    EmployeeStore,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 5000}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
