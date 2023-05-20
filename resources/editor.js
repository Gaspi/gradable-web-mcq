
defaultQuestionBodies = [
  "Exemple de question avec un peu de math \\(n \\in \\mathbb{N} \\) puis une grosse equation \\[ \\sum_{k=1}^{n} \\binom{n}{k} \\left( \\int_1^{+\\infty} \\frac{\\ln(x)\\cos(2k\\pi + \\phi\\cdot\\theta)}{ \\sqrt{u_k x^2} }\\text{d}x \\right)^k \\] et encore un peu de texte.",
]
defaultAnswers = [
  "Exemple de solution: \\(\\displaystyle x^2 \\in \\left\\{ \\sqrt{\\theta}+ 2k\\pi ~,~ k \\in \\mathbb{N} \\right\\} \\).",
  "Exemple de solution: \\(\\displaystyle \\frac{\\sqrt{n}}{2\\pi} \\).",
]

function defaultAnswer(correct=false) {
  return {
    code: makeid(6),
    type: "answer",
    correct: correct,
    body: getRandomPick(defaultAnswers),
  };
}

function defaultQuestion() {
  return {
    code: makeid(6),
    type: "question",
    title: "Titre de question par défaut",
    body: getRandomPick(defaultQuestionBodies),
    choices: [ defaultAnswer(false), defaultAnswer(true) ]
  };
}

function defaultParagraph() {
  return {
    code: makeid(6),
    type: "text",
    title: "Titre de paragraphe par défaut",
    body: "Contenu de paragraphe par défaut"
  };
}

function defaultPage() {
  return {
    code: makeid(6),
    type: "page",
    title: "Titre de page par défaut",
    content: [ ]
  };
}




var active_panel = null;
var main_panel, side_panel;
var side_panel_title, side_panel_save, side_panel_quit;

var sidebar_size = 4;
function enlargePanel() {
  if (sidebar_size < 8) {
    side_panel.classList.remove('col-md-'+sidebar_size);
    side_panel.classList.add('col-md-'+(++sidebar_size));
  }
}
function shrinkPanel() {
  if (sidebar_size > 2) {
    side_panel.classList.remove('col-md-'+sidebar_size);
    side_panel.classList.add('col-md-'+(--sidebar_size));
  }
}

function buildPage() {
  const d1 = document.body.appendChild( mk('div', ['container-fluid']) );
  const d2 = d1.appendChild( mk('div', ['row','row-offcanvas','row-offcanvas-left','vh-100']) );
  side_panel = d2.appendChild( mk('div', ['col-md-'+sidebar_size,'sidebar-offcanvas','h-100','overflow-auto','bg-light','p-4']) );
  side_panel.setAttribute('role','navigation');
  const side_header = side_panel.appendChild( mk('div', ['d-flex','flex-row','align-items-baseline']) );
  side_panel_title = side_header.appendChild( mk('h3',['me-auto']) );
  side_panel_save = mk('button',['btn','btn-success','float-right']);
  setAlternativeInnerText(side_panel_save, 'Valider', '\u2705');
  side_panel_quit = mk('button',['btn','btn-danger','ms-1']);
  setAlternativeInnerText(side_panel_quit, 'Quitter', '\u274C');

  side_panel_save.setAttribute('disabled','');
  side_panel_quit.setAttribute('disabled','');
  
  side_header.appendChild(side_panel_save)
             .addEventListener('click', () => (active_panel && active_panel.save()) );
  side_header.appendChild(side_panel_quit)
             .addEventListener('click', () => (active_panel && active_panel.hide()) );
  
  main_panel = d2.appendChild( mk('main', ['col','main','h-100','overflow-auto']) );
  return main_panel;
}


class SideEditor {
  constructor(name) {
    this.name = name;
    this.panel = side_panel.appendChild( mk('div', ['collapse']) );
    this.save = function() {};
  }
  
  addTrigger(e) {
    const self = this;
    e.addEventListener('click', () => self.show() );
  }
  
  show() {
    if (active_panel === this) { return; }
    if (active_panel) { active_panel.hide(); }
    active_panel = this;
    side_panel_title.innerText = this.name;
    side_panel_save.removeAttribute('disabled');
    side_panel_quit.removeAttribute('disabled');
    this.panel.classList.toggle('show', true);
  }
  
  hide() {
    this.panel.classList.toggle('show', false);
    if (active_panel === this) {
      side_panel_title.innerText = '';
      side_panel_save.setAttribute('disabled','');
      side_panel_quit.setAttribute('disabled','');
      active_panel = null;
    }
    this.save();
  }
  
  action(f, run_once=true) {
    this.save = f;
    if (run_once) { f(); }
  }
  
  remove() {
    this.hide();
    this.panel.remove();
  }
}


function buildChoice(choice, question, container) {
  const choice_line = container.appendChild( mk('p',['m-3']) );
  const choice_tick = choice_line.appendChild( mk('span') );
  const choice_body = choice_line.appendChild( mk('span', ['ms-3','lead']) );
  
  const editor = new SideEditor('Réponse '+choice.code);
  editor.addTrigger(choice_line);
  
  
  // Champ de titre
  const body_input = mkTextArea();
  body_input.value = choice.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Corps de la réponse') );
  
  // Correct tick
  const correct_tick = mk('input',['form-check-input']);
  correct_tick.setAttribute('type','checkbox');
  correct_tick.checked = choice.correct;
  editor.panel.appendChild( buildFormGroup(correct_tick, 'Correcte ?', tick=true) );
  
  // Commandes plus administratives
  editor.panel.appendChild( mk('hr') );
  
  const move_up = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_up, 'Remonter le choix', '\u21D1');
  move_up.target="#";
  move_up.onclick = function() {
    if (choice_line.previousElementSibling) {
      container.insertBefore(choice_line, choice_line.previousElementSibling);
      const i = question.choices.indexOf(choice);
      const aux = question.choices[i-1];
      question.choices[i-1] = choice;
      question.choices[i] = aux;
    }
  };
  
  const move_down = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_down, 'Descendre le choix', '\u21D3');
  move_down.target="#";
  move_down.onclick = function() {
    if (choice_line.nextElementSibling) {
      container.insertBefore(choice_line.nextElementSibling, choice_line);
      const i = question.choices.indexOf(choice);
      const aux = question.choices[i+1];
      question.choices[i+1] = choice;
      question.choices[i] = aux;
    }
  };
  
  // Delete choice
  const delete_choice = editor.panel.appendChild( mk('button',['btn','btn-danger','m-1']) );
  setAlternativeInnerText(delete_choice, 'Supprimer le choix', '\u274C');
  delete_choice.target="#";
  delete_choice.onclick = function() {
    question.choices.splice(question.choices.indexOf(choice), 1);
    choice_line.remove();
    editor.remove();
  };
  
  editor.action(function() {
    choice.correct = correct_tick.checked;
    if (choice.correct) {
      choice_tick.classList.add('text-success');
      choice_tick.classList.remove('text-danger');
    } else {
      choice_tick.classList.add('text-danger');
      choice_tick.classList.remove('text-success');
    }
    choice_tick.innerText = choice.correct ? '\u2713' : '\u2717';
    choice_body.innerText = choice.body = body_input.value;
    typeset(() => [choice_body]);
  });
  
}

function buildParagraph(paragraph, page, container) {
  const paragraph_div = container.appendChild( mk('div') );
  const paragraph_title = paragraph_div.appendChild( mk('h3',['mt-4','display-6']) );
  const paragraph_body = paragraph_div.appendChild( mk('p',['lead']) );
  paragraph_div.appendChild( mk('hr') );
  
  const editor = new SideEditor('Paragraph '+paragraph.code);
  editor.addTrigger(paragraph_title);
  editor.addTrigger(paragraph_body);
  
  // Champ de titre
  const title_input = mk('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = paragraph.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre du paragraphe') );
  
  // Champ d'introduction
  const body_input = mkTextArea();
  body_input.value = paragraph.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Corps du paragraphe') );
  
  // Commandes plus administratives
  editor.panel.appendChild( mk('hr') );
  
  const move_up = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_up, 'Remonter le paragraphe', '\u21D1');
  move_up.target="#";
  move_up.onclick = function() {
    if (paragraph_div.previousElementSibling) {
      container.insertBefore(paragraph_div, paragraph_div.previousElementSibling);
      const i = page.content.indexOf(paragraph);
      const aux = page.content[i-1];
      page.content[i-1] = paragraph;
      page.content[i] = aux;
    }
  };
  
  const move_down = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_down, 'Descendre le paragraphe', '\u21D3');
  move_down.target="#";
  move_down.onclick = function() {
    if (paragraph_div.nextElementSibling) {
      container.insertBefore(paragraph_div.nextElementSibling, paragraph_div);
      const i = page.content.indexOf(paragraph);
      const aux = page.content[i+1];
      page.content[i+1] = paragraph;
      page.content[i] = aux;
    }
  };
  
  // Supprimer le paragraphe
  const delete_paragraph = editor.panel.appendChild( mk('button',['btn','btn-danger','m-1']) );
  setAlternativeInnerText(delete_paragraph, 'Supprimer le paragraphe', '\u274C');
  delete_paragraph.target="#";
  delete_paragraph.onclick = function() {
    page.content.splice(page.content.indexOf(paragraph), 1);
    paragraph_div.remove();
    editor.remove();
  };
  
  editor.action(function() {
    paragraph_title.innerText = paragraph.title = title_input.value;
    paragraph_body.innerText  = paragraph.body = body_input.value;
    typeset(() => [paragraph_body]);
  } );
}

function buildQuestion(question, page, container) {
  const question_div = container.appendChild( mk('div') );
  const question_title = question_div.appendChild( mk('h3',['mt-4','display-6']) );
  const question_body = question_div.appendChild( mk('p',['lead']) );
  const choices_div = question_div.appendChild( mk('div',['border']) );
  question.choices.forEach((c) => buildChoice(c, question, choices_div));
  
  const editor = new SideEditor('Question '+question.code);
  editor.addTrigger(question_title);
  editor.addTrigger(question_body);
  
  // Champ de titre
  const title_input = mk('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = question.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre de la question') );
  
  // Champ d'introduction
  const body_input = mkTextArea();
  body_input.value = question.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Corps de la question') );
  
  // Add a new answer
  const panel_new_choice = editor.panel.appendChild( mk('button',['btn', 'btn-success', 'm-1']) );
  setAlternativeInnerText(panel_new_choice, 'Ajouter une nouvelle réponse', '+');
  panel_new_choice.target="#";
  panel_new_choice.onclick = function() {
    const choice = defaultAnswer();
    question.choices.push(choice);
    buildChoice(choice, question, choices_div);
  };
  
  // Commandes plus administratives
  editor.panel.appendChild( mk('hr') );
  
  const move_up = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_up, 'Remonter la question', '\u21D1');
  move_up.target="#";
  move_up.onclick = function() {
    if (question_div.previousElementSibling) {
      container.insertBefore(question_div, question_div.previousElementSibling);
      const i = page.content.indexOf(question);
      const aux = page.content[i-1];
      page.content[i-1] = question;
      page.content[i] = aux;
    }
  };
  
  const move_down = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_down, 'Descendre la question', '\u21D3');
  move_down.target="#";
  move_down.onclick = function() {
    if (question_div.nextElementSibling) {
      container.insertBefore(question_div.nextElementSibling, question_div);
      const i = page.content.indexOf(question);
      const aux = page.content[i+1];
      page.content[i+1] = question;
      page.content[i] = aux;
    }
  };
  
  // Supprimer la question
  const delete_question = editor.panel.appendChild( mk('button',['btn','btn-danger','m-1']) );
  setAlternativeInnerText(delete_question, 'Supprimer la question', '\u274C');
  delete_question.target="#";
  delete_question.onclick = function() {
    page.content.splice(page.content.indexOf(question), 1);
    question_div.remove();
    editor.remove();
  };
  
  editor.action(function() {
    question_title.innerText = question.title = title_input.value;
    question_body.innerText  = question.body = body_input.value;
    typeset(() => [question_body]);
  } );
}

function buildTabPage(page, data, container) {
  const page_header = document.getElementById(container.id+'-tabs');
  const tab_li = page_header.appendChild( mk('li',['nav-item']) );
  tab_li.setAttribute('role','presentation');
  const tab_button = tab_li.appendChild( mk('button',['nav-link']) );
  if (page_header.childElementCount <= 1) {
    tab_li.classList.add('active');
  }
  tab_button.id = page.code+'-tab';
  tab_button.setAttribute('data-bs-toggle', 'tab');
  tab_button.setAttribute('data-bs-target', '#'+page.code);
  tab_button.setAttribute('type', 'button');
  tab_button.setAttribute('role', 'tab');
  tab_button.setAttribute('aria-controls', page.code);
  tab_button.setAttribute('aria-selected', 'false');
  tab_button.innerText = page.title;
  const tab_content = container.appendChild( mk('div', ['tab-pane','fade']) );
  tab_content.id = page.code;
  tab_content.setAttribute('role', 'tabpanel');
  tab_content.setAttribute('aria-labelledby', page.code+'-tab');
  
  page.content.forEach((q) => buildElement(q, page, tab_content));
  
  const editor = new SideEditor('Page '+page.code);
  editor.addTrigger(tab_li);
  
  // Champ de titre
  const title_input = mk('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = page.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Add a new question
  const panel_new_question = editor.panel.appendChild( mk('button',['btn','btn-success', 'm-1'], 'Ajouter une nouvelle question') );
  panel_new_question.target="#";
  panel_new_question.onclick = function() {
    const question = defaultQuestion();
    question.title = "Question " + page.content.push(question);
    buildElement(question, page, tab_content);
  };
  
  // Add a new paragraph
  const panel_new_paragraph = editor.panel.appendChild( mk('button',['btn','btn-success', 'm-1'], 'Ajouter un nouveau paragraphe') );
  panel_new_paragraph.target="#";
  panel_new_paragraph.onclick = function() {
    const paragraph = defaultParagraph();
    paragraph.title = "Paragraphe " + page.content.push(paragraph);
    buildElement(paragraph, page, tab_content);
  };
  
  // Commandes plus administratives
  editor.panel.appendChild( mk('hr') );
  
  const move_down = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_down, 'Reculer la page', '\u21D0');
  move_down.target="#";
  move_down.onclick = function() {
    if (tab_li.previousElementSibling) {
      page_header.insertBefore(tab_li, tab_li.previousElementSibling);
      const i = data.pages.indexOf(page);
      const aux = data.pages[i-1];
      data.pages[i-1] = page;
      data.pages[i] = aux;
    }
  };
  
  const move_up = editor.panel.appendChild( mk('button',['btn','btn-secondary','m-1']) );
  setAlternativeInnerText(move_up, 'Avancer la page', '\u21D2');
  move_up.target="#";
  move_up.onclick = function() {
    if (tab_li.nextElementSibling) {
      page_header.insertBefore(tab_li.nextElementSibling, tab_li);
      const i = data.pages.indexOf(page);
      const aux = data.pages[i+1];
      data.pages[i+1] = page;
      data.pages[i] = aux;
    }
  };
  
  // Suppression de la page
  const delete_page = editor.panel.appendChild( mk('button',['btn','btn-danger','m-1']) );
  setAlternativeInnerText(delete_page, 'Supprimer la page', '\u274C');
  delete_page.target="#";
  delete_page.onclick = function() {
    data.pages.splice(data.pages.indexOf(page), 1);
    editor.remove();
    tab_li.remove();
    tab_content.remove();
  };
  
  // Refresh on close
  editor.action(function() {
    page.title = title_input.value;
    tab_button.innerText = page.title;
  } );
}

function buildQuiz(data, ignored, container) {
  const quiz_header  = container.appendChild( mk('div') );
  const page_tabs    = container.appendChild( mk('ul',['nav','nav-tabs']) );
  const page_content = container.appendChild( mk('div',['tab-content','nav-tabs']) );
  
  const quiz_title    = quiz_header.appendChild( mk('h1',['display-1','ms-3']) );
  const quiz_subtitle = quiz_header.appendChild( mk('h5',['display-6','ms-4']) );
  const quiz_intro    = quiz_header.appendChild( mk('p',['lead','ms-5']) );
  page_tabs.setAttribute('role','tablist');
  page_content.id = 'page-content';
  page_tabs.id = 'page-content-tabs';
  
  data.pages.forEach((p) => buildElement(p, data, page_content));
  
  const editor = new SideEditor('Quiz '+data.code);
  editor.addTrigger(quiz_header);
  
  const header_form = editor.panel.appendChild( mk('div') );
  editor.panel.appendChild( mk('hr') );
  const config_form = editor.panel.appendChild( mk('div') );
  editor.panel.appendChild( mk('hr') );
  
  // Champ de titre
  const title_input = mk('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = data.title;
  header_form.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Champ de sous-titre
  const subtitle_input = mk('input',['form-control']);
  subtitle_input.setAttribute('type','text');
  subtitle_input.value = data.subtitle;
  header_form.appendChild( buildFormGroup(subtitle_input, 'Sous-titre') );
  
  // Champ d'introduction
  const intro_input = mkTextArea();
  intro_input.value = data.intro;
  header_form.appendChild( buildFormGroup(intro_input, 'Introduction') );
  
  // Ajouter une nouvelle page
  const panel_new_page = header_form.appendChild( mk('button',['btn','btn-success', 'm-1']) );
  setAlternativeInnerText(panel_new_page, 'Ajouter une nouvelle page', '+');
  panel_new_page.target="#";
  panel_new_page.onclick = function() {
    const page = defaultPage();
    page.title = "Page " + data.pages.push(page);
    buildElement(page, data, page_content);
  };
  
  // Commandes interface
  
  const shrink_panel = config_form.appendChild( mk('button',['btn','btn-secondary', 'm-1']) );
  setAlternativeInnerText(shrink_panel, 'Réduire', '\u21D0');
  shrink_panel.target="#";
  shrink_panel.onclick = shrinkPanel;
  const expand_panel = config_form.appendChild( mk('button',['btn','btn-secondary', 'm-1']) );
  setAlternativeInnerText(expand_panel, 'Elargir', '\u21D2');
  expand_panel.target="#";
  expand_panel.onclick = enlargePanel;
  
  const shorter_editor = config_form.appendChild( mk('button',['btn','btn-secondary', 'm-1']) );
  setAlternativeInnerText(shorter_editor, 'Raccourcir éditeur', '\u21D1');
  shorter_editor.target="#";
  shorter_editor.onclick = () => reduceEditorSize();
  const longer_editor = config_form.appendChild( mk('button',['btn','btn-secondary', 'm-1']) );
  setAlternativeInnerText(longer_editor, 'Etendre éditeur', '\u21D3');
  longer_editor.target="#";
  longer_editor.onclick = () => extendEditorSize();
  
  // Symbol buttons
  const symbol_interface_tick = mk('input',['form-check-input']);
  symbol_interface_tick.setAttribute('type','checkbox');
  symbol_interface_tick.addEventListener('change', function() { setAlternative(symbol_interface_tick.checked); } );
  config_form.appendChild( buildFormGroup(symbol_interface_tick, 'Interface symboliques', tick=true) );
  
  // Commandes plus administratives
  
  // Champ de titre
  const name_input = mk('input',['form-control']);
  name_input.setAttribute('type','text');
  name_input.value = data.name.replace(/[^a-zA-Z0-9\-_]/g,'-');
  editor.panel.appendChild( buildFormGroup(name_input, 'Nom du quiz') );
  
  // Password field
  const pass_input = mk('input',['form-control']);
  pass_input.setAttribute('type','text');
  pass_input.value = '';
  editor.panel.appendChild( buildFormGroup(pass_input, 'Mot de passe professeur') );
  
  // Champ de sauvegarde
  const save_btn = editor.panel.appendChild( mk('button',['btn','btn-primary','m-1'], 'Sauvegarder') );
  save_btn.target="#";
  save_btn.onclick = function() {
    const now = new Date();
    const date = String( now.getFullYear() ).padStart(4,'0')+
                 String( now.getMonth()    ).padStart(2,'0')+
                 String( now.getDay()      ).padStart(2,'0');
    const time = String( now.getHours()    ).padStart(2,'0')+
                 String( now.getMinutes()  ).padStart(2,'0')+
                 String( now.getSeconds()  ).padStart(2,'0');
    filename = [data.name, data.type, data.code, date, time].join('_');
    editor.save();
    save_editor( pass_input.value ? cipher(data, 'prof', pass_input.value) : data, filename);
  };
  
  // Commandes d'export
  editor.panel.appendChild( mk('hr') );
  
  // Champ de titre
  const export_name_input = mk('input',['form-control']);
  export_name_input.setAttribute('type','text');
  export_name_input.value = '';
  editor.panel.appendChild( buildFormGroup(export_name_input, 'Identifiant élève') );
  
  // Student password
  const export_pass_input = mk('input',['form-control']);
  export_pass_input.setAttribute('type','text');
  export_pass_input.value = '';
  editor.panel.appendChild( buildFormGroup(export_pass_input, 'Mot de passe élève') );
  
  // Symbol buttons
  const include_correction_tick = mk('input',['form-check-input']);
  include_correction_tick.setAttribute('type','checkbox');
  editor.panel.appendChild( buildFormGroup(include_correction_tick, 'Inclure une correction', tick=true) );
  
  // Correction password
  const correction_pass_input = mk('input',['form-control']);
  correction_pass_input.setAttribute('type','text');
  correction_pass_input.value = '';
  correction_pass_input.setAttribute('disabled','');
  editor.panel.appendChild( buildFormGroup(correction_pass_input, 'Mot de passe corrigé') );
  
  include_correction_tick.addEventListener('change', function() {
    if (include_correction_tick.checked) {
      correction_pass_input.removeAttribute('disabled');
    } else {
      correction_pass_input.value = '';
      correction_pass_input.setAttribute('disabled','');
    }
  } );
  
  // Champ d'export
  const export_btn = editor.panel.appendChild( mk('button',['btn','btn-primary','m-1'], 'Exporter un quiz') );
  export_btn.target="#";
  export_btn.onclick = function() {
    editor.save();
    // TODO
  };
  
  
  // Commandes d'exports multiples
  editor.panel.appendChild( mk('hr') );
  
  const multiple_export_btn = editor.panel.appendChild( mk('button',['btn','btn-primary','m-1'], 'Exporter plusieurs quiz') );
  multiple_export_btn.target="#";
  multiple_export_btn.onclick = function() {
    editor.save();
    // TODO
  };
  
  
  
  // Commandes de vérification
  editor.panel.appendChild( mk('hr') );
  
  const check_answer_btn = editor.panel.appendChild( mk('button',['btn','btn-primary','m-1'], 'Vérifier une réponse au quiz') );
  check_answer_btn.target="#";
  check_answer_btn.onclick = function() {
    editor.save();
    // TODO
  };
  
  
  // Refresh on close
  editor.action(function() {
    data.title = title_input.value;
    data.subtitle = subtitle_input.value;
    data.intro = intro_input.value;
    
    quiz_title.innerText = data.title ? data.title : "";
    quiz_subtitle.innerText = data.subtitle ? data.subtitle : "";
    quiz_intro.innerText = data.intro ? data.intro : "";
    
    data.name = name_input.value = name_input.value.replace(/[^a-zA-Z0-9\-_]/g,'-');
  });
  
}


function buildElement(elt, parent, container) {
  switch (elt.type) {
  case 'quiz'    : return buildQuiz(elt, parent, container);
  case 'page'    : return buildTabPage(elt, parent, container);
  case 'text'    : return buildParagraph(elt, parent, container);
  case 'question': return buildQuestion(elt, parent, container);
  case 'answer'  : return buildChoice(elt, parent, container);
  default:
    console.log("Failed to build element: "+elt.type, elt);
  }
}

function init() {
  data = decipher(data);
  const main_panel = buildPage();
  if (!data) { return; }
  buildElement(data, null, main_panel);
}