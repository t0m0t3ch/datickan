# STEP 1: Analisi di Usabilità e Refactoring della Homepage

## Obiettivo
Adattare la homepage della personalizzazione CKAN 2.11.3 ai dettami delle "Linee guida di design per i siti e servizi digitali della PA" (AGID) e al design system del Comune di Brescia, garantendo accessibilità completa (WCAG AA) e usabilità ottimale.

## 1. Struttura del Progetto Analizzata

### Directory Principali
- **`public/base/`** - Asset statici compilati (CSS, JS, immagini)
- **`public/base/scss/`** - Sorgenti SCSS (dove modificare gli stili)
- **`templates/home/`** - Template Jinja della homepage
- **`templates/home/snippets/`** - Snippet riutilizzabili (search, promoted, etc.)

### File Chiave Identificati
1. **`templates/home/index.html`** - Template principale homepage (layout)
2. **`templates/home/snippets/search.html`** - Snippet blocco ricerca
3. **`public/base/scss/_homepage.scss`** - Stili CSS homepage
4. **`public/base/scss/_custom.scss`** - Stili personalizzati globali

## 2. Problemi Identificati

### 2.1 Problemi HTML Strutturali (index.html)

#### Linea 9: Landmark semantico assente
```html
<!-- ATTUALE -->
<div class="homepage">
  <div id="content" class="container">
    {{ self.flash() }}
  </div>
  {% block primary_content %}
    <div role="main">  <!-- role="main" ok, ma potrebbe essere <main> -->
```

**Problema:**
- Usa `<div role="main">` anzi ché il tag semantico `<main>`
- Questo funziona, ma non è lo standard HTML5 moderno
- Il tag `<main>` è preferibile per accessibilità (più robusto con AT)

**Soluzione:** Rimpiazzare con `<main id="main-content">` e associarvi lo skip-link

#### Linea 14: Problema Gerarchia Heading (h1 mancante)
```html
<!-- ATTUALE -->
<div role="main">
  <div class="main hero">
    <!-- No <h1> qui! È il problema che vediamo nel sito -->
```

**Problema:**
- La homepage non ha un `<h1>` visibile
- Questo viola WCAG 2.1: ogni pagina deve avere un `<h1>`
- Rende difficile la navigazione per gli screen reader

**Soluzione:** Aggiungere un `<h1>` nascosto (sr-only) o visibile nel hero

#### Linea 24-31: Duplicazione logica della sezione ricerca
```html
<!-- PROBLEMA: Sezione ricerca ripetuta -->
<div class="col-md-6">
  {% block search %}
  {% snippet 'home/snippets/search.html', search_facets=search_facets %}
  {% endblock %}
</div>

<!-- ... dopo ... -->
<div class="col-md-6">
  {% block search %}
  {% snippet 'home/snippets/search.html', search_facets=search_facets %}
  {% endblock %}
</div>
```

**Problema:**
- Stesso block `search` e stesso snippet usato due volte
- Genera duplicate form di ricerca con `id` identici!
- Viola WCAG: id non possono essere duplicati
- Confonde gli utenti e i tool di assistenza

**Soluzione:** Rimuovere la duplicazione, mantenere una sola sezione ricerca

### 2.2 Problemi nel Snippet Ricerca (search.html)

#### Linea 7: Titolo con tag sbagliato
```html
<!-- ATTUALE -->
<h3 class="heading">{{ _("Search data") }}</h3>
```

**Problema:**
- Usa `<h3>` quando dovrebbe essere `<h2>` (gerarchia: h1 pagina -> h2 sezioni)
- Il placeholder all'interno del form è in inglese hard-coded

**Soluzione:** Cambiare in `<h2>` per coerenza gerarchica

#### Linea 8: Classe CSS confusa
```html
<!-- ATTUALE -->
<div class="search-input form-group search-form">
```

**Problema:**
- Classe `search-form` è ripetuta (linea 6 ha la stessa classe su `<form>`)
- Causa conflitti CSS e confusione di specificity

**Soluzione:** Consolidare le classi, usare BEM (es. `search-form__input-wrapper`)

#### Linea 9-12: Input + Button Layout
```html
<input aria-label="{% block header_site_search_label %}..."/>
<button class="btn" type="submit" aria-labelledby="search-label">
  <i class="fa fa-search"></i>  <!-- Icona Font Awesome -->
</button>
<span class="sr-only" id="search-label">{{ _('Search') }}</span>
```

**Problema (potenziale):**
- Button con sola icona: l'aria-labelledby="search-label" è OK
- Ma la relazione potrebbe non essere chiara a tutti gli AT

**Soluzione:** Aggiungere aria-label diretto o testo visibile accanto all'icona in alcuni casi

### 2.3 Problemi CSS/SCSS (_homepage.scss)

#### Linea 16: Colore background conflitto
```scss
.module-search {
  background-color: $mastheadBackgroundColor;  // Variabile SCSS
  padding: 30px 20px;
}
```

**Problema:**
- Se `$mastheadBackgroundColor` è uguale al colore testo della navbar, contrasto insufficiente
- Non è verificato il rapporto di contrasto WCAG AA (4.5:1 minimo)

**Soluzione:** 
- Controllare contrasto reale (testo su questo sfondo)
- Se insufficiente, cambiare il colore background o il testo

#### Linea 23-24: Focus State assente
```scss
button {
  border: none;
  margin-left: -40px;  // Hack negativo! Problema di align
  // NO focus state!
}
```

**Problema:**
- Pulsante non ha stato :focus visibile
- Viola WCAG 2.4.7: Focus Visible (must-have per tastiera)
- Il margin-left negativo è un hack che causa problemi di responsive

**Soluzione:**
- Aggiungere `&:focus, &:focus-visible { outline: 3px solid $focusColor; }`
- Rimuovere il margin-left negativo, usare flexbox correttamente

#### Mancanza di Palette Comune di Brescia
```scss
// ATTUALMENTE:
$mastheadTextColor = ?
$mastheadBackgroundColor = ?
// NON SPECIFICATO nel file!
```

**Problema:**
- Non è chiaro quali colori sono usati
- Nessun commento sulla palette del Comune di Brescia
- Rendere impossibile verif contrasto

**Soluzione:**
- Documentare palette colori (Primary, Secondary, Accent, Neutral)
- Allineare con www.comune.brescia.it
- Verificare WCAG AA contrasti

### 2.4 Problemi di Usabilità e Menu Contestuali (Navbar)

#### Problema Menu Utente (screenshot homepage)
```
DEFAULT ▼  <!-- Menu utente poco intuitivo -->
```

**Problema:**
- Testo "DEFAULT" non è comprensibile
- Dovrebbe essere il nome utente o "Account" o "Login"
- Il dropdown non è keyboard-navigable (da verificare in produzione)
- Focus state non visibile

**Soluzione:**
- Rinominare menu
- Assicurare keyboard nav (Tab, Enter, Esc)
- Aggiungere focus outline visibile

#### Doppi campi di ricerca (navbar + hero section)
- **Navbar:** Campo ricerca compatto
- **Hero section:** Campo ricerca "Search data" ampio

**Problema:**
- Ridondanza confusionaria
- Utente non sa qual è il "primario"
- Entrambi portano alla stessa funzionalità

**Soluzione:**
- Mantenere uno solo dei due come principale
- Se entrambi necessari, differenziarli chiaramente (filtri diversi?)

## 3. Checklist di Refactoring STEP 1

### 3.1 HTML Refactoring (index.html)

- [ ] **Skip-link aggiunto:** Creare un link "Vai al contenuto principale" con classe `sr-only` che punta a `#main-content`
- [ ] **Landmark <main>:** Rimpiazzare `<div role="main">` con `<main id="main-content">`
- [ ] **H1 aggiunto:** Inserire un `<h1>` (visibile o sr-only) "Catalogo dati aperto del Comune di Brescia"
- [ ] **Blocco ricerca deduplicato:** Mantenere UN SOLO `{% block search %}` nel template
- [ ] **Gerarchia heading:** Verificare che ogni `<h2>`, `<h3>` sia in ordine logico
- [ ] **Attributi aria-label:** Verificare che tutti gli input e button abbiano labels semantiche

### 3.2 CSS/SCSS Refactoring (_homepage.scss)

- [ ] **Variabili colore documentate:** Aggiungere commenti con codici colore Comune Brescia
- [ ] **Contrasto verificato:** Controllare rapporto minimo 4.5:1 (testo su sfondo)
- [ ] **Focus state:** Aggiungere `:focus-visible { outline: 3px solid #...}` su button/input
- [ ] **Rimuovere hack:** Eliminare `margin-left: -40px`, usare flexbox
- [ ] **Responsive migliorato:** Verificare layout su mobile (320px, 768px, 1024px)
- [ ] **Classi CSS coerenti:** Rinominare se necessario (BEM convention)

### 3.3 Snippet Ricerca (search.html)

- [ ] **H3 -> H2:** Cambiare titolo in `<h2 class="search-heading">{{ _("Ricerca dataset") }}</h2>`
- [ ] **Consolidare classi:** Semplificare `.search-form` + `.search-input`
- [ ] **Accessibilità input:** Assicurare che aria-label sia chiaro
- [ ] **Button icon label:** Considerare aria-label diretto se l'icona è l'unico indicatore

### 3.4 Navbar / Menu Contestuali

- [ ] **"DEFAULT" rinominato:** Cambiare in "Account", "Profilo", o nome utente
- [ ] **Keyboard navigation:** Tab -> Focus su voci menu -> Enter seleziona -> Esc chiude
- [ ] **Focus visible:** Outline visibile su menu item (3px solid, buon contrasto)
- [ ] **Deduplica ricerca:** Decidere se mantenere 1 o 2 campi ricerca, se 1 posizionare bene

## 4. Riferimenti e Linee Guida

### Design-Italia (AGID)
- https://designers.italia.it/
- Pattern: Typography, Button, Form, Navigation
- Spacing, Colors, Focus States

### WCAG 2.1 Livello AA
- 2.4.7 Focus Visible
- 1.4.3 Contrast (Minimum)
- 2.4.2 Page Titled
- 1.3.1 Info and Relationships
- 2.1.1 Keyboard

### Comune di Brescia Palette (da verificare su www.comune.brescia.it)
- Primary: Blu (tipo #0066CC o #003399)
- Secondary: Arancio (tipo #FF6600 o #E67E22)
- Neutral: Grigio (tipo #666666, #CCCCCC)
- Success/Error/Info: Standard web colors

## 5. Prossimi Passi

1. **COMMIT 1:** Creare file HTML refactored con landmark e h1
2. **COMMIT 2:** Refactoring CSS/SCSS con focus state e variabili colore
3. **COMMIT 3:** Snippet ricerca migliorato (h2, aria-label, consolidate classes)
4. **COMMIT 4:** Navbar e menu contestuali fix (keyboard nav, focus visible)
5. **TEST:** Verificare con Chrome Lighthouse, WAVE, Screen Reader (NVDA/JAWS)

---

## Note per il Neofita

Ogni sezione di questo documento è stata scritta per spiegare:
- **Il problema** (cosa c'è di sbagliato in dettaglio)
- **Perché è un problema** (impatto su usabilità e accessibility)
- **La soluzione** (come correggerlo, con esempio di codice)

Durante il refactoring, leggeremo ogni sezione e applicheremo le soluzioni passo passo, verificando il risultato sia nel browser che con tool di testing.
