import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly snackBar: MatSnackBar) {}

  public showLoader(): void {
    this.loading$.next(true);
  }

  public hideLoader(): void {
    this.loading$.next(false);
  }

  public showSnackbar(message: string, action: string = 'Zamknij', duration: number = 3000): void {
    this.snackBar.open(message, action, { duration });
  }
}
