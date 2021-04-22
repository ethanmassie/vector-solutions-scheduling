import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee, EmployeeStore, Schedule } from 'src/app/employee.store';
import { ShiftDialogComponent } from './shift-dialog/shift-dialog.component';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {

  selectedEmployee$!: Observable<Employee>;
  schedule$!: Observable<Schedule>;

  constructor(
    private store: EmployeeStore,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // link the selected employee number in the store to the route parameter employeeNumber
    this.store.setSelectedEmployeeNumber(this.route.params.pipe(
      map(({employeeNumber}) => employeeNumber),
    ));

    this.selectedEmployee$ = this.store.selectedEmployee$.pipe(
      catchError(err => {
        // if selected employee throws an error notify the user and navigate back to mgmt
        this.snackBar.open('Employee does not exist');
        this.router.navigate(['..'], {relativeTo: this.route});
        return EMPTY;
      })
    );

    this.schedule$ = this.store.selectedEmployeeSchedule$;
  }

  openShiftDialog(): void {
    this.matDialog.open(ShiftDialogComponent);
  }

}
