
defaultQuestionBodies = [
  "Calculez \\[ \\int_1^{+\\infty} \\frac{\\ln(x)}{x^2}\\text{d}x \\]",
  "Calculez \\[ \\sum_{0 \\leq n \\leq +\\infty} \\frac{1}{n^{\\frac{3}{2}}} \\]",
]
defaultAnswers = [
  "\\( 3.1415 / \\pi \\)",
  "\\( \\frac{\\sqrt{n}}{2\\pi} \\)",
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
    content: [ defaultParagraph(), defaultQuestion() ]
  };
}

function defaultQuiz() {
  return {
    code: makeid(6),
    type: "quiz",
    title: "Titre de quiz par défaut",
    subtitle: "Paragraphe d'introduction par défaut",
    pages: [ defaultPage() ],
  };
}  




var active_panel = null;
var main_panel, side_panel;
var side_panel_title, side_panel_save, side_panel_quit;

function buildPage() {
  const d1 = document.body.appendChild( build('div', ['container-fluid']) );
  const d2 = d1.appendChild( build('div', ['row','row-offcanvas','row-offcanvas-left','vh-100']) );
  side_panel = d2.appendChild( build('div', ['col-md-3','sidebar-offcanvas','h-100','overflow-auto','bg-light','p-4']) );
  side_panel.setAttribute('role','navigation');
  const side_header = side_panel.appendChild( build('div', ['d-flex','flex-row','align-items-baseline']) );
  side_panel_title = side_header.appendChild( build('h3',['me-auto']) );
  side_panel_save = build('button',['btn','btn-success','float-right'], 'Valider');
  side_panel_quit = build('button',['btn','btn-danger','ms-1'], 'Quitter');
  side_panel_save.setAttribute('disabled','');
  side_panel_quit.setAttribute('disabled','');
  
  side_header.appendChild(side_panel_save)
             .addEventListener('click', () => (active_panel && active_panel.save()) );
  side_header.appendChild(side_panel_quit)
             .addEventListener('click', () => (active_panel && active_panel.hide()) );
  
  main_panel = d2.appendChild( build('main', ['col','main','h-100','overflow-auto']) );
  return main_panel;
}


function emptyPage() {
  removeAllChildren(main_panel);
}


class SideEditor {
  constructor(name) {
    this.name = name;
    this.panel = side_panel.appendChild( build('div', ['collapse']) );
    this.save = function() {};
  }
  
  addTrigger(e) {
    const self = this;
    e.addEventListener('click', () => self.show() );
  }
  
  show() {
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
  const choice_line = container.appendChild( build('p',['m-3']) );
  const choice_tick = choice_line.appendChild( build('span') );
  const choice_body = choice_line.appendChild( build('span', ['ms-3','lead']) );
  
  const editor = new SideEditor('Choice '+choice.code);
  editor.addTrigger(choice_line);
  
  
  // Champ de titre
  const body_input = build('input',['form-control']);
  body_input.setAttribute('type','text');
  body_input.value = choice.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Réponse') );
  
  // Correct tick
  const correct_tick = build('input',['form-check-input']);
  correct_tick.setAttribute('type','checkbox');
  correct_tick.checked = choice.correct;
  editor.panel.appendChild( buildFormGroup(correct_tick, 'Correcte ?', tick=true) );
  
  // Delete choice
  const delete_choice = editor.panel.appendChild(
    build('button',['btn','btn-danger','m-1'], 'Supprimer le choix') );
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
  const paragraph_div = container.appendChild( build('div') );
  const paragraph_title = paragraph_div.appendChild( build('h3') );
  const paragraph_body = paragraph_div.appendChild( build('p',['lead']) );
  
  const editor = new SideEditor('Paragraph '+paragraph.code);
  editor.addTrigger(paragraph_title);
  editor.addTrigger(paragraph_body);
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = paragraph.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre du paragraphe') );
  
  // Champ d'introduction
  const body_input = build('textarea',['form-control']);
  body_input.setAttribute('rows','3');
  body_input.value = paragraph.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Paragraphe') );
  
  // Supprimer le paragraphe
  const delete_paragraph = editor.panel.appendChild(
    build('button',['btn','btn-danger','m-3'], 'Supprimer le paragraphe') );
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
  const question_div = container.appendChild( build('div') );
  const question_title = question_div.appendChild( build('h3',['mt-4','display-6']) );
  const question_body = question_div.appendChild( build('p',['lead']) );
  const choices_div = question_div.appendChild( build('div',['border']) );
  question.choices.forEach((c) => buildChoice(c, question, choices_div));
  
  const editor = new SideEditor('Question '+question.code);
  editor.addTrigger(question_title);
  editor.addTrigger(question_body);
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = question.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre de la question') );
  
  // Champ d'introduction
  const body_input = build('textarea',['form-control']);
  body_input.setAttribute('rows','3');
  body_input.value = question.body;
  editor.panel.appendChild( buildFormGroup(body_input, 'Question') );
  
  // Add a new answer
  const panel_new_choice = editor.panel.appendChild( build('button',['btn', 'btn-success', 'm-1'], 'Ajouter une nouvelle réponse') );
  panel_new_choice.target="#";
  panel_new_choice.onclick = function() {
    const choice = defaultAnswer();
    question.choices.push(choice);
    buildChoice(choice, question, choices_div);
  };
  
  // Supprimer la question
  const delete_question = editor.panel.appendChild(
    build('button',['btn','btn-danger','m-3'], 'Supprimer la question') );
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

function buildFoldablePage(page, data, container) {
  const card = new Card();
  const title = card.header.appendChild( build('h3') );
  const content = card.body.appendChild( build('div') );
  const new_question = card.body.appendChild( build('div', ['card','m-3']) );
  
  page.content.forEach((q) => buildElement(q, page, content));
  
  
  // Ajout d'une nouvelle question
  new_question.appendChild( build('div', ['card-header'], "Ajouter une nouvelle question") ).addEventListener('click', function() {
    const question = defaultQuestion();
    page.content.push(question);
    buildElement(question, page, content);
  });
  // TODO
  
  const editor = new SideEditor('Page '+page.code);
  editor.addTrigger(card.header);
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = page.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Ajouter une nouvelle question
  const panel_new_question = editor.panel.appendChild( build('button',['btn','btn-success', 'm-1'], 'Ajouter une nouvelle question') );
  panel_new_question.target="#";
  panel_new_question.onclick = function() {
    const q = defaultQuestion();
    page.content.push(q);
    buildElement(q, page, content);
  };
  
  // Suppression de la page
  const delete_page = editor.panel.appendChild(
    build('button',['btn','btn-danger','m-1'], 'Supprimer la page') );
  delete_page.target="#";
  delete_page.onclick = function() {
    data.pages.splice(data.pages.indexOf(page), 1);
    card.remove();
    editor.remove();
  };
  
  // Refresh on close
  editor.action(function() {
    page.title = title_input.value;
    title.innerText = page.title;
  } );
  
  card.addTo(container);
}

var page_header = null;

function buildQuiz(data, ignored, container) {
  const quiz_title = container.appendChild( build('h1',['display-1','ms-3']) );
  const quiz_intro = container.appendChild( build('p',['lead','ms-3']) );
  
  //const pages_container = container.appendChild( build('div') );
  page_header = container.appendChild( build('ul',['nav','nav-tabs']) );
  page_header.setAttribute('id','');
  page_header.setAttribute('role','tablist');
  const pages_container = container.appendChild( build('div',['tab-content','nav-tabs']) );
  
  <ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Active</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Link</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
</div>
  
  data.pages.forEach((p) => buildElement(p, data, pages_container));
  
  const editor = new SideEditor('Quiz '+data.code);
  editor.addTrigger(quiz_title);
  editor.addTrigger(quiz_intro);
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = data.title;
  editor.panel.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Champ d'introduction
  const intro_input = build('textarea',['form-control']);
  intro_input.setAttribute('rows','3');
  intro_input.value = data.intro;
  editor.panel.appendChild( buildFormGroup(intro_input, 'Introduction') );
  
  // Ajouter une nouvelle page
  const panel_new_page = editor.panel.appendChild( build('button',['btn','btn-success', 'm-1'], 'Ajouter une nouvelle page') );
  panel_new_page.target="#";
  panel_new_page.onclick = function() {
    const page = defaultPage();
    data.pages.push(page);
    buildElement(page, data, container);
  };
  
  
  // Champ de sauvegarde
  const save_btn = editor.panel.appendChild( build('button',['btn','btn-primary','m-1'], 'Sauvegarder') );
  save_btn.target="#";
  save_btn.onclick = function() {
    // TODO
    console.log(data);
  };
  
  // Refresh on close
  editor.action(function() {
    data.title = title_input.value;
    data.intro = intro_input.value;
    quiz_title.innerText = data.title;
    quiz_intro.innerText = data.intro ? data.intro : "";
  });
  
  
}


function buildElement(elt, parent, container) {
  switch (elt.type) {
  case 'quiz'    : return buildQuiz(elt, parent, container);
  case 'page'    : return buildFoldablePage(elt, parent, container);
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
  console.log(data);
  buildElement(data, null, main_panel);
}