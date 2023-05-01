
function buildMainMenu() {
  const page = emptyPage();
  const row = build('div',['row']);
  const col0 = row.appendChild( build('div',['col','m-3']) );
  const col1 = row.appendChild( build('div',['col','m-3']) );
  const col2 = row.appendChild( build('div',['col','m-3']) );
  const col3 = row.appendChild( build('div',['col','m-3']) );
  const col4 = row.appendChild( build('div',['col','m-3']) );
  const col5 = row.appendChild( build('div',['col','m-3']) );
  
  
  const button0 = col0.appendChild( build('a',['btn','btn-success','btn-lg']) );
  button0.role="button";
  button0.href="#";
  button0.innerText="Nouveau QCM";
  button0.onclick=buildNewQCM;
  
  const input1 = col1.appendChild( build('input',['d-none']) );
  input1.setAttribute('type',"file");
  input1.accept = ".qcm";
  input1.onchange = function (e) { load_file(e.target.files[0], buildQCM); input1.value=''; };
  const button1 = col1.appendChild( build('a',['btn','btn-primary','btn-lg']) );
  button1.role="button";
  button1.href="#";
  button1.onclick = (e)=>{input1.click()};
  button1.innerText = "Charger un QCM";
  
  
  const button2 = col2.appendChild( build('a',['btn','btn-success','btn-lg']) );
  button2.role="button";
  button2.href="#";
  button2.innerText = "Nouvelle classe";
  button2.onclick=buildNewClass;
  
  const input3 = col3.appendChild( build('input',['d-none']) );
  input3.setAttribute('type',"file");
  input3.accept = ".classe";
  input3.onchange = function (e) { load_file(e.target.files[0], buildClass); input3.value=''; };
  const button3 = col3.appendChild( build('a',['btn','btn-primary','btn-lg']) );
  button3.role="button";
  button3.href="#";
  button3.onclick = (e)=>{input3.click()};
  button3.innerText = "Charger une classe";
  
  
  const button4 = col4.appendChild( build('a',['btn','btn-success','btn-lg']) );
  button4.role="button";
  button4.href="#";
  button4.innerText = "Nouvelle session";
  
  const button5 = col5.appendChild( build('a',['btn','btn-primary','btn-lg']) );
  button5.role="button";
  button5.href="#";
  button5.innerText = "Vérifier une session";
  
  page.appendChild(row);
}
