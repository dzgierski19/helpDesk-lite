import type { Meta, StoryObj } from '@storybook/angular';
import { PriorityBadgeComponent } from './priority-badge.component';

const meta: Meta<PriorityBadgeComponent> = {
  title: 'Shared/PriorityBadge',
  component: PriorityBadgeComponent,
};

export default meta;

type Story = StoryObj<PriorityBadgeComponent>;

export const Low: Story = {
  args: {},
  // TODO: provide realistic example once component props are defined
};
