export type Language = 'en' | 'fi' | 'sv';

export interface Translations {
  // Common
  appName: string;
  uploadImage: string;
  dragDropOrClick: string;
  selectImage: string;
  
  // Modes
  draw: string;
  move: string;
  delete: string;
  drawMode: string;
  moveMode: string;
  deleteMode: string;
  
  // Actions
  undo: string;
  redo: string;
  clearAll: string;
  exportImage: string;
  saveProject: string;
  loadProject: string;
  newImage: string;
  
  // Settings
  paperSize: string;
  measurementUnit: string;
  imageAdjustments: string;
  gridSettings: string;
  showGrid: string;
  opacity: string;
  
  // Image adjustments
  grayscale: string;
  brightness: string;
  contrast: string;
  rotation: string;
  reset: string;
  enableCrop: string;
  
  // Units
  millimeters: string;
  centimeters: string;
  inches: string;
  
  // Paper sizes
  a6: string;
  a5: string;
  a4: string;
  a3: string;
  a2: string;
  a1: string;
  a0: string;
  usLetter: string;
  usLegal: string;
  usTabloid: string;
  
  // Coordinates
  measurementCoordinates: string;
  intersectionPoints: string;
  point: string;
  points: string;
  
  // Projects
  projects: string;
  show: string;
  hide: string;
  noSavedProjects: string;
  deleteProject: string;
  projectSaved: string;
  
  // Instructions
  howToDraw: string;
  howToMove: string;
  howToDelete: string;
  clickAndDrag: string;
  linesAutoExtend: string;
  holdShift: string;
  disableSnapping: string;
  orangeDot: string;
  showsSnapping: string;
  longPress: string;
  hoverHighlight: string;
  clickToDelete: string;
  intersectionPointsAppear: string;
  
  // Snap
  snap: string;
  noSnap: string;
  snapEnabled: string;
  snapDisabled: string;
  
  // Theme
  lightMode: string;
  darkMode: string;
  highContrast: string;
  
  // Footer
  tagline: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'MeasureOver',
    uploadImage: 'Upload Image',
    dragDropOrClick: 'Drag and drop an image here, or click to select',
    selectImage: 'Select Image',
    draw: 'Draw',
    move: 'Move',
    delete: 'Delete',
    drawMode: 'Draw mode: Click and drag to create lines',
    moveMode: 'Move mode: Click and drag lines to reposition them',
    deleteMode: 'Delete mode: Click on lines to delete them',
    undo: 'Undo',
    redo: 'Redo',
    clearAll: 'Clear All',
    exportImage: 'Export Image',
    saveProject: 'Save Current Project',
    loadProject: 'Load Project',
    newImage: 'New Image',
    paperSize: 'Paper Size',
    measurementUnit: 'Measurement Unit',
    imageAdjustments: 'Image Adjustments',
    gridSettings: 'Grid Settings',
    showGrid: 'Show Grid',
    opacity: 'Opacity',
    grayscale: 'Grayscale',
    brightness: 'Brightness',
    contrast: 'Contrast',
    rotation: 'Rotation',
    reset: 'Reset',
    enableCrop: 'Enable Crop',
    millimeters: 'Millimeters (mm)',
    centimeters: 'Centimeters (cm)',
    inches: 'Inches (in)',
    a6: 'A6 (105 × 148 mm)',
    a5: 'A5 (148 × 210 mm)',
    a4: 'A4 (210 × 297 mm)',
    a3: 'A3 (297 × 420 mm)',
    a2: 'A2 (420 × 594 mm)',
    a1: 'A1 (594 × 841 mm)',
    a0: 'A0 (841 × 1189 mm)',
    usLetter: 'US Letter (8.5 × 11 in)',
    usLegal: 'US Legal (8.5 × 14 in)',
    usTabloid: 'US Tabloid (11 × 17 in)',
    measurementCoordinates: 'Measurement Coordinates',
    intersectionPoints: 'Intersection points in',
    point: 'point',
    points: 'points',
    projects: 'Projects',
    show: 'Show',
    hide: 'Hide',
    noSavedProjects: 'No saved projects',
    deleteProject: 'Delete this project?',
    projectSaved: 'Project saved successfully!',
    howToDraw: 'How to draw:',
    howToMove: 'How to move lines:',
    howToDelete: 'How to delete lines:',
    clickAndDrag: 'Click and drag to draw a line',
    linesAutoExtend: 'Lines automatically extend to canvas edges',
    holdShift: 'Hold',
    disableSnapping: 'to disable snapping for diagonal lines',
    orangeDot: 'Orange dot',
    showsSnapping: 'appears when snapping is active',
    longPress: 'Long press (200ms)',
    hoverHighlight: 'Hover over lines to see which one will be moved',
    clickToDelete: 'Click on a line to delete it',
    intersectionPointsAppear: 'Intersection points appear automatically',
    snap: 'Snap',
    noSnap: 'No Snap',
    snapEnabled: 'Snapping enabled - Hold Shift to disable temporarily',
    snapDisabled: 'Snapping disabled',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    highContrast: 'High Contrast',
    tagline: 'Fast, lightweight image measurement tool',
  },
  fi: {
    appName: 'MeasureOver',
    uploadImage: 'Lataa kuva',
    dragDropOrClick: 'Vedä ja pudota kuva tähän tai klikkaa valitaksesi',
    selectImage: 'Valitse kuva',
    draw: 'Piirrä',
    move: 'Siirrä',
    delete: 'Poista',
    drawMode: 'Piirtotila: Klikkaa ja vedä luodaksesi viivoja',
    moveMode: 'Siirtotila: Klikkaa ja vedä viivoja siirtääksesi niitä',
    deleteMode: 'Poistotila: Klikkaa viivoja poistaaksesi ne',
    undo: 'Kumoa',
    redo: 'Tee uudelleen',
    clearAll: 'Tyhjennä kaikki',
    exportImage: 'Vie kuva',
    saveProject: 'Tallenna projekti',
    loadProject: 'Lataa projekti',
    newImage: 'Uusi kuva',
    paperSize: 'Paperikoko',
    measurementUnit: 'Mittayksikkö',
    imageAdjustments: 'Kuvan säätö',
    gridSettings: 'Ruudukkoasetukset',
    showGrid: 'Näytä ruudukko',
    opacity: 'Läpinäkyvyys',
    grayscale: 'Harmaan sävy',
    brightness: 'Kirkkaus',
    contrast: 'Kontrasti',
    rotation: 'Kierto',
    reset: 'Nollaa',
    enableCrop: 'Ota rajaus käyttöön',
    millimeters: 'Millimetrit (mm)',
    centimeters: 'Senttimetrit (cm)',
    inches: 'Tuumat (in)',
    a6: 'A6 (105 × 148 mm)',
    a5: 'A5 (148 × 210 mm)',
    a4: 'A4 (210 × 297 mm)',
    a3: 'A3 (297 × 420 mm)',
    a2: 'A2 (420 × 594 mm)',
    a1: 'A1 (594 × 841 mm)',
    a0: 'A0 (841 × 1189 mm)',
    usLetter: 'US Letter (8.5 × 11 tuumaa)',
    usLegal: 'US Legal (8.5 × 14 tuumaa)',
    usTabloid: 'US Tabloid (11 × 17 tuumaa)',
    measurementCoordinates: 'Mittauskoordinaatit',
    intersectionPoints: 'Leikkauspisteet',
    point: 'piste',
    points: 'pistettä',
    projects: 'Projektit',
    show: 'Näytä',
    hide: 'Piilota',
    noSavedProjects: 'Ei tallennettuja projekteja',
    deleteProject: 'Poistetaanko projekti?',
    projectSaved: 'Projekti tallennettu onnistuneesti!',
    howToDraw: 'Miten piirretään:',
    howToMove: 'Miten siirretään viivoja:',
    howToDelete: 'Miten poistetaan viivoja:',
    clickAndDrag: 'Klikkaa ja vedä piirtääksesi viivan',
    linesAutoExtend: 'Viivat ulottuvat automaattisesti kuvan reunoihin',
    holdShift: 'Pidä',
    disableSnapping: 'poistaaksesi napautuksen käytöstä vinoille viivoille',
    orangeDot: 'Oranssi piste',
    showsSnapping: 'näkyy kun napautus on aktiivinen',
    longPress: 'Pitkä painallus (200ms)',
    hoverHighlight: 'Vie hiiri viivojen päälle nähdäksesi mikä siirretään',
    clickToDelete: 'Klikkaa viivaa poistaaksesi sen',
    intersectionPointsAppear: 'Leikkauspisteet ilmestyvät automaattisesti',
    snap: 'Napautus',
    noSnap: 'Ei napautusta',
    snapEnabled: 'Napautus käytössä - Pidä Shift poistaaksesi väliaikaisesti',
    snapDisabled: 'Napautus poistettu käytöstä',
    lightMode: 'Vaalea tila',
    darkMode: 'Tumma tila',
    highContrast: 'Korkea kontrasti',
    tagline: 'Nopea, kevyt kuvamittausväline',
  },
  sv: {
    appName: 'MeasureOver',
    uploadImage: 'Ladda upp bild',
    dragDropOrClick: 'Dra och släpp en bild här, eller klicka för att välja',
    selectImage: 'Välj bild',
    draw: 'Rita',
    move: 'Flytta',
    delete: 'Radera',
    drawMode: 'Ritläge: Klicka och dra för att skapa linjer',
    moveMode: 'Flyttläge: Klicka och dra linjer för att flytta dem',
    deleteMode: 'Raderaläge: Klicka på linjer för att radera dem',
    undo: 'Ångra',
    redo: 'Gör om',
    clearAll: 'Rensa allt',
    exportImage: 'Exportera bild',
    saveProject: 'Spara projekt',
    loadProject: 'Ladda projekt',
    newImage: 'Ny bild',
    paperSize: 'Pappersstorlek',
    measurementUnit: 'Mätenhet',
    imageAdjustments: 'Bildjusteringar',
    gridSettings: 'Rutnätsinställningar',
    showGrid: 'Visa rutnät',
    opacity: 'Opacitet',
    grayscale: 'Gråskala',
    brightness: 'Ljusstyrka',
    contrast: 'Kontrast',
    rotation: 'Rotation',
    reset: 'Återställ',
    enableCrop: 'Aktivera beskärning',
    millimeters: 'Millimeter (mm)',
    centimeters: 'Centimeter (cm)',
    inches: 'Tum (in)',
    a6: 'A6 (105 × 148 mm)',
    a5: 'A5 (148 × 210 mm)',
    a4: 'A4 (210 × 297 mm)',
    a3: 'A3 (297 × 420 mm)',
    a2: 'A2 (420 × 594 mm)',
    a1: 'A1 (594 × 841 mm)',
    a0: 'A0 (841 × 1189 mm)',
    usLetter: 'US Letter (8.5 × 11 tum)',
    usLegal: 'US Legal (8.5 × 14 tum)',
    usTabloid: 'US Tabloid (11 × 17 tum)',
    measurementCoordinates: 'Mätkoordinater',
    intersectionPoints: 'Skärningspunkter i',
    point: 'punkt',
    points: 'punkter',
    projects: 'Projekt',
    show: 'Visa',
    hide: 'Dölj',
    noSavedProjects: 'Inga sparade projekt',
    deleteProject: 'Radera detta projekt?',
    projectSaved: 'Projektet sparades framgångsrikt!',
    howToDraw: 'Hur man ritar:',
    howToMove: 'Hur man flyttar linjer:',
    howToDelete: 'Hur man raderar linjer:',
    clickAndDrag: 'Klicka och dra för att rita en linje',
    linesAutoExtend: 'Linjer sträcker sig automatiskt till kanvaskanter',
    holdShift: 'Håll',
    disableSnapping: 'för att inaktivera snapning för diagonala linjer',
    orangeDot: 'Orange punkt',
    showsSnapping: 'visas när snapning är aktiv',
    longPress: 'Långtryck (200ms)',
    hoverHighlight: 'Hovra över linjer för att se vilken som flyttas',
    clickToDelete: 'Klicka på en linje för att radera den',
    intersectionPointsAppear: 'Skärningspunkter visas automatiskt',
    snap: 'Snap',
    noSnap: 'Ingen snap',
    snapEnabled: 'Snapning aktiverad - Håll Shift för att inaktivera tillfälligt',
    snapDisabled: 'Snapning inaktiverad',
    lightMode: 'Ljust läge',
    darkMode: 'Mörkt läge',
    highContrast: 'Hög kontrast',
    tagline: 'Snabb, lätt bildmätningsverktyg',
  },
};

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function t(key: keyof Translations): string {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

export function getTranslations(): Translations {
  return translations[currentLanguage];
}

// Initialize language from browser or localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('measureover-language');
  if (stored && (stored === 'en' || stored === 'fi' || stored === 'sv')) {
    setLanguage(stored as Language);
  } else {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fi')) {
      setLanguage('fi');
    } else if (browserLang.startsWith('sv')) {
      setLanguage('sv');
    } else {
      setLanguage('en');
    }
  }
}
