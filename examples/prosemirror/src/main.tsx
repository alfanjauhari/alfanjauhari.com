import { render } from "solid-js/web";
import { App } from "./App";
import "@alfanjauhari/solid-prosemirror/style.css";
import "./styles.css";

const root = document.getElementById("root");

if (!root) throw new Error("The application root was not found.");

render(() => <App />, root);
