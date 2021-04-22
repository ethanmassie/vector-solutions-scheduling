import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

/**
 * Reusable function for getting objects form local storage
 * @param storageKey local storage key of json data
 * @param defaultState default value if storage is empty
 * @returns default value or value from localStorage
 */
export function getStateFromStorage<T>(storageKey: string, defaultState: T): T {
  const persistedStateJson = localStorage.getItem(storageKey);
  return !!persistedStateJson ? JSON.parse(persistedStateJson) as T : defaultState;
}

/**
 * Custom validator function for comparing the date values of two form controls to see
 * if the start value is before the end value.  Should be placed on a form group
 * @param startControlName name of start form control
 * @param endControlName name of end form control
 * @returns Validator function for comparing the two controls
 */
export function startBeforeEnd(startControlName: string, endControlName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control instanceof FormGroup) {
      const startControl = control.get(startControlName);
      const endControl = control.get(endControlName);
      const startTime = startControl?.value;
      const endTime = endControl?.value;

      if (!startTime || !endTime) {
        // nothing to compare since at least one is falsy
        return null;
      }

      // create date objects for easier comparison
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);

      const isValid = startTimeDate.getTime() < endTimeDate.getTime();
      return isValid ? null : {startBeforeEnd: 'error'};
    } else {
      return null;
    }
  };
}
