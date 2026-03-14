import type { CardLocale } from '../../types/card'

type Messages = Record<string, string>

const it: Messages = {
  /* ─── Editor: Wizard ─── */
  'wizard.step.language': 'Lingua',
  'wizard.step.details': 'Dettagli',
  'wizard.step.games': 'Giochi',
  'wizard.step.theme': 'Tema',
  'wizard.step.preview': 'Anteprima',
  'wizard.back': 'Indietro',
  'wizard.next': 'Avanti',

  /* ─── Editor: StepLanguage ─── */
  'lang.title': 'Scegli la lingua',
  'lang.subtitle': 'Questa lingua verrà usata nel biglietto e nei giochi',
  'lang.it': 'Italiano',
  'lang.en': 'English',

  /* ─── Editor: StepRecipient ─── */
  'recipient.title': 'Per chi è il biglietto?',
  'recipient.subtitle': 'Inserisci i dettagli del festeggiato',
  'recipient.nameLabel': 'Nome del festeggiato',
  'recipient.namePlaceholder': 'Es. Marco',
  'recipient.genderLabel': 'Il festeggiato è...',
  'recipient.male': 'Maschio',
  'recipient.female': 'Femmina',
  'recipient.senderLabel': 'Il tuo nome',
  'recipient.senderPlaceholder': 'Es. Enrico',
  'recipient.messageLabel': 'Messaggio di auguri',
  'recipient.messagePlaceholder': 'Scrivi un messaggio speciale...',
  'recipient.charCount': 'caratteri',

  /* ─── Editor: StepGamePicker ─── */
  'games.title': 'Scegli le missioni',
  'games.subtitle': 'Seleziona da 1 a 5 missioni per preparare la festa!',
  'games.hint': 'Seleziona almeno una missione',
  'games.try': 'Prova',
  'games.tryTitle': 'Prova questo gioco',
  'games.missione.name': 'Prepara la Festa',
  'games.missione.desc': 'Trova le decorazioni, raccogli i regali e prepara la torta!',
  'games.coppie.name': 'Apparecchia i Tavoli',
  'games.coppie.desc': 'Abbina piatti, bicchieri e decorazioni per la tavola!',
  'games.palloncini.name': 'Decora la Sala',
  'games.palloncini.desc': 'Cattura le decorazioni ed evita i guastafeste!',
  'games.sequenza.name': 'Ricorda la Sequenza',
  'games.sequenza.desc': 'Memorizza e ripeti la sequenza di emoji!',
  'games.regalo.name': 'Scarta i Regali',
  'games.regalo.desc': 'Tocca i regali per scartarli prima che scada il tempo!',

  /* ─── Editor: StepTheme ─── */
  'theme.title': 'Scegli il tema',
  'theme.subtitle': 'Personalizza il look del tuo biglietto',
  'theme.pink': 'Rosa',
  'theme.dark': 'Scuro',
  'theme.pastel': 'Pastello',

  /* ─── Editor: StepPreview ─── */
  'preview.title': 'Anteprima',
  'preview.subtitle': 'Controlla i dettagli del tuo biglietto',
  'preview.recipient': 'Destinatario',
  'preview.from': 'Da',
  'preview.message': 'Messaggio',
  'preview.gamesLabel': 'Giochi',
  'preview.themeLabel': 'Tema',
  'preview.create': 'Crea Biglietto',
  'preview.creating': 'Creazione in corso...',
  'preview.created': 'Biglietto creato!',
  'preview.copy': 'Copia',
  'preview.copied': 'Copiato!',
  'preview.open': 'Apri il biglietto',
  'preview.error': 'Errore nella creazione:',

  /* ─── Preview: Game names ─── */
  'preview.game.missione': 'La Missione',
  'preview.game.coppie': 'Trova le Coppie',
  'preview.game.palloncini': 'Palloncini',
  'preview.game.sequenza': 'Ricorda la Sequenza',
  'preview.game.regalo': 'Scarta i Regali',

  /* ─── Viewer: Envelope ─── */
  'envelope.text': 'Un biglietto per {name}!',
  'envelope.hint': 'Tocca per aprire',

  /* ─── Viewer: Message ─── */
  'message.greeting': 'Buon Compleanno! 🎂',
  'message.sender': 'Con affetto, {name}',
  'message.continue': 'Inizia la festa! 🎉',

  /* ─── Viewer: Finale ─── */
  'finale.title': 'BUON COMPLEANNO {name}! 🎂',
  'finale.message.M': 'Hai completato tutte le sfide! Sei fantastico! 🌟',
  'finale.message.F': 'Hai completato tutte le sfide! Sei fantastica! 🌟',
  'finale.blow': 'Soffia le candeline 💨',

  /* ─── Viewer: GameCarousel ─── */
  'carousel.missione': '🎯 Prepara la Festa',
  'carousel.coppie': '🍽️ Apparecchia i Tavoli',
  'carousel.palloncini': '🎀 Decora la Sala',
  'carousel.sequenza': '🧠 Ricorda la Sequenza',
  'carousel.regalo': '🎁 Scarta i Regali',

  /* ─── Game: Missione ─── */
  'missione.title': 'Decora la sala! 🎯',
  'missione.subtitle': '{name}, trova tutto il necessario per decorare la festa!',
  'missione.success': 'Ottimo! 🎉',
  'missione.error': 'Questo no! Riprova 😅',
  'missione.found': 'Trovati:',

  /* ─── Game: Coppie ─── */
  'coppie.levelBadge': 'Livello {current} / {total} — {label}',
  'coppie.title': 'Apparecchia i Tavoli! 🍽️',
  'coppie.subtitle': '{name}, abbina le cose uguali per preparare la tavola della festa!',
  'coppie.moves': 'Tentativi:',
  'coppie.matched': 'Abbinati:',
  'coppie.levelDone': 'Tavola preparata!',
  'coppie.allDone.M': 'Bravissimo, {name}!',
  'coppie.allDone.F': 'Bravissima, {name}!',
  'coppie.levelDoneSub': 'La tavola prende forma!',
  'coppie.allDoneSub': 'La tavola della festa è perfetta!',
  'coppie.overlayMoves': 'Tentativi',
  'coppie.overlayMatched': 'Abbinati',
  'coppie.nextLevel': 'Prossimo Livello',
  'coppie.continue': 'Continua',
  'coppie.level1': 'Piatti e Bicchieri',
  'coppie.level2': 'Le Decorazioni',
  'coppie.level3': 'La Festa Completa!',

  /* ─── Game: Palloncini ─── */
  'palloncini.levelDone': 'Sala decorata!',
  'palloncini.levelDoneSub': 'Altre decorazioni in arrivo...',
  'palloncini.decorations': 'Decorazioni:',
  'palloncini.win.M': 'Bravissimo, {name}!',
  'palloncini.win.F': 'Bravissima, {name}!',
  'palloncini.winSub': 'La sala è decorata alla perfezione!',
  'palloncini.winScore': 'Decorazioni raccolte:',
  'palloncini.lose': 'I guastafeste hanno vinto!',
  'palloncini.loseSub': 'Non preoccuparti, {name}, ritenta!',
  'palloncini.loseScore': 'Decorazioni:',

  /* ─── Game: Sequenza ─── */
  'sequenza.watch': 'Osserva la sequenza...',
  'sequenza.repeat': 'Ripeti la sequenza!',
  'sequenza.perfect': 'Perfetto!',
  'sequenza.wrong': 'Sequenza sbagliata!',
  'sequenza.levelDone': 'Sequenza completata!',
  'sequenza.levelDoneSub': 'Prossima sfida in arrivo...',
  'sequenza.points': 'Punti:',
  'sequenza.win.M': 'Bravissimo, {name}!',
  'sequenza.win.F': 'Bravissima, {name}!',
  'sequenza.winSub': 'Hai una memoria da campione!',
  'sequenza.winScore': 'Punteggio:',
  'sequenza.level1': 'Facile 🌸',
  'sequenza.level2': 'Medio 🌟',
  'sequenza.level3': 'Difficile 🔥',

  /* ─── Game: Regalo ─── */
  'regalo.instruction': 'Tocca i regali per scartarli! 🎁',
  'regalo.levelDone': 'Tutti scartati!',
  'regalo.levelDoneSub': 'Altri regali in arrivo...',
  'regalo.points': 'Punti:',
  'regalo.win.M': 'Bravissimo, {name}!',
  'regalo.win.F': 'Bravissima, {name}!',
  'regalo.winSub': 'Hai scartato tutti i regali!',
  'regalo.winScore': 'Punteggio:',
  'regalo.lose': 'Tempo scaduto!',
  'regalo.loseSub': 'Non preoccuparti, {name}, i regali ti aspettano!',
  'regalo.loseScore': 'Punti:',
  'regalo.level1': 'Primi Regali 🎀',
  'regalo.level2': 'Tanti Regali 🎊',
  'regalo.level3': 'La Montagna di Regali! 🏔️',

  /* ─── Pages ─── */
  'page.home.title': 'Crea un Biglietto di Compleanno 🎂',
  'page.home.description': 'Crea biglietti di compleanno animati con mini-giochi interattivi e condividili via URL!',
  'page.card.notFound': 'Biglietto non trovato',
  'page.card.title': 'Buon Compleanno {name}! 🎂',
  'page.card.description': 'Un biglietto di compleanno speciale per {name}',
  'page.card.ogDescription': '{sender} ha creato un biglietto speciale per te!',
  'page.card.fallbackTitle': 'Biglietto di Compleanno',
}

const en: Messages = {
  /* ─── Editor: Wizard ─── */
  'wizard.step.language': 'Language',
  'wizard.step.details': 'Details',
  'wizard.step.games': 'Games',
  'wizard.step.theme': 'Theme',
  'wizard.step.preview': 'Preview',
  'wizard.back': 'Back',
  'wizard.next': 'Next',

  /* ─── Editor: StepLanguage ─── */
  'lang.title': 'Choose language',
  'lang.subtitle': 'This language will be used in the card and games',
  'lang.it': 'Italiano',
  'lang.en': 'English',

  /* ─── Editor: StepRecipient ─── */
  'recipient.title': 'Who is the card for?',
  'recipient.subtitle': 'Enter the birthday person\'s details',
  'recipient.nameLabel': 'Recipient\'s name',
  'recipient.namePlaceholder': 'E.g. Sarah',
  'recipient.genderLabel': 'The recipient is...',
  'recipient.male': 'Male',
  'recipient.female': 'Female',
  'recipient.senderLabel': 'Your name',
  'recipient.senderPlaceholder': 'E.g. John',
  'recipient.messageLabel': 'Birthday message',
  'recipient.messagePlaceholder': 'Write a special message...',
  'recipient.charCount': 'characters',

  /* ─── Editor: StepGamePicker ─── */
  'games.title': 'Choose the missions',
  'games.subtitle': 'Select 1 to 5 missions to prepare the party!',
  'games.hint': 'Select at least one mission',
  'games.try': 'Try',
  'games.tryTitle': 'Try this game',
  'games.missione.name': 'Prepare the Party',
  'games.missione.desc': 'Find the decorations, collect the gifts and prepare the cake!',
  'games.coppie.name': 'Set the Tables',
  'games.coppie.desc': 'Match plates, glasses and decorations for the table!',
  'games.palloncini.name': 'Decorate the Room',
  'games.palloncini.desc': 'Catch the decorations and avoid the troublemakers!',
  'games.sequenza.name': 'Remember the Sequence',
  'games.sequenza.desc': 'Memorize and repeat the emoji sequence!',
  'games.regalo.name': 'Unwrap the Gifts',
  'games.regalo.desc': 'Tap the gifts to unwrap them before time runs out!',

  /* ─── Editor: StepTheme ─── */
  'theme.title': 'Choose a theme',
  'theme.subtitle': 'Customize the look of your card',
  'theme.pink': 'Pink',
  'theme.dark': 'Dark',
  'theme.pastel': 'Pastel',

  /* ─── Editor: StepPreview ─── */
  'preview.title': 'Preview',
  'preview.subtitle': 'Check your card details',
  'preview.recipient': 'Recipient',
  'preview.from': 'From',
  'preview.message': 'Message',
  'preview.gamesLabel': 'Games',
  'preview.themeLabel': 'Theme',
  'preview.create': 'Create Card',
  'preview.creating': 'Creating...',
  'preview.created': 'Card created!',
  'preview.copy': 'Copy',
  'preview.copied': 'Copied!',
  'preview.open': 'Open the card',
  'preview.error': 'Error creating card:',

  /* ─── Preview: Game names ─── */
  'preview.game.missione': 'The Mission',
  'preview.game.coppie': 'Find the Pairs',
  'preview.game.palloncini': 'Balloons',
  'preview.game.sequenza': 'Remember the Sequence',
  'preview.game.regalo': 'Unwrap the Gifts',

  /* ─── Viewer: Envelope ─── */
  'envelope.text': 'A card for {name}!',
  'envelope.hint': 'Tap to open',

  /* ─── Viewer: Message ─── */
  'message.greeting': 'Happy Birthday! 🎂',
  'message.sender': 'With love, {name}',
  'message.continue': 'Start the party! 🎉',

  /* ─── Viewer: Finale ─── */
  'finale.title': 'HAPPY BIRTHDAY {name}! 🎂',
  'finale.message.M': 'You completed all the challenges! You\'re amazing! 🌟',
  'finale.message.F': 'You completed all the challenges! You\'re amazing! 🌟',
  'finale.blow': 'Blow the candles 💨',

  /* ─── Viewer: GameCarousel ─── */
  'carousel.missione': '🎯 Prepare the Party',
  'carousel.coppie': '🍽️ Set the Tables',
  'carousel.palloncini': '🎀 Decorate the Room',
  'carousel.sequenza': '🧠 Remember the Sequence',
  'carousel.regalo': '🎁 Unwrap the Gifts',

  /* ─── Game: Missione ─── */
  'missione.title': 'Decorate the room! 🎯',
  'missione.subtitle': '{name}, find everything you need to decorate the party!',
  'missione.success': 'Great! 🎉',
  'missione.error': 'Not that one! Try again 😅',
  'missione.found': 'Found:',

  /* ─── Game: Coppie ─── */
  'coppie.levelBadge': 'Level {current} / {total} — {label}',
  'coppie.title': 'Set the Tables! 🍽️',
  'coppie.subtitle': '{name}, match the same items to prepare the party table!',
  'coppie.moves': 'Attempts:',
  'coppie.matched': 'Matched:',
  'coppie.levelDone': 'Table ready!',
  'coppie.allDone.M': 'Well done, {name}!',
  'coppie.allDone.F': 'Well done, {name}!',
  'coppie.levelDoneSub': 'The table is coming together!',
  'coppie.allDoneSub': 'The party table is perfect!',
  'coppie.overlayMoves': 'Attempts',
  'coppie.overlayMatched': 'Matched',
  'coppie.nextLevel': 'Next Level',
  'coppie.continue': 'Continue',
  'coppie.level1': 'Plates & Glasses',
  'coppie.level2': 'Decorations',
  'coppie.level3': 'The Full Party!',

  /* ─── Game: Palloncini ─── */
  'palloncini.levelDone': 'Room decorated!',
  'palloncini.levelDoneSub': 'More decorations incoming...',
  'palloncini.decorations': 'Decorations:',
  'palloncini.win.M': 'Well done, {name}!',
  'palloncini.win.F': 'Well done, {name}!',
  'palloncini.winSub': 'The room is perfectly decorated!',
  'palloncini.winScore': 'Decorations collected:',
  'palloncini.lose': 'The troublemakers won!',
  'palloncini.loseSub': 'Don\'t worry, {name}, try again!',
  'palloncini.loseScore': 'Decorations:',

  /* ─── Game: Sequenza ─── */
  'sequenza.watch': 'Watch the sequence...',
  'sequenza.repeat': 'Repeat the sequence!',
  'sequenza.perfect': 'Perfect!',
  'sequenza.wrong': 'Wrong sequence!',
  'sequenza.levelDone': 'Sequence completed!',
  'sequenza.levelDoneSub': 'Next challenge incoming...',
  'sequenza.points': 'Points:',
  'sequenza.win.M': 'Well done, {name}!',
  'sequenza.win.F': 'Well done, {name}!',
  'sequenza.winSub': 'You have a champion\'s memory!',
  'sequenza.winScore': 'Score:',
  'sequenza.level1': 'Easy 🌸',
  'sequenza.level2': 'Medium 🌟',
  'sequenza.level3': 'Hard 🔥',

  /* ─── Game: Regalo ─── */
  'regalo.instruction': 'Tap the gifts to unwrap them! 🎁',
  'regalo.levelDone': 'All unwrapped!',
  'regalo.levelDoneSub': 'More gifts incoming...',
  'regalo.points': 'Points:',
  'regalo.win.M': 'Well done, {name}!',
  'regalo.win.F': 'Well done, {name}!',
  'regalo.winSub': 'You unwrapped all the gifts!',
  'regalo.winScore': 'Score:',
  'regalo.lose': 'Time\'s up!',
  'regalo.loseSub': 'Don\'t worry, {name}, the gifts are waiting for you!',
  'regalo.loseScore': 'Points:',
  'regalo.level1': 'First Gifts 🎀',
  'regalo.level2': 'Lots of Gifts 🎊',
  'regalo.level3': 'Mountain of Gifts! 🏔️',

  /* ─── Pages ─── */
  'page.home.title': 'Create a Birthday Card 🎂',
  'page.home.description': 'Create animated birthday cards with interactive mini-games and share them via URL!',
  'page.card.notFound': 'Card not found',
  'page.card.title': 'Happy Birthday {name}! 🎂',
  'page.card.description': 'A special birthday card for {name}',
  'page.card.ogDescription': '{sender} created a special card for you!',
  'page.card.fallbackTitle': 'Birthday Card',
}

const allMessages: Record<CardLocale, Messages> = { it, en }

/**
 * Translate a key, optionally interpolating `{placeholder}` tokens.
 *
 * @example t('it', 'envelope.text', { name: 'Marco' })
 * // → "Un biglietto per Marco!"
 */
export function t(
  locale: CardLocale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const msg = allMessages[locale]?.[key] ?? allMessages.it[key] ?? key
  if (!params) return msg
  return msg.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}
