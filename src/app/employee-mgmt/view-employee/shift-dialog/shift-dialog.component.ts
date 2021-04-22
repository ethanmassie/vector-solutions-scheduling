import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map,  take } from 'rxjs/operators';
import { EmployeeStore } from 'src/app/employee.store';
import { startBeforeEnd } from 'src/app/util';

@Component({
  selector: 'app-shift-dialog',
  templateUrl: './shift-dialog.component.html',
  styleUrls: ['./shift-dialog.component.scss']
})
export class ShiftDialogComponent implements OnInit {

  shiftForm = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required)
  }, startBeforeEnd('startDate', 'endDate'));

  constructor(
    private store: EmployeeStore,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ShiftDialogComponent>) { }

  ngOnInit(): void {
  }

  submitShift(): void {
    if (this.shiftForm.invalid) {
      // this will only happen if the user modifies the html to enable the submit button
      this.snackBar.open('Nice Try');
      return;
    }
    const value = this.shiftForm.value;
    this.store.createEmployeeShift(this.store.selectedEmployeeNumber$.pipe(
      take(1),
      map((employeeNumber) => ({...value, employeeNumber}))
    ));
    this.snackBar.open('Shift Saved');
    this.dialogRef.close();
  }

}

