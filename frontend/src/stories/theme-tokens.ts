export interface ThemeColorToken {
  title: string;
  token: string;
  cssVar: string;
  hex: string;
  description: string;
}

export const themeColors: ThemeColorToken[] = [
  {
    title: 'Primary',
    token: '$primary-color',
    cssVar: '--color-primary',
    hex: '#3f51b5',
    description: 'Primary actions & highlights',
  },
  {
    title: 'Accent',
    token: '$accent-color',
    cssVar: '--color-accent',
    hex: '#ff4081',
    description: 'Secondary emphasis & focus',
  },
  {
    title: 'Warn',
    token: '$warn-color',
    cssVar: '--color-warn',
    hex: '#f44336',
    description: 'Errors, destructive actions',
  },
  {
    title: 'Success',
    token: '$success-color',
    cssVar: '--color-success',
    hex: '#4caf50',
    description: 'Positive confirmations',
  },
  {
    title: 'Info',
    token: '$info-color',
    cssVar: '--color-info',
    hex: '#2196f3',
    description: 'Informational banners',
  },
];
