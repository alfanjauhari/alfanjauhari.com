class LoadMore extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }

    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Load more");
    }

    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    let page = new URLSearchParams(window.location.search).get("page") || "1";

    page = page.match(/^[0-9]+$/) !== null ? page : "1";

    this.setAttribute("href", "?page=" + (parseInt(page, 16) + 1));
  }
}

customElements.define("load-more", LoadMore);
