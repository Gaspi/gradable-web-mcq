
var side_panel, main_panel;

function buildPage() {
  const d1 = document.body.appendChild( build('div', ['container-fluid']) );
  const d2 = d1.appendChild( build('div', ['row','row-offcanvas','row-offcanvas-left','vh-100']) );
  side_panel = d2.appendChild( build('div', ['col-md-3','sidebar-offcanvas','h-100','overflow-auto','bg-light']) );
  side_panel.setAttribute('role','navigation');
  main_panel = d2.appendChild( build('main', ['col','main','h-100','overflow-auto']) );
}

function emptyPage() {
  removeAllChildren(main_panel);
}

function buildChoice(choice) {
  const card = new Card();
  
  // Champ de titre
  const body_input = build('input',['form-control']);
  body_input.setAttribute('type','text');
  body_input.value = choice.body;
  card.body.appendChild( buildFormGroup(body_input, 'Réponse') );
  
  // Correct tick
  const correct_tick = build('input',['form-check-input']);
  correct_tick.setAttribute('type','checkbox');
  correct_tick.checked = choice.correct;
  card.body.appendChild( buildFormGroup(correct_tick, 'Correcte ?', tick=true) );
  
  // Delete choice
  const delete_choice = card.body.appendChild(
    build('button',['btn','btn-danger','m-2'], 'Supprimer le choix') );
  delete_choice.target="#";
  delete_choice.onclick = function() {
    card.remove();
    delete card;
  };
  
  // Refresh on close
  card.onclose( function() {
    choice.correct = correct_tick.checked;
    choice.body = body_input.value;
    removeAllChildren(card.header);
    card.header.appendChild( build('span',
      [choice.correct ? 'text-success' : 'text-danger'], choice.correct ? '\u2713 ' : '\u2717 ') );
    const choice_txt = card.header.appendChild( build('span', ['ml-3'], choice.body) );
    typeset(() => [choice_txt]);
    } );
  
  return card;
}

function buildQuestion(question) {
  const card = new Card();
  
  const config_card = new Card().addTo(card.body);
  const choices = card.body.appendChild( build('div') );
  const new_choice = card.body.appendChild( build('div', ['card','m-3']) );
  
  function register_choice(c) {
    buildChoice(c).addTo(choices).onremove = function() {
      question.choices.splice(question.choices.indexOf(c), 1);
    };
  }
  question.choices.forEach(register_choice);
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = question.title;
  config_card.body.appendChild( buildFormGroup(title_input, 'Titre de la question') );
  
  // Champ d'introduction
  const body_input = build('textarea',['form-control']);
  body_input.setAttribute('rows','3');
  body_input.value = question.body;
  config_card.body.appendChild( buildFormGroup(body_input, 'Question') );
  
  // Ajout d'un nouveau choix
  new_choice.appendChild( build('div', ['card-header'], "Ajouter une nouvelle réponse") ).addEventListener('click', function() {
    const c = defaultChoice();
    question.choices.push(c);
    register_choice(c);
  });
  
  // Suppression de la question
  const delete_question = config_card.body.appendChild(
    build('button',['btn','btn-danger','m-2'], 'Supprimer la question') );
  delete_question.target="#";
  delete_question.onclick = function() {
    card.remove();
    delete card;
  };
  
  
  
  // Refresh on close
  config_card.onclose( function() {
      question.title = title_input.value;
      question.body = body_input.value;
      removeAllChildren(config_card.header);
      removeAllChildren(card.header);
      card.header.appendChild( build('h5', [], question.title) );
      const body = config_card.header.appendChild( build('p', [], question.body) );
      typeset(() => [body]);
    } );
  
  return card;
}

function buildSection(section) {
  const card = new Card();
  const config_card = new Card().addTo(card.body);
  const questions = card.body.appendChild( build('div') );
  const new_question = card.body.appendChild( build('div', ['card','m-3']) );
  
  function register_question(q) {
    buildQuestion(q).addTo(questions).onremove = function() {
      section.questions.splice(section.questions.indexOf(q), 1);
    };
  };
  section.questions.forEach(register_question);
  // TODO
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = section.title;
  config_card.body.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Champ d'introduction
  const intro_input = build('textarea',['form-control']);
  intro_input.setAttribute('rows','3');
  intro_input.value = section.intro;
  config_card.body.appendChild( buildFormGroup(intro_input, 'Introduction') );
  
  // Suppression de la section
  const delete_section = config_card.body.appendChild(
    build('button',['btn','btn-danger','m-3'], 'Supprimer la section') );
  delete_section.target="#";
  delete_section.onclick = function() {
    card.remove();
    delete card;
  };
  
  // Ajout d'une nouvelle question
  new_question.appendChild( build('div', ['card-header'], "Ajouter une nouvelle question") ).addEventListener('click', function() {
    const q = defaultQuestion();
    section.questions.push(q);
    register_question(q);
  });
  
  // Refresh on close
  config_card.onclose( function() {
      section.title = title_input.value;
      section.intro = intro_input.value;
      removeAllChildren(config_card.header);
      removeAllChildren(card.header);
      card.header.appendChild( build('h3', [], section.title) );
      if (section.intro) {
        const intro = config_card.header.appendChild( build('p', [], section.intro) );
        typeset(() => [intro]);
      } else {
        config_card.header.appendChild( build('h5', [], '[Administration]') );
      }
    } );
  
  return card;
}

function buildTitleQCM(data) {
  const card = new Card();
  
  // Champ de titre
  const title_input = build('input',['form-control']);
  title_input.setAttribute('type','text');
  title_input.value = data.title;
  card.body.appendChild( buildFormGroup(title_input, 'Titre') );
  
  // Champ d'introduction
  const intro_input = build('textarea',['form-control']);
  intro_input.setAttribute('rows','3');
  intro_input.value = data.intro;
  card.body.appendChild( buildFormGroup(intro_input, 'Introduction') );
  
  // Champ de sauvegarde
  const save_btn = card.body.appendChild( build('button',['btn','btn-primary','m-3'], 'Sauvegarder') );
  save_btn.target="#";
  save_btn.onclick = function() {
    // TODO
    console.log(data);
  };
  
  // Refresh on close
  card.onclose(function() {
      data.title = title_input.value;
      data.intro = intro_input.value;
      
      removeAllChildren(card.header);
      card.header.appendChild( build('h2',[], data.title) );
      if (data.intro) {
        card.header.appendChild( build('p', [], data.intro) );
      }
    });
  return card;
}

function buildQCM() {
  qcm_data = decipher(qcm_data);
  buildPage();
  if (!qcm_data) { return; }
  main_panel.appendChild( build('h1',['display-4','ml-2','m-3'],'Test') );
  main_panel.appendChild( build('div',['ml-3','m-3']) ).appendChild( build('p',['','ml-3'],'Test2') );
  
  
  buildTitleQCM(qcm_data).addTo(main_panel);
  const sections = main_panel.appendChild( build('div') );
  const new_section = main_panel.appendChild( build('div', ['card','m-3']) );
  
  function register_section(s) {
    buildSection(s).addTo(sections).onremove = function() {
      qcm_data.sections.splice(qcm_data.sections.indexOf(s), 1);
    }
  }
  
  qcm_data.sections.forEach(register_section);
  
  // Ajout d'une nouvelle section
  new_section.appendChild( build('div', ['card-header'], "Ajouter une nouvelle section") ).addEventListener('click', function() {
    const s = defaultSection();
    qcm_data.sections.push(s);
    register_section(s);
  });
}
