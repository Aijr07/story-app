import './style.css';
import Router from "./router/Router.js";
import "./components/Header.js";
import "./components/Footer.js";

// import { createPushButton } from './components/PushButton.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  new Router(document.querySelector("#app"));
});