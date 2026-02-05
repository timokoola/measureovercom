export type Language = 'en' | 'fi' | 'sv' | 'fr' | 'es' | 'de';

export interface Translations {
  // Common
  appName: string;
  uploadImage: string;
  dragDropOrClick: string;
  selectImage: string;
  
  // Modes
  cross: string;
  line: string;
  crossMode: string;
  lineMode: string;
  linePending: string;
  lineCount: string;
  lineCountPlural: string;
  
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
  paperSizeDescription: string;
  measurementUnit: string;
  imageAdjustments: string;
  gridSettings: string;
  showGrid: string;
  opacity: string;
  gridDescription: string;
  lineThickness: string;
  lineThicknessHelp: string;
  
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
  drawLinesToSeeCoordinates: string;
  pointLabel: string;
  xLabel: string;
  yLabel: string;
  point: string;
  points: string;
  
  // Projects
  projects: string;
  show: string;
  hide: string;
  noSavedProjects: string;
  deleteProject: string;
  deleteProjectAria: string;
  projectSaved: string;
  
  // Instructions
  measurementTool: string;
  crossInstructionsTitle: string;
  lineInstructionsTitle: string;
  crossClickOnce: string;
  crossAddsLines: string;
  linesAutoExtend: string;
  lineClickFirst: string;
  lineExactPlacement: string;
  lineCancel: string;
  dragHandlesHint: string;
  intersectionPointsAppear: string;
  
  // Upload
  invalidImage: string;
  uploadImageAria: string;

  // Accessibility / labels
  measurementCanvasLabel: string;
  noLinesDrawn: string;
  linesDrawn: string;
  dragHandleTop: string;
  dragHandleBottom: string;
  dragHandleLeft: string;
  dragHandleRight: string;
  selectLanguage: string;
  paperSizeAria: string;
  unitAria: string;
  gridOpacityAria: string;
  lineThicknessAria: string;
  brightnessAria: string;
  contrastAria: string;
  rotationAria: string;
  rotateCcwAria: string;
  rotateCwAria: string;
  resetRotationAria: string;
  cropNote: string;
  drawLinesForIntersections: string;
  switchToMode: string;
  switchColorMode: string;
  colorModeDefault: string;
  colorModeHighContrast: string;
  error: string;
  
  // Theme
  lightMode: string;
  darkMode: string;
  highContrast: string;
  
  // Footer
  tagline: string;
  pageTitle: string;
  pageDescription: string;
  footerRights: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'MeasureOver',
    uploadImage: 'Upload Image',
    dragDropOrClick: 'Drag and drop an image here, or click to select',
    selectImage: 'Select Image',
    cross: 'Cross',
    line: 'Line',
    crossMode: 'Cross mode: Click to add vertical + horizontal lines',
    lineMode: 'Line mode: Click two points to place a line',
    linePending: 'Line pending...',
    lineCount: 'line',
    lineCountPlural: 'lines',
    undo: 'Undo',
    redo: 'Redo',
    clearAll: 'Clear All',
    exportImage: 'Export Image',
    saveProject: 'Save Current Project',
    loadProject: 'Load Project',
    newImage: 'New Image',
    paperSize: 'Paper Size',
    paperSizeDescription: 'Coordinates will be scaled to match the selected paper size',
    measurementUnit: 'Measurement Unit',
    imageAdjustments: 'Image Adjustments',
    gridSettings: 'Grid Settings',
    showGrid: 'Show Grid',
    opacity: 'Opacity',
    gridDescription: 'Grid overlay helps align lines visually',
    lineThickness: 'Line Thickness',
    lineThicknessHelp: 'Thicker lines are easier to see on mobile devices',
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
    drawLinesToSeeCoordinates: 'Draw lines to see intersection coordinates',
    point: 'point',
    points: 'points',
    pointLabel: 'Point',
    xLabel: 'X:',
    yLabel: 'Y:',
    projects: 'Projects',
    show: 'Show',
    hide: 'Hide',
    noSavedProjects: 'No saved projects',
    deleteProject: 'Delete this project?',
    deleteProjectAria: 'Delete project',
    projectSaved: 'Project saved successfully!',
    measurementTool: 'Measurement Tool',
    crossInstructionsTitle: 'Cross mode:',
    lineInstructionsTitle: 'Line mode:',
    crossClickOnce: 'Click once to place a crosshair at that point',
    crossAddsLines: 'Adds one vertical and one horizontal line',
    linesAutoExtend: 'Lines automatically extend to canvas edges',
    lineClickFirst: 'Click the first point, then click the second point',
    lineExactPlacement: 'Line is placed exactly where you click (no snapping)',
    lineCancel: 'Press Esc to cancel the pending line',
    dragHandlesHint: 'Drag edge handles to add a vertical or horizontal line',
    intersectionPointsAppear: 'Intersection points appear automatically',
    invalidImage: 'Please select an image file',
    uploadImageAria: 'Upload image file',
    measurementCanvasLabel: 'Measurement canvas - add lines using the selected mode. Press Escape to clear all lines.',
    noLinesDrawn: 'No lines drawn',
    linesDrawn: 'lines drawn',
    dragHandleTop: 'Drag to add horizontal line (top)',
    dragHandleBottom: 'Drag to add horizontal line (bottom)',
    dragHandleLeft: 'Drag to add vertical line (left)',
    dragHandleRight: 'Drag to add vertical line (right)',
    selectLanguage: 'Select language',
    paperSizeAria: 'Select paper size for coordinate scaling',
    unitAria: 'Select measurement unit',
    gridOpacityAria: 'Adjust grid opacity',
    lineThicknessAria: 'Adjust line thickness',
    brightnessAria: 'Adjust brightness',
    contrastAria: 'Adjust contrast',
    rotationAria: 'Rotate image',
    rotateCcwAria: 'Rotate 90° counter-clockwise',
    rotateCwAria: 'Rotate 90° clockwise',
    resetRotationAria: 'Reset rotation',
    cropNote: 'Note: Crop functionality is basic. For advanced cropping, use image editing software before uploading.',
    drawLinesForIntersections: 'Draw lines to see intersection coordinates',
    switchToMode: 'Switch to',
    switchColorMode: 'Switch to',
    colorModeDefault: 'default',
    colorModeHighContrast: 'high contrast',
    error: 'Error',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    highContrast: 'High Contrast',
    tagline: 'Fast, lightweight image measurement tool',
    pageTitle: 'MeasureOver - Image Measurement Tool',
    pageDescription: 'MeasureOver - Fast, lightweight image measurement tool for drawing guidance. Upload images and draw measurement lines with coordinate calculations.',
    footerRights: '© 2026 Timo Koola. All rights reserved.',
  },
  fi: {
    appName: 'MeasureOver',
    uploadImage: 'Lataa kuva',
    dragDropOrClick: 'Vedä ja pudota kuva tähän tai klikkaa valitaksesi',
    selectImage: 'Valitse kuva',
    cross: 'Risti',
    line: 'Viiva',
    crossMode: 'Ristitila: Klikkaa lisätäksesi pysty- ja vaakaviivan',
    lineMode: 'Viivatila: Klikkaa kaksi pistettä viivan luomiseksi',
    linePending: 'Viiva odottaa...',
    lineCount: 'viiva',
    lineCountPlural: 'viivaa',
    undo: 'Kumoa',
    redo: 'Tee uudelleen',
    clearAll: 'Tyhjennä kaikki',
    exportImage: 'Vie kuva',
    saveProject: 'Tallenna projekti',
    loadProject: 'Lataa projekti',
    newImage: 'Uusi kuva',
    paperSize: 'Paperikoko',
    paperSizeDescription: 'Koordinaatit skaalataan valitun paperikoon mukaan',
    measurementUnit: 'Mittayksikkö',
    imageAdjustments: 'Kuvan säätö',
    gridSettings: 'Ruudukkoasetukset',
    showGrid: 'Näytä ruudukko',
    opacity: 'Läpinäkyvyys',
    gridDescription: 'Ruudukko auttaa linjojen kohdistamisessa',
    lineThickness: 'Viivan paksuus',
    lineThicknessHelp: 'Paksummat viivat näkyvät paremmin mobiilissa',
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
    intersectionPoints: 'Leikkauspisteet yksikössä',
    drawLinesToSeeCoordinates: 'Piirrä viivoja nähdäksesi leikkauspisteet',
    point: 'piste',
    points: 'pistettä',
    pointLabel: 'Piste',
    xLabel: 'X:',
    yLabel: 'Y:',
    projects: 'Projektit',
    show: 'Näytä',
    hide: 'Piilota',
    noSavedProjects: 'Ei tallennettuja projekteja',
    deleteProject: 'Poistetaanko projekti?',
    deleteProjectAria: 'Poista projekti',
    projectSaved: 'Projekti tallennettu onnistuneesti!',
    measurementTool: 'Mittatyökalu',
    crossInstructionsTitle: 'Ristitila:',
    lineInstructionsTitle: 'Viivatila:',
    crossClickOnce: 'Klikkaa kerran asettaaksesi ristikon',
    crossAddsLines: 'Lisää yhden pysty- ja yhden vaakaviivan',
    linesAutoExtend: 'Viivat ulottuvat automaattisesti kuvan reunoihin',
    lineClickFirst: 'Klikkaa ensimmäinen piste, sitten toinen',
    lineExactPlacement: 'Viiva asetetaan tarkasti klikkauskohtiin (ei napautusta)',
    lineCancel: 'Paina Esc peruaksesi keskeneräisen viivan',
    dragHandlesHint: 'Vedä reunakahvoista lisätäksesi pysty- tai vaakaviivan',
    intersectionPointsAppear: 'Leikkauspisteet ilmestyvät automaattisesti',
    invalidImage: 'Valitse kuvatiedosto',
    uploadImageAria: 'Lataa kuvatiedosto',
    measurementCanvasLabel: 'Mittauskanvaasi - lisää viivoja valitulla tilalla. Paina Esc tyhjentääksesi kaikki viivat.',
    noLinesDrawn: 'Ei viivoja',
    linesDrawn: 'viivaa piirretty',
    dragHandleTop: 'Vedä lisätäksesi vaakaviivan (ylä)',
    dragHandleBottom: 'Vedä lisätäksesi vaakaviivan (ala)',
    dragHandleLeft: 'Vedä lisätäksesi pystyviivan (vasen)',
    dragHandleRight: 'Vedä lisätäksesi pystyviivan (oikea)',
    selectLanguage: 'Valitse kieli',
    paperSizeAria: 'Valitse paperikoko koordinaattien skaalausta varten',
    unitAria: 'Valitse mittayksikkö',
    gridOpacityAria: 'Säädä ruudukon läpinäkyvyyttä',
    lineThicknessAria: 'Säädä viivan paksuutta',
    brightnessAria: 'Säädä kirkkautta',
    contrastAria: 'Säädä kontrastia',
    rotationAria: 'Kierrä kuvaa',
    rotateCcwAria: 'Kierrä 90° vastapäivään',
    rotateCwAria: 'Kierrä 90° myötäpäivään',
    resetRotationAria: 'Nollaa kierto',
    cropNote: 'Huom: Rajaus on yksinkertainen. Edistyneeseen rajaukseen käytä kuvanmuokkausta ennen latausta.',
    drawLinesForIntersections: 'Piirrä viivoja nähdäksesi leikkauspisteet',
    switchToMode: 'Vaihda',
    switchColorMode: 'Vaihda',
    colorModeDefault: 'oletus',
    colorModeHighContrast: 'korkea kontrasti',
    error: 'Virhe',
    lightMode: 'Vaalea tila',
    darkMode: 'Tumma tila',
    highContrast: 'Korkea kontrasti',
    tagline: 'Nopea, kevyt kuvamittausväline',
    pageTitle: 'MeasureOver - Kuvamittaustyökalu',
    pageDescription: 'MeasureOver - Nopea ja kevyt kuvamittaustyökalu piirustusten tueksi. Lataa kuvia ja piirrä mittaviivoja koordinaattilaskennalla.',
    footerRights: '© 2026 Timo Koola. Kaikki oikeudet pidätetään.',
  },
  sv: {
    appName: 'MeasureOver',
    uploadImage: 'Ladda upp bild',
    dragDropOrClick: 'Dra och släpp en bild här, eller klicka för att välja',
    selectImage: 'Välj bild',
    cross: 'Kors',
    line: 'Linje',
    crossMode: 'Korsläge: Klicka för att lägga till vertikal + horisontell linje',
    lineMode: 'Linjeläge: Klicka två punkter för att placera en linje',
    linePending: 'Linje väntar...',
    lineCount: 'linje',
    lineCountPlural: 'linjer',
    undo: 'Ångra',
    redo: 'Gör om',
    clearAll: 'Rensa allt',
    exportImage: 'Exportera bild',
    saveProject: 'Spara projekt',
    loadProject: 'Ladda projekt',
    newImage: 'Ny bild',
    paperSize: 'Pappersstorlek',
    paperSizeDescription: 'Koordinater skalas efter vald pappersstorlek',
    measurementUnit: 'Mätenhet',
    imageAdjustments: 'Bildjusteringar',
    gridSettings: 'Rutnätsinställningar',
    showGrid: 'Visa rutnät',
    opacity: 'Opacitet',
    gridDescription: 'Rutnätet hjälper till att justera linjer visuellt',
    lineThickness: 'Linjens tjocklek',
    lineThicknessHelp: 'Tjockare linjer syns bättre på mobiler',
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
    drawLinesToSeeCoordinates: 'Rita linjer för att se skärningspunkter',
    point: 'punkt',
    points: 'punkter',
    pointLabel: 'Punkt',
    xLabel: 'X:',
    yLabel: 'Y:',
    projects: 'Projekt',
    show: 'Visa',
    hide: 'Dölj',
    noSavedProjects: 'Inga sparade projekt',
    deleteProject: 'Radera detta projekt?',
    deleteProjectAria: 'Radera projekt',
    projectSaved: 'Projektet sparades framgångsrikt!',
    measurementTool: 'Mätverktyg',
    crossInstructionsTitle: 'Korsläge:',
    lineInstructionsTitle: 'Linjeläge:',
    crossClickOnce: 'Klicka en gång för att placera ett kors',
    crossAddsLines: 'Lägger till en vertikal och en horisontell linje',
    linesAutoExtend: 'Linjer sträcker sig automatiskt till kanvaskanter',
    lineClickFirst: 'Klicka första punkten, sedan den andra',
    lineExactPlacement: 'Linjen placeras exakt där du klickar (ingen snapning)',
    lineCancel: 'Tryck Esc för att avbryta den väntande linjen',
    dragHandlesHint: 'Dra i kanthandtag för att lägga till vertikal eller horisontell linje',
    intersectionPointsAppear: 'Skärningspunkter visas automatiskt',
    invalidImage: 'Välj en bildfil',
    uploadImageAria: 'Ladda upp bildfil',
    measurementCanvasLabel: 'Mätkanvas - lägg till linjer med valt läge. Tryck Esc för att rensa alla linjer.',
    noLinesDrawn: 'Inga linjer ritade',
    linesDrawn: 'linjer ritade',
    dragHandleTop: 'Dra för att lägga till horisontell linje (topp)',
    dragHandleBottom: 'Dra för att lägga till horisontell linje (botten)',
    dragHandleLeft: 'Dra för att lägga till vertikal linje (vänster)',
    dragHandleRight: 'Dra för att lägga till vertikal linje (höger)',
    selectLanguage: 'Välj språk',
    paperSizeAria: 'Välj pappersstorlek för koordinatskalning',
    unitAria: 'Välj måttenhet',
    gridOpacityAria: 'Justera rutnätets opacitet',
    lineThicknessAria: 'Justera linjens tjocklek',
    brightnessAria: 'Justera ljusstyrka',
    contrastAria: 'Justera kontrast',
    rotationAria: 'Rotera bild',
    rotateCcwAria: 'Rotera 90° moturs',
    rotateCwAria: 'Rotera 90° medurs',
    resetRotationAria: 'Återställ rotation',
    cropNote: 'Obs: Beskärningen är enkel. För avancerad beskärning, använd bildredigering innan uppladdning.',
    drawLinesForIntersections: 'Rita linjer för att se skärningspunkter',
    switchToMode: 'Byt till',
    switchColorMode: 'Byt till',
    colorModeDefault: 'standard',
    colorModeHighContrast: 'hög kontrast',
    error: 'Fel',
    lightMode: 'Ljust läge',
    darkMode: 'Mörkt läge',
    highContrast: 'Hög kontrast',
    tagline: 'Snabb, lätt bildmätningsverktyg',
    pageTitle: 'MeasureOver - Bildmätningsverktyg',
    pageDescription: 'MeasureOver - Snabbt och lätt bildmätningsverktyg för ritstöd. Ladda upp bilder och rita mätlinjer med koordinatberäkning.',
    footerRights: '© 2026 Timo Koola. Alla rättigheter förbehållna.',
  },
  fr: {
    appName: 'MeasureOver',
    uploadImage: 'Téléverser une image',
    dragDropOrClick: 'Glissez-déposez une image ici ou cliquez pour sélectionner',
    selectImage: 'Sélectionner une image',
    cross: 'Croix',
    line: 'Ligne',
    crossMode: 'Mode croix : cliquez pour ajouter une ligne verticale et horizontale',
    lineMode: 'Mode ligne : cliquez sur deux points pour placer une ligne',
    linePending: 'Ligne en attente...',
    lineCount: 'ligne',
    lineCountPlural: 'lignes',
    undo: 'Annuler',
    redo: 'Rétablir',
    clearAll: 'Tout effacer',
    exportImage: 'Exporter l’image',
    saveProject: 'Enregistrer le projet',
    loadProject: 'Charger le projet',
    newImage: 'Nouvelle image',
    paperSize: 'Format papier',
    paperSizeDescription: 'Les coordonnées sont mises à l’échelle selon le format papier sélectionné',
    measurementUnit: 'Unité de mesure',
    imageAdjustments: 'Ajustements d’image',
    gridSettings: 'Paramètres de grille',
    showGrid: 'Afficher la grille',
    opacity: 'Opacité',
    gridDescription: 'La grille aide à aligner visuellement les lignes',
    lineThickness: 'Épaisseur des lignes',
    lineThicknessHelp: 'Des lignes plus épaisses sont plus faciles à voir sur mobile',
    grayscale: 'Niveaux de gris',
    brightness: 'Luminosité',
    contrast: 'Contraste',
    rotation: 'Rotation',
    reset: 'Réinitialiser',
    enableCrop: 'Activer le recadrage',
    millimeters: 'Millimètres (mm)',
    centimeters: 'Centimètres (cm)',
    inches: 'Pouces (in)',
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
    measurementCoordinates: 'Coordonnées de mesure',
    intersectionPoints: 'Points d’intersection en',
    drawLinesToSeeCoordinates: 'Tracez des lignes pour voir les coordonnées d’intersection',
    point: 'point',
    points: 'points',
    pointLabel: 'Point',
    xLabel: 'X :',
    yLabel: 'Y :',
    projects: 'Projets',
    show: 'Afficher',
    hide: 'Masquer',
    noSavedProjects: 'Aucun projet enregistré',
    deleteProject: 'Supprimer ce projet ?',
    deleteProjectAria: 'Supprimer le projet',
    projectSaved: 'Projet enregistré avec succès !',
    measurementTool: 'Outil de mesure',
    crossInstructionsTitle: 'Mode croix :',
    lineInstructionsTitle: 'Mode ligne :',
    crossClickOnce: 'Cliquez une fois pour placer une croix',
    crossAddsLines: 'Ajoute une ligne verticale et une ligne horizontale',
    linesAutoExtend: 'Les lignes s’étendent automatiquement jusqu’aux bords',
    lineClickFirst: 'Cliquez sur le premier point, puis sur le second',
    lineExactPlacement: 'La ligne est placée exactement là où vous cliquez (sans aimantation)',
    lineCancel: 'Appuyez sur Esc pour annuler la ligne en attente',
    dragHandlesHint: 'Faites glisser les poignées de bord pour ajouter une ligne verticale ou horizontale',
    intersectionPointsAppear: 'Les points d’intersection apparaissent automatiquement',
    invalidImage: 'Veuillez sélectionner un fichier image',
    uploadImageAria: 'Téléverser un fichier image',
    measurementCanvasLabel: 'Zone de mesure - ajoutez des lignes avec le mode sélectionné. Appuyez sur Esc pour tout effacer.',
    noLinesDrawn: 'Aucune ligne tracée',
    linesDrawn: 'lignes tracées',
    dragHandleTop: 'Glisser pour ajouter une ligne horizontale (haut)',
    dragHandleBottom: 'Glisser pour ajouter une ligne horizontale (bas)',
    dragHandleLeft: 'Glisser pour ajouter une ligne verticale (gauche)',
    dragHandleRight: 'Glisser pour ajouter une ligne verticale (droite)',
    selectLanguage: 'Choisir la langue',
    paperSizeAria: 'Choisir le format papier pour l’échelle des coordonnées',
    unitAria: 'Choisir l’unité de mesure',
    gridOpacityAria: 'Ajuster l’opacité de la grille',
    lineThicknessAria: 'Ajuster l’épaisseur des lignes',
    brightnessAria: 'Ajuster la luminosité',
    contrastAria: 'Ajuster le contraste',
    rotationAria: 'Faire pivoter l’image',
    rotateCcwAria: 'Pivoter de 90° vers la gauche',
    rotateCwAria: 'Pivoter de 90° vers la droite',
    resetRotationAria: 'Réinitialiser la rotation',
    cropNote: 'Remarque : le recadrage est basique. Pour un recadrage avancé, utilisez un éditeur avant l’import.',
    drawLinesForIntersections: 'Tracez des lignes pour voir les points d’intersection',
    switchToMode: 'Passer à',
    switchColorMode: 'Passer à',
    colorModeDefault: 'par défaut',
    colorModeHighContrast: 'contraste élevé',
    error: 'Erreur',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    highContrast: 'Contraste élevé',
    tagline: 'Outil de mesure d’image rapide et léger',
    pageTitle: 'MeasureOver - Outil de mesure d’image',
    pageDescription: 'MeasureOver - Outil de mesure d’image rapide et léger pour le dessin. Téléversez des images et tracez des lignes de mesure avec calcul des coordonnées.',
    footerRights: '© 2026 Timo Koola. Tous droits réservés.',
  },
  es: {
    appName: 'MeasureOver',
    uploadImage: 'Subir imagen',
    dragDropOrClick: 'Arrastra y suelta una imagen aquí o haz clic para seleccionar',
    selectImage: 'Seleccionar imagen',
    cross: 'Cruz',
    line: 'Línea',
    crossMode: 'Modo cruz: haz clic para añadir una línea vertical y horizontal',
    lineMode: 'Modo línea: haz clic en dos puntos para colocar una línea',
    linePending: 'Línea pendiente...',
    lineCount: 'línea',
    lineCountPlural: 'líneas',
    undo: 'Deshacer',
    redo: 'Rehacer',
    clearAll: 'Borrar todo',
    exportImage: 'Exportar imagen',
    saveProject: 'Guardar proyecto',
    loadProject: 'Cargar proyecto',
    newImage: 'Nueva imagen',
    paperSize: 'Tamaño de papel',
    paperSizeDescription: 'Las coordenadas se escalan según el tamaño de papel seleccionado',
    measurementUnit: 'Unidad de medida',
    imageAdjustments: 'Ajustes de imagen',
    gridSettings: 'Configuración de cuadrícula',
    showGrid: 'Mostrar cuadrícula',
    opacity: 'Opacidad',
    gridDescription: 'La cuadrícula ayuda a alinear las líneas visualmente',
    lineThickness: 'Grosor de línea',
    lineThicknessHelp: 'Las líneas más gruesas se ven mejor en móviles',
    grayscale: 'Escala de grises',
    brightness: 'Brillo',
    contrast: 'Contraste',
    rotation: 'Rotación',
    reset: 'Restablecer',
    enableCrop: 'Activar recorte',
    millimeters: 'Milímetros (mm)',
    centimeters: 'Centímetros (cm)',
    inches: 'Pulgadas (in)',
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
    measurementCoordinates: 'Coordenadas de medida',
    intersectionPoints: 'Puntos de intersección en',
    drawLinesToSeeCoordinates: 'Dibuja líneas para ver las coordenadas de intersección',
    point: 'punto',
    points: 'puntos',
    pointLabel: 'Punto',
    xLabel: 'X:',
    yLabel: 'Y:',
    projects: 'Proyectos',
    show: 'Mostrar',
    hide: 'Ocultar',
    noSavedProjects: 'No hay proyectos guardados',
    deleteProject: '¿Eliminar este proyecto?',
    deleteProjectAria: 'Eliminar proyecto',
    projectSaved: '¡Proyecto guardado correctamente!',
    measurementTool: 'Herramienta de medición',
    crossInstructionsTitle: 'Modo cruz:',
    lineInstructionsTitle: 'Modo línea:',
    crossClickOnce: 'Haz clic una vez para colocar una cruz',
    crossAddsLines: 'Añade una línea vertical y una horizontal',
    linesAutoExtend: 'Las líneas se extienden automáticamente hasta los bordes',
    lineClickFirst: 'Haz clic en el primer punto y luego en el segundo',
    lineExactPlacement: 'La línea se coloca exactamente donde haces clic (sin ajuste)',
    lineCancel: 'Pulsa Esc para cancelar la línea pendiente',
    dragHandlesHint: 'Arrastra los tiradores del borde para añadir una línea vertical u horizontal',
    intersectionPointsAppear: 'Los puntos de intersección aparecen automáticamente',
    invalidImage: 'Selecciona un archivo de imagen',
    uploadImageAria: 'Subir un archivo de imagen',
    measurementCanvasLabel: 'Lienzo de medición: añade líneas con el modo seleccionado. Pulsa Esc para borrar todas las líneas.',
    noLinesDrawn: 'No hay líneas dibujadas',
    linesDrawn: 'líneas dibujadas',
    dragHandleTop: 'Arrastrar para añadir línea horizontal (arriba)',
    dragHandleBottom: 'Arrastrar para añadir línea horizontal (abajo)',
    dragHandleLeft: 'Arrastrar para añadir línea vertical (izquierda)',
    dragHandleRight: 'Arrastrar para añadir línea vertical (derecha)',
    selectLanguage: 'Seleccionar idioma',
    paperSizeAria: 'Seleccionar tamaño de papel para escalar las coordenadas',
    unitAria: 'Seleccionar unidad de medida',
    gridOpacityAria: 'Ajustar la opacidad de la cuadrícula',
    lineThicknessAria: 'Ajustar el grosor de línea',
    brightnessAria: 'Ajustar el brillo',
    contrastAria: 'Ajustar el contraste',
    rotationAria: 'Rotar imagen',
    rotateCcwAria: 'Rotar 90° en sentido antihorario',
    rotateCwAria: 'Rotar 90° en sentido horario',
    resetRotationAria: 'Restablecer rotación',
    cropNote: 'Nota: El recorte es básico. Para recortar avanzado, usa un editor antes de subir.',
    drawLinesForIntersections: 'Dibuja líneas para ver los puntos de intersección',
    switchToMode: 'Cambiar a',
    switchColorMode: 'Cambiar a',
    colorModeDefault: 'predeterminado',
    colorModeHighContrast: 'alto contraste',
    error: 'Error',
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    highContrast: 'Alto contraste',
    tagline: 'Herramienta de medición de imágenes rápida y ligera',
    pageTitle: 'MeasureOver - Herramienta de medición de imágenes',
    pageDescription: 'MeasureOver - Herramienta de medición de imágenes rápida y ligera para dibujo. Sube imágenes y traza líneas de medida con cálculo de coordenadas.',
    footerRights: '© 2026 Timo Koola. Todos los derechos reservados.',
  },
  de: {
    appName: 'MeasureOver',
    uploadImage: 'Bild hochladen',
    dragDropOrClick: 'Ziehe ein Bild hierher oder klicke zum Auswählen',
    selectImage: 'Bild auswählen',
    cross: 'Kreuz',
    line: 'Linie',
    crossMode: 'Kreuzmodus: Klicken, um vertikale + horizontale Linie hinzuzufügen',
    lineMode: 'Linienmodus: Zwei Punkte anklicken, um eine Linie zu platzieren',
    linePending: 'Linie ausstehend...',
    lineCount: 'Linie',
    lineCountPlural: 'Linien',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    clearAll: 'Alles löschen',
    exportImage: 'Bild exportieren',
    saveProject: 'Projekt speichern',
    loadProject: 'Projekt laden',
    newImage: 'Neues Bild',
    paperSize: 'Papierformat',
    paperSizeDescription: 'Koordinaten werden auf das gewählte Papierformat skaliert',
    measurementUnit: 'Maßeinheit',
    imageAdjustments: 'Bildanpassungen',
    gridSettings: 'Rastereinstellungen',
    showGrid: 'Raster anzeigen',
    opacity: 'Deckkraft',
    gridDescription: 'Das Raster hilft beim visuellen Ausrichten der Linien',
    lineThickness: 'Linienstärke',
    lineThicknessHelp: 'Dicke Linien sind auf Mobilgeräten besser sichtbar',
    grayscale: 'Graustufen',
    brightness: 'Helligkeit',
    contrast: 'Kontrast',
    rotation: 'Drehung',
    reset: 'Zurücksetzen',
    enableCrop: 'Zuschneiden aktivieren',
    millimeters: 'Millimeter (mm)',
    centimeters: 'Zentimeter (cm)',
    inches: 'Zoll (in)',
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
    measurementCoordinates: 'Messkoordinaten',
    intersectionPoints: 'Schnittpunkte in',
    drawLinesToSeeCoordinates: 'Zeichne Linien, um Schnittpunkte zu sehen',
    point: 'Punkt',
    points: 'Punkte',
    pointLabel: 'Punkt',
    xLabel: 'X:',
    yLabel: 'Y:',
    projects: 'Projekte',
    show: 'Anzeigen',
    hide: 'Ausblenden',
    noSavedProjects: 'Keine gespeicherten Projekte',
    deleteProject: 'Dieses Projekt löschen?',
    deleteProjectAria: 'Projekt löschen',
    projectSaved: 'Projekt erfolgreich gespeichert!',
    measurementTool: 'Messwerkzeug',
    crossInstructionsTitle: 'Kreuzmodus:',
    lineInstructionsTitle: 'Linienmodus:',
    crossClickOnce: 'Einmal klicken, um ein Kreuz zu platzieren',
    crossAddsLines: 'Fügt eine vertikale und eine horizontale Linie hinzu',
    linesAutoExtend: 'Linien werden automatisch bis zu den Rändern verlängert',
    lineClickFirst: 'Ersten Punkt klicken, dann den zweiten',
    lineExactPlacement: 'Linie wird genau an den Klickpunkten platziert (kein Einrasten)',
    lineCancel: 'Esc drücken, um die ausstehende Linie abzubrechen',
    dragHandlesHint: 'Ziehe die Randgriffe, um eine vertikale oder horizontale Linie hinzuzufügen',
    intersectionPointsAppear: 'Schnittpunkte erscheinen automatisch',
    invalidImage: 'Bitte eine Bilddatei auswählen',
    uploadImageAria: 'Bilddatei hochladen',
    measurementCanvasLabel: 'Messfläche – Linien mit dem gewählten Modus hinzufügen. Esc drücken, um alle Linien zu löschen.',
    noLinesDrawn: 'Keine Linien gezeichnet',
    linesDrawn: 'Linien gezeichnet',
    dragHandleTop: 'Ziehen, um horizontale Linie hinzuzufügen (oben)',
    dragHandleBottom: 'Ziehen, um horizontale Linie hinzuzufügen (unten)',
    dragHandleLeft: 'Ziehen, um vertikale Linie hinzuzufügen (links)',
    dragHandleRight: 'Ziehen, um vertikale Linie hinzuzufügen (rechts)',
    selectLanguage: 'Sprache wählen',
    paperSizeAria: 'Papierformat für Koordinatenskalierung auswählen',
    unitAria: 'Maßeinheit auswählen',
    gridOpacityAria: 'Raster-Deckkraft anpassen',
    lineThicknessAria: 'Linienstärke anpassen',
    brightnessAria: 'Helligkeit anpassen',
    contrastAria: 'Kontrast anpassen',
    rotationAria: 'Bild drehen',
    rotateCcwAria: '90° gegen den Uhrzeigersinn drehen',
    rotateCwAria: '90° im Uhrzeigersinn drehen',
    resetRotationAria: 'Drehung zurücksetzen',
    cropNote: 'Hinweis: Zuschneiden ist einfach. Für erweitertes Zuschneiden vor dem Upload einen Editor verwenden.',
    drawLinesForIntersections: 'Zeichne Linien, um Schnittpunkte zu sehen',
    switchToMode: 'Wechseln zu',
    switchColorMode: 'Wechseln zu',
    colorModeDefault: 'Standard',
    colorModeHighContrast: 'hoher Kontrast',
    error: 'Fehler',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',
    highContrast: 'Hoher Kontrast',
    tagline: 'Schnelles, leichtes Bildmesswerkzeug',
    pageTitle: 'MeasureOver - Bildmesswerkzeug',
    pageDescription: 'MeasureOver - Schnelles, leichtes Bildmesswerkzeug für Zeichenhilfen. Lade Bilder hoch und zeichne Messlinien mit Koordinatenberechnung.',
    footerRights: '© 2026 Timo Koola. Alle Rechte vorbehalten.',
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
  if (stored && (stored === 'en' || stored === 'fi' || stored === 'sv' || stored === 'fr' || stored === 'es' || stored === 'de')) {
    setLanguage(stored as Language);
  } else {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fi')) {
      setLanguage('fi');
    } else if (browserLang.startsWith('sv')) {
      setLanguage('sv');
    } else if (browserLang.startsWith('fr')) {
      setLanguage('fr');
    } else if (browserLang.startsWith('es')) {
      setLanguage('es');
    } else if (browserLang.startsWith('de')) {
      setLanguage('de');
    } else {
      setLanguage('en');
    }
  }
}
