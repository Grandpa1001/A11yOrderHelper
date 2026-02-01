# A11Y Order Helper

Rozszerzenie do Chrome wizualizujące **kolejność focus (tab order)** na stronie — numerki na elementach focusable oraz linie łączące je w kolejności. Przydatne do audytu dostępności (a11y).

## Wymagania

- Node.js (LTS)
- npm

## Budowa

```bash
npm install
npm run build
```

Wynik budowy: katalog `dist/`.

## Ładowanie w Chrome

1. Otwórz `chrome://extensions/`.
2. Włącz **Tryb deweloperski** (przełącznik w prawym górnym rogu).
3. Kliknij **Załaduj rozpakowane**.
4. Wybierz katalog **`dist`** z tego projektu.

Po zmianach w kodzie uruchom ponownie `npm run build` i w `chrome://extensions/` kliknij ikonę odświeżania przy rozszerzeniu.

## Użycie

1. Otwórz dowolną stronę.
2. Kliknij ikonę rozszerzenia A11Y Order Helper na pasku narzędzi.
3. Kliknij **Uruchom** — na stronie pojawi się warstwa z numerami (1, 2, 3, …) na elementach focusable i liniami łączącymi je w kolejności tab order. Scroll strony jest zablokowany.
4. **Przezroczystość** — suwak w popup: 0 = tylko mapa (białe tło), wyższa wartość = widać stronę pod spodem.
5. Kliknij **Wyłącz** — overlay znika, scroll strony wraca.

## Ikony

Źródło ikony: `public/icons/icon.svg` (trzy kółka + strzałka, kolejność focus). PNG (16, 48, 128 px) generowane skryptem:

```bash
npm run icons
```

Build uruchamia `icons` przed Vite — po zmianie `icon.svg` wystarczy `npm run build`.

## Dokumentacja

- **Analiza.md** — plan developmentu, architektura, etapy.
- **DEV.md** — zasady developmentu, checklist przed zakończeniem pracy.

## Licencja

Zobacz plik [LICENSE](LICENSE).
