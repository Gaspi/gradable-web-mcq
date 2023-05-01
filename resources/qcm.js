
var qcm_data = {};

function buildTitle(elt) {
  const header = elt.appendChild( build('h5') );
  header.innerText = qcm_data.title;
  return elt;
}

function buildOptions(elt) {
  elt.innerText = JSON.stringify(qcm_data.options);
  return elt;
}

function buildSection(section) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = section.title;
  const questions_hd = card.children[1].appendChild( build('h5') );
  questions_hd.innerText = "Questions :";
  section.questions.forEach( (q) => card.children[1].appendChild( buildQuestion(q) ) );
  return card;
}

function buildQuestion(question) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = question.title;
  
  const body = card.children[1].appendChild( build('p') );
  body.innerText = `
    When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
  \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]`+question.body;
  
  const choix_hd = card.children[1].appendChild( build('h5') );
  choix_hd.innerText = "Choix :";
  question.choices.forEach( (c) => card.children[1].appendChild( buildChoice(c) ) );
  return card;
}

function buildChoice(choice) {
  const card = buildCard();
  const header = card.children[0].appendChild( build('h5') );
  header.innerText = "Choix :" + choice.name;
  card.children[1].innerText = choice.body;
  return card;
}

function buildQCMFromData() {
  const page = emptyPage();
  
  const main_div = build('div');
  title_card = main_div.appendChild( buildCard(show=true) );
  buildTitle(title_card.children[0]);
  buildOptions(title_card.children[1]);
  qcm_data.sections.forEach( (s) => main_div.appendChild( buildSection(s) ) );
  
  page.appendChild(main_div);
}

function buildNewQCM() {
  qcm_data = {
    title: "Mon nouveau QCM",
    options: {},
    sections: [
      {
        title: "Ma nouvelle section",
        questions: [
          {
            title: "Ma nouvelle question",
            body: "Intitulé de la question",
            choices: [
              {
                id: null,
                name: "1",
                body: "Réponse A"
              },
              {
                id: null,
                name: "2",
                body: "Réponse B"
              },
            ]
          }
        ]
      }
    ]
  };
  buildQCMFromData();
}

function buildQCM(txt) {
  const loaded_data = decipher( JSON.parse(txt) );
  if (loaded_data) {
    qcm_data = loaded_data;
    buildQCMFromData();
  } else {
    alert('Mot de passe incorrect ou fichier corrompu');
  }
}


