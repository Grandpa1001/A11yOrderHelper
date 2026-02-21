/**
 * Konfiguracja wyglądu overlay: badge (numerki), linie, kontener.
 */
export interface OverlayThemeConfig {
  badgeBackground: string;
  badgeColor: string;
  badgeBorder: string;
  badgeBorderColor: string;
  badgeBorderRadius: string;
  badgeMinWidth: string;
  badgeHeight: string;
  badgeFontSize: string;
  badgeFontWeight: string;
  containerBackground: string;
}

export type OverlayThemeName = "default" | "minimal";

export const defaultTheme: OverlayThemeConfig = {
  badgeBackground: "#ffeb3b",
  badgeColor: "#000",
  badgeBorder: "2px solid",
  badgeBorderColor: "#000",
  badgeBorderRadius: "4px",
  badgeMinWidth: "1.5rem",
  badgeHeight: "1.5rem",
  badgeFontSize: "0.875rem",
  badgeFontWeight: "700",
  containerBackground: "rgba(255, 255, 255, 0.5)",
};

export const minimalTheme: OverlayThemeConfig = {
  badgeBackground: "rgba(255, 255, 255, 0.95)",
  badgeColor: "#333",
  badgeBorder: "1px solid",
  badgeBorderColor: "#666",
  badgeBorderRadius: "3px",
  badgeMinWidth: "1.25rem",
  badgeHeight: "1.25rem",
  badgeFontSize: "0.75rem",
  badgeFontWeight: "600",
  containerBackground: "rgba(255, 255, 255, 0.5)",
};

const themes: Record<OverlayThemeName, OverlayThemeConfig> = {
  default: defaultTheme,
  minimal: minimalTheme,
};

export function getTheme(name: OverlayThemeName | string): OverlayThemeConfig {
  return themes[name as OverlayThemeName] ?? defaultTheme;
}
