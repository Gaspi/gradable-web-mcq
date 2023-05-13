

function decipher(o) {
  if (!o.lock) { return o; }
  const password = prompt("Mot de passe ["+o.lock+"] requis :");
  const deciphered = CryptoJS.AES.decrypt(o.payload, password).toString(CryptoJS.enc.Utf8);
  let parsed_data = null;
  try {
     parsed_data = JSON.parse(deciphered);
  } catch(e) {
    alert('Mot de passe incorrect ou fichier corrompu');
    return null;
  }
  if (parsed_data) {
    return decipher(parsed_data);
  } else {
    alert('Mot de passe incorrect ou fichier corrompu');
    return null;
  }
}

var formGroupCount=0;
function buildFormGroup(elt, label, tick=false) {
  if (!elt.id) {
    elt.id = 'formGroup'+(++formGroupCount);
  }
  const lbl = build('label',[],label);
  lbl.setAttribute('for', elt.id);
  
  if (tick) {
    const res = build('div',['form-check']);
    res.appendChild(elt);
    res.appendChild(lbl);
    return res;
  } else {
    const res = build('div',['form-group']);
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

function build(elt, classes, innerText) {
  const res = document.createElement(elt);
  if (classes) {
    res.className = classes.join(' ');
  }
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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



class Card {
  constructor() {
    this.card = build('div', ['card','m-3']);
    this.header = this.card.appendChild( build('div', ['card-header']) );
    this.body = this.card.appendChild( build('div',['card-body','collapse']) );
    const self = this;
    this.header.addEventListener('click', () => self.toggle());
  }
  
  toggle(val) {
    this.body.classList.toggle('show', val);
  }
  
  addTo(container) {
    this.container = container;
    container.appendChild(this.card);
    return this;
  }
  
  remove() {
    this.container.removeChild(this.card);
    if (this.onremove instanceof Function) {
      this.onremove();
    }
  }
  
  onclose(f) {
    const body = this.body;
    f();
    this.header.addEventListener('click', () => body.classList.contains('show') || f());
  }
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
