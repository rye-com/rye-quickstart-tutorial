import { ThemeEnum } from '../Components/Tutorial/types';

export function detectThemePreference(): string {
  const currentTheme = window.localStorage.getItem('appTheme');
  if (currentTheme) {
    return JSON.parse(currentTheme);
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? ThemeEnum.Dark.valueOf() : ThemeEnum.Light.valueOf();
}
