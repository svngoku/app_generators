import './style.css';
import 'highlight.js/styles/tomorrow-night-bright.css';
import hljs from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import { Config ,  Schema, Generator} from "./types/meta_model";

hljs.registerLanguage('typescript', typescript);

const config : Config = {
    name: "App generator",
    application: "dashboard",
    scope: "name"
};

const generateLayer =  (generator, domain, config) => {
    return `<pre><code class="language-typescript">{}</code></pre>`
};

const appDiv: HTMLElement = document.getElementById("app");

appDiv.innerHTML += `<h2>Data Layer</h2>`;
// appDiv.innerHTML += generateLayer(ServiceGenerator, domain, config);
// appDiv.innerHTML += `<h2>State Layer</h2>`;
// appDiv.innerHTML += generateLayer(ReducerGenerator, domain, config);

hljs.highlightAll();


