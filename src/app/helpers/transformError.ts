import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function transformError(error: any) {
  console.error(error);

  let errorMessage = 'An unknown error has occurred';
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `Error! ${error.error.message}`;
  } else if (error.status) {
    errorMessage = error.error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return throwError(() => new Error(errorMessage));
}
