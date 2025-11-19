import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  public readonly isLoading$: Observable<boolean> = this.uiService.loading$;

  constructor(private readonly uiService: UiService) {}
}
