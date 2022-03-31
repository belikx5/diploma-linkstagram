const LANGUAGE_KEY_IN_LS = "UILanguage";

export const getUILanguage = (): string =>
  localStorage.getItem(LANGUAGE_KEY_IN_LS) ?? "en";

export const setUILanguage = (language: string) =>
  localStorage.setItem(LANGUAGE_KEY_IN_LS, language);
