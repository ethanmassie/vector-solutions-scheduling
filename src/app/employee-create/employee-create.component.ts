import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee, EmployeeStore } from '../employee.store';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent implements OnInit {

  employeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    emailAddress: new FormControl(''),
    employeeNumber: new FormControl('', Validators.required),
  });

  constructor(private employeeStore: EmployeeStore, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.employeeForm.invalid) {
      this.snackBar.open('Nice try');
      return;
    }
    const value = this.employeeForm.value as Employee;
    this.employeeStore.appendEmployee(value);
  }

}
