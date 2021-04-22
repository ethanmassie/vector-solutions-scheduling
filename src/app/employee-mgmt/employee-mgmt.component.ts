import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, zip } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { Employee, EmployeeStore } from '../employee.store';

@Component({
  selector: 'app-employee-mgmt',
  templateUrl: './employee-mgmt.component.html',
  styleUrls: ['./employee-mgmt.component.scss']
})
export class EmployeeMgmtComponent implements OnInit {

  searchControl = new FormControl('');

  employees$!: Observable<Employee[]>; // can assert non null since we initialize in ngOnInit

  constructor(private employeeStore: EmployeeStore) { }

  ngOnInit(): void {
    const searchValue$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      filter(v => {
        // very impure. angular material sets the value of your autocomplete input to
        // the object itself which is a problem.  This will patch the value to a string
        // representation of the object and filter out the object values
        if (typeof v !== 'string') {
          this.searchControl.patchValue(`${v.lastName}, ${v.firstName} (${v.employeeNumber})`);
          return false;
        }

        return true;
      }),
      map(this.filterEmployee) // map to a filter function
    );

    this.employees$ = combineLatest([this.employeeStore.employees$, searchValue$]).pipe(
      map(([es, search]) => es.filter(search))
    );
  }

  private filterEmployee(searchTerm: string): (e: Employee) => boolean {
    const lowerSearch = searchTerm.toLowerCase();
    return (employee: Employee): boolean => {
      return employee.firstName.toLowerCase().includes(lowerSearch) ||
        employee.lastName.includes(lowerSearch) ||
        employee.employeeNumber.includes(lowerSearch);
    };
  }

}
