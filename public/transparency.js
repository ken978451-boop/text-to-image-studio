import {
  applyTranslations,
  DEFAULT_LOCALE,
  normalizeLocale,
} from "./translations.js";

let currentLocale = DEFAULT_LOCALE;
const languageButtons = [...document.querySelectorAll("[data-locale]")];

function setLocale(locale) {
  currentLocale = normalizeLocale(locale);
  applyTranslations(currentLocale);
}

for (const button of languageButtons) {
  button.addEventListener("click", () => setLocale(button.dataset.locale));
}

setLocale(DEFAULT_LOCALE);

