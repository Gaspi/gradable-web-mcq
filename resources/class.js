

var class_data = {};

function buildClassFromData() {
  const page = emptyPage();
  
  const name_div = build('div');
  if (class_data.title) {
    const name_h = title_div.appendChild( build('h1') );
    name_h.innerText = class_data.name;
  }
  
  const raw_div = build('div');
  raw_div.innerText = JSON.stringify(class_data);
  
  page.appendChild(title_div);
  page.appendChild(raw_div);
}

function buildNewClass() {
  class_data = {
    name: "Mon nouveau QCM",
    level: null,
    students: [
      {
        id: "",
        lastname: null,
        firstname: null,
      }
    ]
  };
  buildClassFromData();
}

function buildClass(txt) {
  const loaded_data = decipher( JSON.parse(txt) );
  if (loaded_data) {
    qcm_data = loaded_data;
    buildClassFromData();
  }
}

