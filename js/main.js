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
  var objektart = document.getElementById("objektart");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("sel"); });
      chip.classList.add("sel");
      if (objektart) objektart.value = chip.getAttribute("data-value") || chip.textContent.trim();
    });
  });

  /* --- Wertermittlungs-Formular (Web3Forms + mailto-Fallback) --- */
  var valForm = document.getElementById("valForm");
  var valStatus = document.getElementById("valStatus");

  function setValStatus(msg, kind) {
    if (!valStatus) return;
    valStatus.textContent = msg;
    valStatus.className = "vstatus " + (kind || "");
  }
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  if (valForm) {
    valForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Pflichtfelder prüfen
      var pflicht = valForm.querySelectorAll("[required]");
      var valide = true;
      pflicht.forEach(function (feld) {
        var ok = feld.type === "checkbox" ? feld.checked : feld.value.trim() !== "";
        if (feld.type === "email" && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feld.value.trim());
        }
        feld.classList.toggle("field-invalid", !ok);
        if (!ok) valide = false;
      });
      if (!valide) {
        setValStatus("Bitte füllen Sie Name, eine gültige E-Mail und die Einwilligung (*) aus.", "err");
        return;
      }

      var action = valForm.getAttribute("action") || "";
      var keyEl = valForm.querySelector('input[name="access_key"]');
      var konfiguriert = /api\.web3forms\.com/.test(action) &&
        keyEl && keyEl.value.indexOf("DEIN-WEB3FORMS-KEY") === -1 && keyEl.value.length > 10;

      // Solange kein echter Web3Forms-Key hinterlegt ist: mailto-Fallback
      if (!konfiguriert) {
        var body =
          "Objektart: " + (objektart ? objektart.value : "") + "\n" +
          "Lage: " + val("vLage") + "\n" +
          "Fläche: " + val("vFlaeche") + " m²\n" +
          "Zimmer: " + val("vZimmer") + "\n\n" +
          "Name: " + val("vName") + "\n" +
          "E-Mail: " + val("vMail") + "\n" +
          "Telefon: " + val("vTel");
        window.location.href =
          "mailto:hallo@immoinsel.de?subject=" +
          encodeURIComponent("Wertermittlungs-Anfrage über die Website") +
          "&body=" + encodeURIComponent(body);
        setValStatus("Vielen Dank! Ihr E-Mail-Programm öffnet sich – bitte senden Sie die Nachricht dort ab.", "ok");
        valForm.reset();
        if (objektart) objektart.value = "Haus";
        return;
      }

      // Echter Versand an Web3Forms
      var btn = valForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      setValStatus("Wird gesendet …", "");

      fetch(action, {
        method: "POST",
        body: new FormData(valForm),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (r.ok) {
            setValStatus("Vielen Dank! Ihre Anfrage wurde gesendet – wir melden uns zeitnah.", "ok");
            valForm.reset();
            if (objektart) objektart.value = "Haus";
          } else {
            return r.json().then(function (d) {
              setValStatus((d && d.message) || "Es ist ein Fehler aufgetreten. Bitte rufen Sie uns an: 03341 445512.", "err");
            });
          }
        })
        .catch(function () {
          setValStatus("Keine Verbindung. Bitte versuchen Sie es später erneut oder rufen Sie uns an.", "err");
        })
        .then(function () { if (btn) btn.disabled = false; });
    });

    // Markierung beim Tippen entfernen
    valForm.addEventListener("input", function (e) {
      if (e.target.classList.contains("field-invalid")) {
        e.target.classList.remove("field-invalid");
      }
    });
  }

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
