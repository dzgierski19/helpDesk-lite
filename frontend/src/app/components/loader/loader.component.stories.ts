import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoaderComponent } from './loader.component';
import { UiService } from '../../services/ui.service';

class MockUiService {
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  showLoader(): void {
    this.loading$.next(true);
  }

  hideLoader(): void {
    this.loading$.next(false);
  }

  showSnackbar(): void {
    // noop for Storybook
  }
}

@Component({
  selector: 'storybook-loader-host',
  template: `
    <div class="loader-story-host">
      <app-loader></app-loader>
    </div>
  `,
  styles: [
    `
      .loader-story-host {
        position: relative;
        min-height: 160px;
        padding: 24px;
        background: #f3f5f7;
      }
    `,
  ],
})
class LoaderStoryHostComponent implements OnInit, OnChanges {
  @Input() isLoading = true;

  constructor(private readonly uiService: UiService) {}

  ngOnInit(): void {
    this.updateLoaderState();
  }

  ngOnChanges(): void {
    this.updateLoaderState();
  }

  private updateLoaderState(): void {
    this.isLoading ? this.uiService.showLoader() : this.uiService.hideLoader();
  }
}

const meta: Meta<LoaderStoryHostComponent> = {
  title: 'Components/Loader',
  component: LoaderStoryHostComponent,
  subcomponents: { LoaderComponent },
  decorators: [
    moduleMetadata({
      declarations: [LoaderComponent, LoaderStoryHostComponent],
      imports: [CommonModule, MatProgressSpinnerModule],
      providers: [{ provide: UiService, useClass: MockUiService }],
    }),
  ],
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
      description: 'Controls the visibility of the loader overlay.',
    },
  },
};

export default meta;
type Story = StoryObj<LoaderStoryHostComponent>;

export const Visible: Story = {
  args: {
    isLoading: true,
  },
};

export const Hidden: Story = {
  args: {
    isLoading: false,
  },
};
