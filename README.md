<div align="center">

<img src="./assets/images/logo-d.png" alt="EdgePane Logo" width="50" style="vertical-align: middle; margin-right: 8px;" />

# EdgePane — Pane Perfect Experience  

<sub>Beautiful and customizable sidebar component</sub>  

![HTML5](https://img.shields.io/badge/HTML5-orange?logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/CSS3-blue?logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## 📖 Documentation

Full documentation is available here:  
👉 [EdgePane Docs](https://ezex377.github.io/EdgePane/index.html)

---

## 🚀 Installation (via CDN)

Add the following to your HTML:

```html
<link rel="stylesheet" href="https://ezex377.github.io/EdgePane/dist/edgepane.min.css" />
<script src="https://ezex377.github.io/EdgePane/dist/edgepane.min.js"></script>
```
---

## ⚡ Basic usage

HTML:

```html
<!-- Sidebar -->
<nav class="egp-sidebar bg-neutral-800" role="navigation">

  <!-- Sidebar Header -->
  <div class="egp-sidebar-header">
    <img src="./assets/images/logo-d.png" alt="Logo" class="egp-sidebar-logo" />
    <div class="egp-sidebar-title">
      <p class="egp-sidebar-brand-name">EdgePane</p>
      <p class="egp-sidebar-brand-tagline">Pane Perfect Experience</p>
    </div>
  </div>

  <!-- Sidebar Menu -->
  <ul class="egp-sidebar-menu">
    <li class="egp-sidebar-section-heading" data-section-heading="MAIN NAVIGATION"></li>
    <li>
      <a href="#" class="egp-sidebar-link">
        <span class="egp-sidebar-link-icon"><i class="bi bi-house"></i></span>
        <span class="egp-sidebar-link-text">Dashboard</span>
      </a>
    </li>
    <li>
      <a href="#" class="egp-sidebar-link">
        <span class="egp-sidebar-link-icon"><i class="bi bi-gear"></i></span>
        <span class="egp-sidebar-link-text">Settings</span>
      </a>
    </li>
    <li class="egp-has-dropdown">
      <a href="#" class="egp-sidebar-link">
        <span class="egp-sidebar-link-icon"><i class="bi bi-folder"></i></span>
        <span class="egp-sidebar-link-text">Projects</span>
        <span class="egp-sidebar-dropdown-icon"><i class="bi bi-chevron-down"></i></span>
      </a>
      <ul class="egp-sidebar-dropdown-menu">
        <li><a href="#">Project A</a></li>
        <li><a href="#">Project B</a></li>
      </ul>
    </li>
  </ul>
</nav>

<!-- Main Content -->
<div class="egp-main-content">
  <button class="egp-sidebar-toggle">☰</button>
  <h1>Welcome</h1>
</div>

<!-- Overlay -->
<div class="egp-sidebar-overlay"></div>
```

JS:

```js
edgePane.init({
    sidebarState: "open",
    closeOnClickOutside: true,
    dropdownMode: "single"
});
```

---

## 💡  Issues

Found a bug? Have a feature request?

Please open an issue here → 👉 [GitHub Issues](https://github.com/EZeX377/EdgePane/issues)

<sub>This helps improve the project for everyone!</sub>

---

## 📜  MIT License

<sub>MIT License</sub>

<sub>Copyright (c) 2025 Ronny Das</sub>

<sub>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to 
the following conditions: </sub>

<sub>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</sub>

<sub>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</sub>