

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

function get(id) { return document.getElementById(id); }

function build(elt, classes) {
  const res = document.createElement(elt);
  if (classes) {
    res.className = classes.join(' ');
  }
  return res;
}

function removeAllChildren(node) {
  while (node.firstChild) {  node.removeChild(node.lastChild);  }
  return node;
}

function emptyPage() {
  return removeAllChildren(get('main-container'));
}

function buildCard(show=false) {
  const card = build('div', ['card','m-3']);
  const card_header = card.appendChild( build('div', ['card-header']) );
  const card_body = card.appendChild( build('div',['card-body','collapse']) );
  if (show) {
    card_body.classList.toggle('show');
  }
  card_header.onclick = function() { card_body.classList.toggle('show'); };
  return card;
}


// File loading
function load_file(file, callback) {
  if (!file) { return; }
  const reader = new FileReader();
  reader.onload = (e)=>callback(e.target.result);
  reader.readAsText(file);
}
