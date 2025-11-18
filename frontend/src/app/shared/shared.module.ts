import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityBadgeComponent } from '../components/priority-badge/priority-badge.component';
import { StatusLabelComponent } from '../components/status-label/status-label.component';

@NgModule({
  declarations: [PriorityBadgeComponent, StatusLabelComponent],
  imports: [CommonModule],
  exports: [PriorityBadgeComponent, StatusLabelComponent],
})
export class SharedModule {}
