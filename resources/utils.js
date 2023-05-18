
function decipher(o) {
  if (!o.lock) { return o; }
  const password = prompt("Mot de passe ["+o.lock+"] requis :");
  try {
    const parsed_data = JSON.parse( CryptoJS.AES.decrypt(o.payload, password).toString(CryptoJS.enc.Utf8) );
    if (parsed_data) {
      return decipher(parsed_data);
    } else {
      alert('Mot de passe incorrect ou fichier corrompu');
      return null;
    }
  } catch(e) {
    alert('Mot de passe incorrect ou fichier corrompu');
    return null;
  }
}

function cipher(o, user, password) {
  return {
    lock: user,
    payload: CryptoJS.AES.encrypt(JSON.stringify(o), password)+""
  };
}

var formGroupCount=0;
function buildFormGroup(elt, label, tick=false) {
  if (!elt.id) {
    elt.id = 'formGroup'+(++formGroupCount);
  }
  const lbl = mk('label',[],label);
  lbl.setAttribute('for', elt.id);
  
  if (tick) {
    const res = mk('div',['form-check']);
    res.appendChild(elt);
    res.appendChild(lbl);
    return res;
  } else {
    const res = mk('div',['form-group']);
    res.appendChild(lbl);
    res.appendChild(elt);
    return res;
  }
}

function htmltick(ok) {
  return (ok ? '<span style="color: green">\u2713</span>' :
    '<span style="color: red">\u2717</span>');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomPick(set) { return set[getRandomInt(set.length)]; }

function get(id) { return document.getElementById(id); }

function mk(elt, classes=[], innerText) {
  const res = document.createElement(elt);
  res.classList.add(...classes);
  if (innerText) {
    res.innerText = innerText;
  }
  return res;
}

function removeAllChildren(node) {
  while (node.firstChild) {  node.removeChild(node.lastChild);  }
  return node;
}


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// File loading
function load_file(file, callback) {
  if (!file) { return; }
  const reader = new FileReader();
  reader.onload = (e)=>callback(e.target.result);
  reader.readAsText(file);
}

function typeset(code) {
  MathJax.startup.promise = MathJax.startup.promise
    .then(() => MathJax.typesetPromise(code()))
    .catch((err) => console.log('Typeset failed: ' + err.message));
  return MathJax.startup.promise;
}


// Text areas

const resizableAreas = [];
var resizableAreasSize = 10;

function mkTextArea() {
  const elt = mk('textarea',['form-control']);
  elt.setAttribute('rows',resizableAreasSize);
  resizableAreas.push(elt);
  return elt;
}
function setTextAreaSize(size) {
  if (size != resizableAreasSize) {
    resizableAreasSize = size;
    resizableAreas.forEach(function (e) {
      e.setAttribute('rows',resizableAreasSize);
    })
  }
}
function extendEditorSize() {
  if (resizableAreasSize < 30) {
    setTextAreaSize(resizableAreasSize+1);
  }
}
function reduceEditorSize() {
  if (resizableAreasSize > 3) {
    setTextAreaSize(resizableAreasSize-1);
  }
}


// Elements (usually button) with alternative (usually shorter) text (usually a symbol)

const eltWithAlternative = [];
var alterantiveOn = false;

function setAlternativeInnerText(elt, txt, alt) {
  eltWithAlternative.push( [elt, txt, alt] );
  elt.innerText = alterantiveOn ? alt : txt;
}

function setAlternative(alt) {
  if (alt != alterantiveOn) {
    alterantiveOn = alt;
    eltWithAlternative.forEach(function (e) {
      e[0].innerText = alterantiveOn ? e[2] : e[1];
    });
  }
}

