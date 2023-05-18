

const prefix = `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <script>
      var data =
`;

const postfix = `;
      window.onload = function() {
        let loader = document.createElement("script");
        loader.setAttribute("src", "resources/main.js");
        loader.addEventListener("load", () => { main(); });
        loader.addEventListener("error", (ev) => {
          let p = document.createElement("p");
          p.innerText = "Erreur du chargement: "+ ev;
          document.body.appendChild(p);
        });
        document.body.appendChild(loader);
      };
    </script>
  </body>
</html>
`

// Custom text downloading as file
function download_text(text, filename) {
  const file = new File([text], filename)
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox : wait a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
  }, 0);
}

function save(o, filename) {
  download_text(prefix+JSON.stringify(o)+postfix, filename+".html");
}