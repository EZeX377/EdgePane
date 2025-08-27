# EdgePane —— Pane Perfect Experience

Beautiful and customizable sidebar component.  
Released under the **MIT License**.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./docs/license.html)

---

## Documentation

📖 Full documentation is available here: [EdgePane Docs](https://ezex377.github.io/EdgePane/index.html)

---

## Installation (via CDN)

Just include the following in your HTML:

```html
<link rel="stylesheet" href="https://ezex377.github.io/EdgePane/dist/edgepane.min.css" />
<script src="https://ezex377.github.io/EdgePane/dist/edgepane.min.js"></script>
```

---

## Basic usage

HTML:

```html
&lt;!-- Sidebar -->
&lt;nav class="egp-sidebar bg-neutral-800" role="navigation">

  &lt;!-- Sidebar Header -->
  &lt;div class="egp-sidebar-header">
    &lt;img src="./assets/images/logo-d.png" alt="Logo" class="egp-sidebar-logo" />
    &lt;div class="egp-sidebar-title">
      &lt;p class="egp-sidebar-brand-name">EdgePane&lt;/p>
      &lt;p class="egp-sidebar-brand-tagline">Pane Perfect Experience&lt;/p>
    &lt;/div>
  &lt;/div>

  &lt;!-- Sidebar Menu -->
  &lt;ul class="egp-sidebar-menu">
    &lt;li class="egp-sidebar-section-heading" data-section-heading="MAIN NAVIGATION">&lt;/li>
    &lt;li>
      &lt;a href="#" class="egp-sidebar-link">
        &lt;span class="egp-sidebar-link-icon">&lt;i class="bi bi-house">&lt;/i>&lt;/span>
        &lt;span class="egp-sidebar-link-text">Dashboard&lt;/span>
      &lt;/a>
    &lt;/li>
    &lt;li>
      &lt;a href="#" class="egp-sidebar-link">
        &lt;span class="egp-sidebar-link-icon">&lt;i class="bi bi-gear">&lt;/i>&lt;/span>
        &lt;span class="egp-sidebar-link-text">Settings&lt;/span>
      &lt;/a>
    &lt;/li>
    &lt;li class="egp-has-dropdown">
      &lt;a href="#" class="egp-sidebar-link">
        &lt;span class="egp-sidebar-link-icon">&lt;i class="bi bi-folder">&lt;/i>&lt;/span>
        &lt;span class="egp-sidebar-link-text">Projects&lt;/span>
        &lt;span class="egp-sidebar-dropdown-icon">&lt;i class="bi bi-chevron-down">&lt;/i>&lt;/span>
      &lt;/a>
      &lt;ul class="egp-sidebar-dropdown-menu">
        &lt;li>&lt;a href="#">Project A&lt;/a>&lt;/li>
        &lt;li>&lt;a href="#">Project B&lt;/a>&lt;/li>
      &lt;/ul>
    &lt;/li>
  &lt;/ul>
&lt;/nav>

&lt;!-- Main Content -->
&lt;div class="egp-main-content">
  &lt;button class="egp-sidebar-toggle">☰&lt;/button>
  &lt;h1>Welcome&lt;/h1>
&lt;/div>

&lt;!-- Overlay -->
&lt;div class="egp-sidebar-overlay">&lt;/div>
```

JS:

```js
edgePane.init({
    sidebarState: "open",
    hoverExpand: true,
    closeOnClickOutside: true,
    dropdownMode: "single",
    rememberDropdowns: true,
    fontFamily: "'Montserrat', sans-serif",
    sidebarWidth: "18rem",
    sidebarColor: "rgba(225,225,225,1)",
    textColor: "rgba(70,70,70,1)",
    activeLinkBg: "rgba(180,180,180,1)",
    activeLinkColor: "rgba(70,70,70,1)",
    showBrand: true,
    onSidebarToggle: function (state) {
        console.log("Sidebar state changed →", state);
        // Example: update a status badge
        document.querySelector("#sidebarStatus").textContent = state;
    },
    onDropdownToggle: function (id, isOpen) {
        console.log("Dropdown toggled →", id, "Open:", isOpen);
        // Example: highlight the dropdown if open
        const el = document.getElementById(id);
        if (el) {
            el.style.backgroundColor = isOpen ? "rgba(0,150,136,0.1)" : "transparent";
        }
    },
});
```

---

## License

MIT License

Copyright (c) 2025 Ronny Das

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.