class MenuToggler extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", this.toggleMenu);
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }

    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Toggle menu");
    }

    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.toggleMenu);
  }

  toggleMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("menu--visible");
  }
}

customElements.define("menu-toggler", MenuToggler);
