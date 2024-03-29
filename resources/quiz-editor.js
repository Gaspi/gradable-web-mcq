// JS resources (backwards for pop-loading)
const js_resources = [
  { src: "resources/editor.js" },
  { src: "resources/save.js" },
  { src: "resources/utils.js" },
  {
    src: "https://polyfill.io/v3/polyfill.min.js?features=es6"
  },
  {
    src: "https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js",
    id: "MathJax-script"
  },
  {
    src: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js",
    integrity: "sha256-/H4YS+7aYb9kJ5OKhFYPUjSJdrtV6AeyJOtTkw6X72o=",
    crossorigin: "anonymous"
  },
  {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    integrity: "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM",
    crossorigin: "anonymous"
  }
]

function load_js_resources() {
  if (js_resources.length) {
    let lnk = js_resources.pop();
    let loader = document.createElement("script");
    if (lnk.id         ) { loader.setAttribute("id"         , lnk.id         ); }
    if (lnk.src        ) { loader.setAttribute("src"        , lnk.src        ); }
    if (lnk.integrity  ) { loader.setAttribute("integrity"  , lnk.integrity  ); }
    if (lnk.crossorigin) { loader.setAttribute("crossorigin", lnk.crossorigin); }
    loader.addEventListener("load", load_js_resources);
    document.body.appendChild(loader);
  } else { // Start building page when done with JS resources
    init();
  }
}

// CSS resources (backwards for pop loading)
const css_resources = [
  {
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    integrity: "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC",
    crossorigin: "anonymous"
  }
]

function load_css_resources() {
  if (css_resources.length) {
    let lnk = css_resources.pop();
    let loader = document.createElement("link");
    loader.setAttribute("rel", "stylesheet");
    
    if (lnk.href       ) { loader.setAttribute("href"       , lnk.href       ); }
    if (lnk.integrity  ) { loader.setAttribute("integrity"  , lnk.integrity  ); }
    if (lnk.crossorigin) { loader.setAttribute("crossorigin", lnk.crossorigin); }
    loader.addEventListener("load", load_css_resources);
    document.head.appendChild(loader);
  } else { // Load JS when done with CSS
    load_js_resources();
  }
}

// Add proper icon
const iconlink = document.createElement('link');
iconlink.setAttribute("rel", "icon");
iconlink.setAttribute("href", "data:image/png;base64,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");
document.head.appendChild(iconlink);

// Meta viewport
const metaTag = document.createElement('meta');
metaTag.name = "viewport"
metaTag.content = "width=device-width, initial-scale=1.0"
document.head.appendChild(metaTag);

// Fix title
document.title = 'Quiz';

// Load CSS then JS resources
load_css_resources();
