import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  private pendingRequests = 0;
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly snackBar: MatSnackBar) {}

  public showLoader(): void {
    this.pendingRequests++;
    this.loading$.next(true);
  }

  public hideLoader(): void {
    this.pendingRequests = Math.max(0, this.pendingRequests - 1);
    if (this.pendingRequests === 0) {
      this.loading$.next(false);
    }
  }

  public showSnackbar(message: string, action: string = 'Zamknij', duration: number = 3000): void {
    this.snackBar.open(message, action, { duration });
  }
}
