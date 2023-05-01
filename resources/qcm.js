
defaultQuestions = [
  "Calculez \\[ \\int_1^{+\\infty} \\frac{\\ln(x)}{x^2}\\text{d}x \\]",
  "Calculez \\sum_{0 \\leq n \\leq +\\infty} \\frac{1}{n^{\\frac{3}{2}}} \\]",
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
      title: "Titre de question par défaut",
      body: defaultQuestionBody(),
      choices: [
        {
          id: null,
          name: "1",
          body: defaultAnswer(),
        },
        {
          id: null,
          name: "2",
          body: defaultAnswer(),
        },
      ]
    };
}

function defaultSection() {
  return {
      title: "Titre de section par défaut",
      questions: [ defaultQuestion() ]
    };
}


var qcm_data = {};

function buildTitle(elt) {
  const header = elt.appendChild( build('h2') );
  header.innerText = qcm_data.title;
  return elt;
}

function buildOptions(elt) {
  elt.innerText = JSON.stringify(qcm_data.options);
  return elt;
}

function buildNewSection() {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h3') );
  header.innerText = "Nouvelle section";
  return card;
}

function buildSection(section) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h3') );
  header.innerText = section.title;
  card.children[1].appendChild( buildEditSection() );
  section.questions.forEach( (q) => card.children[1].appendChild( buildQuestion(q) ) );
  card.children[1].appendChild( buildNewQuestion() );
  return card;
}

function buildQuestion(question) {
  const card = buildCard();
  card.children[0].appendChild( build('h5', [], question.title) );
  const view = card.children[1].appendChild( build('div') );
  refreshViewQuestion(question, view);
  
  card.children[1].appendChild( buildEditQuestion(question, view) );
  question.choices.forEach( (c) => card.children[1].appendChild( buildEditChoice(c, view) ) );
  card.children[1].appendChild( buildNewChoice(question, view) );
  
  return card;
}

function refreshViewQuestion(question, view) {
  removeAllChildren(view);
  view.appendChild( build('p', [], question.body) );
  view.appendChild( build('h5', [], "Choix :") );
  const choices_list = view.appendChild( build('ul') );
  question.choices.forEach(function(c) {
	  const choice_li = choices_list.appendChild( build('li') );
	  choice_li.innerText = c.name + ":" + c.body;
	});
  typeset(() => [view]);
}

function buildEditQuestion(question, view) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = "Editer la question";
  return card;
}

function buildEditSection(section) {
  const card = buildCard();
  card.children[0].appendChild( build('h5', [], "Editer la section") );
  return card;
}

function buildNewQuestion(question) {
  const card = buildCard();
  card.children[0].appendChild( build('h5', [], "Ajouter une nouvelle question") );
  return card;
}

function buildEditChoice(choice, view) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = "Editer réponse : " + choice.name;
  return card;
}

function buildNewChoice(question, view) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = "Ajouter une nouvelle réponse";
  return card;
}

function buildQCMFromData(data) {
  if (!data) { return; }
  qcm_data = data;
  const page = emptyPage();
  
  const main_div = build('div');
  title_card = main_div.appendChild( buildCard(show=true) );
  buildTitle(title_card.children[0]);
  buildOptions(title_card.children[1]);
  qcm_data.sections.forEach( (s) => main_div.appendChild( buildSection(s) ) );
  main_div.appendChild( buildNewSection() );
  page.appendChild(main_div);
}

function buildNewQCM() {
  buildQCMFromData({
    title: "Mon nouveau QCM",
    options: {},
    sections: [ defaultSection() ],
  });
}

function buildQCM(txt) {
  buildQCMFromData( decipher( JSON.parse(txt) ) );
}


