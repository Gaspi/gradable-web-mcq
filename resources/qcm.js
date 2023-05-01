
defaultQuestions = [
  "Calculez \\[ \\int_1^{+\\infty} \\frac{\\ln(x)}{x^2}\\text{d}x \\]",
  "Calculez \\[ \\sum_{0 \\leq n \\leq +\\infty} \\frac{1}{n^{\\frac{3}{2}}} \\]",
]
defaultAnswers = [
  "\\( 3.1415 / \\pi \\)",
  "\\( \\frac{\\sqrt{n}}{2\\pi} \\)",
]

function defaultAnswer() {
  return defaultAnswers[getRandomInt(defaultAnswers.length)];
}

function defaultQuestionBody() {
  return defaultQuestions[getRandomInt(defaultQuestions.length)];
}

function defaultQuestion() {
  return {
      code: null,
      title: "Titre de question par défaut",
      body: defaultQuestionBody(),
      choices: [
        {
          code: null,
          correct: false,
          body: defaultAnswer(),
        },
        {
          code: null,
          correct: true,
          body: defaultAnswer(),
        },
      ]
    };
}

function defaultSection() {
  return {
      code: null,
      title: "Titre de section par défaut",
      intro: "Texte d'introduction par défaut",
      questions: [ defaultQuestion() ]
    };
}

function defaultMCQ() {
  return {
    code: null,
    title: "Mon nouveau QCM",
    intro: "Ce QCM est à destination des L3",
    sections: [ defaultSection() ],
  }
}

var qcm_data = {};



function buildBodyQuestion(question) {
  const card = buildCard();
  const body = card.children[0].appendChild( build('p', [], question.body) );
  const question_admin = card.children[1].appendChild( build('form') );
  // TODO
  typeset(() => [body]);
  return card;
}

function buildChoice(choice) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = (choice.correct ? '\u2705' : '\u274C') + choice.body;
  const choice_admin = card.children[1].appendChild( build('form') );
  // TODO
  typeset(() => [header]);
  return card;
}

function buildQuestion(question) {
  const card = buildCard();
  card.children[0].appendChild( build('h5', [], question.title) );
  card.children[1].appendChild( buildBodyQuestion(question) );
  question.choices.forEach( (c) => card.children[1].appendChild( buildChoice(c) ) );
  return card;
}

// Construction du DOM d'intro / paramètrage de section
function buildIntroSection(section) {
  const card = buildCard();
  if (section.intro) {
    const intro = card.children[0].appendChild( build('p', [], section.intro) );
    typeset(() => [intro]);
  } else {
    card.children[0].appendChild( build('h5', [], '[Administration]') );
  }
  const section_admin = card.children[1].appendChild( build('form') );
  // TODO
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.innerText = section.title;
  section_admin.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Champ d'introduction
  const intro_input = build('textarea',['form-control']);
  intro_input.setAttribute('rows','3');
  intro_input.innerText = section.intro;
  section_admin.appendChild( buildFormGroup(intro_input, 'Introduction') );

  //
  return card;
}

function buildSection(section) {
  const card = buildCard();
  card.children[0].appendChild( build('h3', [], section.title) );
  card.children[1].appendChild( buildIntroSection(section) );
  section.questions.forEach( (q) => card.children[1].appendChild( buildQuestion(q) ) );
  card.children[0].onclick = function() {console.log('test'); };
  return card;
}

function buildTitleQCM(data) {
  const card = buildCard();
  card.children[0].appendChild( build('h2',[], data.title) );
  if (data.intro) {
    card.children[0].appendChild( build('p', [], data.intro) );
  }
  const qcm_admin = card.children[1].appendChild( build('form') );
  // TODO
  return card;
}

function buildQCMFromData(data) {
  if (!data) { return; }
  qcm_data = data;
  const page = emptyPage();
  const main_div = build('div');
  main_div.appendChild( buildTitleQCM(qcm_data) );
  qcm_data.sections.forEach( (s) => main_div.appendChild( buildSection(s) ) );
  page.appendChild(main_div);
}

function buildNewQCM() {
  buildQCMFromData( defaultMCQ() );
}

function buildQCM(txt) {
  buildQCMFromData( decipher( JSON.parse(txt) ) );
}


