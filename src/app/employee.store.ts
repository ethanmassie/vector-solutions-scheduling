import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, of, combineLatest } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { getStateFromStorage } from './util';

const EMPLOYEE_STORAGE_KEY = 'EMPLOYEE_STORAGE_KEY';

export interface Employee {
  firstName: string;
  lastName: string;
  employeeNumber: string;
  middleName?: string;
  emailAddress?: string;
}

export interface Shift {
  startDate: Date;
  endDate: Date;
}

export interface CreateShiftRequest {
  employeeNumber: string;
  startDate: Date;
  endDate: Date;
}

export type Schedule = Shift[];
export type ScheduleMap = {[key: string]: Schedule};

export interface EmployeeState {
  employees: Employee[];
  scheduleMap: ScheduleMap; // maps employeeNumber to a list of Shifts
  selectedEmployeeNumber?: string;
}

const initialState: EmployeeState = {
  employees: [],
  scheduleMap: {}
};

const selectedEmployeeNotFound = () => {
  throw new Error('Selected Employee Not Found');
};

@Injectable()
export class EmployeeStore extends ComponentStore<EmployeeState> {

  /***************
   * OBSERVABLES *
   ***************/

  /**
   * List of employees
   */
  readonly employees$ = this.select(s => s.employees);

  /**
   * Value of selected employee number.  Only emits when defined
   */
  readonly selectedEmployeeNumber$ = this.select(s => s.selectedEmployeeNumber).pipe(
    // type safe way of filtering.  Essentially just a filter but also changes the type to remove | undefined
    switchMap(eid => !!eid ? of(eid) : EMPTY)
  );

  /**
   * Employee with matching id to selectedEmployeeNumber.
   * Throws an error if the employee cannot be found.
   */
  readonly selectedEmployee$ = combineLatest([this.employees$, this.selectedEmployeeNumber$]).pipe(
    map(([es, eid]) => es.find(e => e.employeeNumber === eid) || selectedEmployeeNotFound())
  );

  /**
   * Map of schedules observable
   */
  readonly scheduleMap$ = this.select(s => s.scheduleMap);

  /**
   * Schedule for the selected employee
   */
  readonly selectedEmployeeSchedule$ = combineLatest([this.scheduleMap$, this.selectedEmployeeNumber$]).pipe(
    map(([schedule, eid]) => schedule[eid])
  );

  /************
   * UPDATERS *
   ************/

  /**
   * Add a new employee to the end of the employees list
   */
  readonly appendEmployee = this.updater((s, e: Employee) => ({...s, employees: [...s.employees, e]}));

  /**
   * Simply sets the value of selectedEmployeeNumber
   */
  readonly setSelectedEmployeeNumber = this.updater((s, selectedEmployeeNumber: string) => ({...s, selectedEmployeeNumber}));

  /**
   * Adds a shift to a particular employee's schedule
   */
  readonly createEmployeeShift = this.updater((s, req: CreateShiftRequest ) => ({
    ...s,
    scheduleMap: {
      ...s.scheduleMap,
      [req.employeeNumber]: [
        ...(s.scheduleMap[req.employeeNumber] ?? []),
        {
          startDate: req.startDate,
          endDate: req.endDate
        }
      ]
    }
  }));

  constructor() {
    super(getStateFromStorage(EMPLOYEE_STORAGE_KEY, initialState));

    /**
     * Watch the state and persist it in local storage so we don't lose everything after a refresh.
     * Useful since there is not backend on this application to persist this
     */
    this.select(s => s).pipe(
      takeUntil(this.destroy$)
    // tslint:disable-next-line: deprecation disabled because this is a known bug in vscode
    ).subscribe({
      next: s => localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(s)),
    });
  }
}
