/* =========================================================
   ImmoInsel · Immobilienmakler – Interaktion
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Aktuelles Jahr in der Fußzeile --- */
  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = new Date().getFullYear();

  /* --- Mobiles Menü --- */
  var burger = document.getElementById("burger");
  var header = document.getElementById("siteHeader");
  var panel = document.getElementById("navPanel");

  function closeMenu() {
    if (!header) return;
    header.classList.remove("open");
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Menü öffnen");
    }
  }

  if (burger && header) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });

    // Menü nach Klick auf einen Link schließen
    if (panel) {
      panel.addEventListener("click", function (e) {
        if (e.target.closest("a")) closeMenu();
      });
    }

    // Escape schließt das Menü
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --- Objektart-Auswahl (Wertermittlungs-Karte) --- */
  var chips = document.querySelectorAll(".chips .chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("sel"); });
      chip.classList.add("sel");
    });
  });

  /* --- Objekt merken (Herz-Button) --- */
  document.querySelectorAll(".lcard-fav").forEach(function (fav) {
    fav.addEventListener("click", function () {
      var on = fav.classList.toggle("on");
      fav.setAttribute("aria-pressed", String(on));
    });
  });

  /* --- Aktive Navigation beim Scrollen --- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute("id");
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* --- Sanftes Scrollen für Anker-Links --- */
  if (!reduce) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }
})();
