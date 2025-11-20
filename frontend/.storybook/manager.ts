import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const auroraTheme = create({
  base: 'dark',
  brandTitle: 'Helpdesk Lite',
  brandUrl: 'https://github.com/dawid628/HelpdeskLite',
  colorPrimary: '#38bdf8',
  colorSecondary: '#a855f7',
  appBg: '#050b16',
  appContentBg: '#0b1120',
  appBorderColor: 'rgba(255, 255, 255, 0.08)',
  appBorderRadius: 16,
  textColor: '#f8fafc',
  textInverseColor: '#0f172a',
  barBg: '#0b1120',
  barTextColor: '#94a3b8',
  barSelectedColor: '#a855f7',
  inputBg: '#0f172a',
  inputBorder: 'rgba(148, 163, 184, 0.4)',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 12,
});

addons.setConfig({
  theme: auroraTheme,
});
