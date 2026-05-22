/* ═══════════════════════════════════════════════════════════════
   main.js  –  ServiPro  |  JS Vanilla
   Projet JS / PHP  –  Gestion des Services & Dashboard CRM
   ═══════════════════════════════════════════════════════════════
   Structure :
     1. Utilitaires communs (toutes les pages)
     2. Page : Accueil       (data-page="index")
     3. Page : Login         (data-page="login")
     4. Page : Register      (data-page="register")
     5. Page : Profil        (data-page="profil")
     6. Page : Réservation   (data-page="reservation")
     7. Page : Dashboard CRM (data-page="dashboard")
     8. Initialisation automatique
   ═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────
   1.  UTILITAIRES COMMUNS
   ────────────────────────────────────────────────────────────── */

/**
 * Sélecteur raccourci
 * @param {string} sel - sélecteur CSS
 * @param {Element} ctx - contexte (document par défaut)
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Ajoute un écouteur d'événement de façon sécurisée (si l'élément existe)
 */
function on(element, event, handler) {
  if (element) element.addEventListener(event, handler);
}

/**
 * Navbar : ajoute la classe "scrolled" après 50px de scroll
 */
function initNavbar() {
  const nav = $("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/**
 * Compteur animé pour les chiffres clés (ex: "500+", "98%")
 * @param {Element} el  - élément cible
 * @param {number}  end - valeur finale
 * @param {number}  duration - durée ms
 */
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = end / (duration / 16);
  const suffix = el.dataset.suffix || "";
  const timer = setInterval(() => {
    start = Math.min(start + step, end);
    el.textContent = Math.floor(start) + suffix;
    if (start >= end) clearInterval(timer);
  }, 16);
}

/**
 * Déclenche les compteurs quand ils entrent dans le viewport
 */
function initCounters() {
  const counters = $$("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.counter), 1500);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

/**
 * Validation email (regex standard)
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Applique l'état erreur sur un champ
 */
function setFieldError(input, errorEl) {
  if (input) {
    input.classList.remove("success-input");
    input.classList.add("error");
  }
  if (errorEl) errorEl.classList.add("visible");
}

/**
 * Applique l'état succès sur un champ
 */
function setFieldSuccess(input, errorEl) {
  if (input) {
    input.classList.remove("error");
    input.classList.add("success-input");
  }
  if (errorEl) errorEl.classList.remove("visible");
}

/**
 * Réinitialise l'état d'un champ
 */
function resetField(input, errorEl) {
  if (input) input.classList.remove("error", "success-input");
  if (errorEl) errorEl.classList.remove("visible");
}

/**
 * Affiche / masque le spinner d'un bouton
 */
function setLoading(btn, state) {
  if (!btn) return;
  btn.disabled = state;
  btn.classList.toggle("loading", state);
}

/**
 * Affiche une alerte (error | success)
 */
function showAlert(alertEl, message = "") {
  if (!alertEl) return;
  if (message) {
    const msgEl = alertEl.querySelector("[data-msg]") || alertEl;
    msgEl.textContent = message;
  }
  alertEl.classList.add("show");
}

/**
 * Masque une alerte
 */
function hideAlert(alertEl) {
  if (alertEl) alertEl.classList.remove("show");
}

/* ──────────────────────────────────────────────────────────────
   2.  PAGE ACCUEIL  (data-page="index")
   ────────────────────────────────────────────────────────────── */

function initIndex() {
  initNavbar();
  initCounters();

  /* Mini sidebar du dashboard preview : navigation active */
  const miniNavItems = $$(".mini-nav-item");
  miniNavItems.forEach((item) => {
    on(item, "click", () => {
      miniNavItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  /* Smooth reveal des sections au scroll */
  const sections = $$("section");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  sections.forEach((s) => revealObserver.observe(s));
}

/* ──────────────────────────────────────────────────────────────
   3.  PAGE LOGIN  (data-page="login")
   ────────────────────────────────────────────────────────────── */

function initLogin() {
  const emailInput = $("#email");
  const passwordInput = $("#password");
  const togglePwBtn = $("#togglePw");
  const loginBtn = $("#loginBtn");
  const alertError = $("#alertError");
  const alertSuccess = $("#alertSuccess");
  const emailError = $("#emailError");
  const passwordError = $("#passwordError");

  /* ── Afficher / Masquer le mot de passe ── */
  on(togglePwBtn, "click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePwBtn.textContent = isHidden ? "🙈" : "👁";
  });

  /* ── Validation en temps réel ── */
  function validateEmail() {
    const val = emailInput ? emailInput.value : "";
    if (val === "") {
      resetField(emailInput, emailError);
      return false;
    }
    if (!isValidEmail(val)) {
      setFieldError(emailInput, emailError);
      return false;
    }
    setFieldSuccess(emailInput, emailError);
    return true;
  }

  function validatePassword() {
    const val = passwordInput ? passwordInput.value : "";
    if (val === "") {
      resetField(passwordInput, passwordError);
      return false;
    }
    if (val.length < 6) {
      setFieldError(passwordInput, passwordError);
      return false;
    }
    setFieldSuccess(passwordInput, passwordError);
    return true;
  }

  on(emailInput, "input", validateEmail);
  on(passwordInput, "input", validatePassword);

  /* ── Soumission ── */
  on(loginBtn, "click", () => {
    hideAlert(alertError);
    hideAlert(alertSuccess);

    const emailOk = validateEmail();
    const passwordOk = validatePassword();

    if (!emailOk || !passwordOk) {
      loginBtn.classList.add("shake");
      setTimeout(() => loginBtn.classList.remove("shake"), 400);
      return;
    }

    setLoading(loginBtn, true);

    const formData = new FormData();
    formData.append("email", emailInput.value.trim());
    formData.append("password", passwordInput.value);
    formData.append(
      "remember",
      $("#remember") ? $("#remember").checked : false,
    );

    fetch("api/login.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(loginBtn, false);
        if (data.success) {
          showAlert(alertSuccess);
          if (data.token) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
          }
          setTimeout(() => {
            window.location.href = data.redirect || "dashboard.html";
          }, 1500);
        } else {
          showAlert(
            alertError,
            data.message || "Email ou mot de passe incorrect.",
          );
          loginBtn.classList.add("shake");
          setTimeout(() => loginBtn.classList.remove("shake"), 400);
        }
      })
      .catch((err) => {
        setLoading(loginBtn, false);
        showAlert(alertError, "❌ Serveur indisponible. Réessayez plus tard.");
        console.error("Erreur login:", err);
      });
  });

  /* ── Touche Entrée ── */
  on(document, "keydown", (e) => {
    if (e.key === "Enter") loginBtn?.click();
  });
}

/* ──────────────────────────────────────────────────────────────
   4.  PAGE REGISTER  (data-page="register")
   ────────────────────────────────────────────────────────────── */

function initRegister() {
  const nomInput = $("#nom");
  const emailInput = $("#email");
  const passwordInput = $("#password");
  const confirmInput = $("#confirm");
  const togglePwBtn = $("#togglePw");
  const registerBtn = $("#registerBtn");
  const alertError = $("#alertError");
  const alertSuccess = $("#alertSuccess");

  const prenomInput = $("#prenom");
  const cguCheckbox = $("#cgu");

  /* ── Toggle mot de passe ── */
  on(togglePwBtn, "click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePwBtn.textContent = isHidden ? "🙈" : "👁";
  });

  /* ── Indicateur de force du mot de passe ── */
  function updatePasswordStrength(val) {
    const bar1 = $("#bar1");
    const bar2 = $("#bar2");
    const bar3 = $("#bar3");
    const label = $("#pwLabel");
    if (!bar1) return;

    [bar1, bar2, bar3].forEach((b) => (b.className = "pw-bar"));

    if (val.length === 0) {
      if (label) label.textContent = "";
      return;
    }

    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const score =
      (val.length >= 8 ? 1 : 0) +
      (hasUpper ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0);

    if (score <= 1) {
      bar1.classList.add("weak");
      if (label) {
        label.textContent = "Faible";
        label.style.color = "var(--error)";
      }
    } else if (score <= 2) {
      bar1.classList.add("medium");
      bar2.classList.add("medium");
      if (label) {
        label.textContent = "Moyen";
        label.style.color = "#fbbf24";
      }
    } else {
      bar1.classList.add("strong");
      bar2.classList.add("strong");
      bar3.classList.add("strong");
      if (label) {
        label.textContent = "Fort";
        label.style.color = "var(--success)";
      }
    }
  }

  /* ── Validations ── */
  function validatePrenom() {
    const val = prenomInput ? prenomInput.value.trim() : "";
    const err = $("#prenomError");
    if (val.length < 2) {
      setFieldError(prenomInput, err);
      return false;
    }
    setFieldSuccess(prenomInput, err);
    return true;
  }

  function validateNom() {
    const val = nomInput ? nomInput.value.trim() : "";
    const err = $("#nomError");
    if (val.length < 2) {
      setFieldError(nomInput, err);
      return false;
    }
    setFieldSuccess(nomInput, err);
    return true;
  }

  function validateEmail() {
    const val = emailInput ? emailInput.value : "";
    const err = $("#emailError");
    if (!isValidEmail(val)) {
      setFieldError(emailInput, err);
      return false;
    }
    setFieldSuccess(emailInput, err);
    return true;
  }

  function validatePassword() {
    const val = passwordInput ? passwordInput.value : "";
    const err = $("#passwordError");
    updatePasswordStrength(val);
    if (val.length < 6) {
      setFieldError(passwordInput, err);
      return false;
    }
    setFieldSuccess(passwordInput, err);
    return true;
  }

  function validateConfirm() {
    const val = confirmInput ? confirmInput.value : "";
    const err = $("#confirmError");
    if (val !== passwordInput?.value) {
      setFieldError(confirmInput, err);
      return false;
    }
    setFieldSuccess(confirmInput, err);
    return true;
  }

  on(prenomInput, "input", validatePrenom);
  on(nomInput, "input", validateNom);
  on(emailInput, "input", validateEmail);
  on(passwordInput, "input", validatePassword);
  on(confirmInput, "input", validateConfirm);

  /* ── Soumission ── */
  on(registerBtn, "click", () => {
    hideAlert(alertError);
    hideAlert(alertSuccess);

    /* Vérification CGU */
    if (!cguCheckbox?.checked) {
      showAlert(
        alertError,
        "⚠️ Vous devez accepter les conditions d'utilisation.",
      );
      registerBtn.classList.add("shake");
      setTimeout(() => registerBtn.classList.remove("shake"), 400);
      return;
    }

    const ok = [
      validatePrenom(),
      validateNom(),
      validateEmail(),
      validatePassword(),
      validateConfirm(),
    ];
    if (ok.includes(false)) {
      registerBtn.classList.add("shake");
      setTimeout(() => registerBtn.classList.remove("shake"), 400);
      return;
    }

    setLoading(registerBtn, true);

    const formData = new FormData();
    formData.append("prenom", prenomInput.value.trim());
    formData.append("nom", nomInput.value.trim());
    formData.append("email", emailInput.value.trim());
    formData.append("password", passwordInput.value);
    formData.append("telephone", $("#telephone")?.value.trim() || "");

    fetch("api/register.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(registerBtn, false);
        if (data.success) {
          showAlert(alertSuccess);
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1800);
        } else {
          showAlert(
            alertError,
            data.message || "Erreur lors de l'inscription.",
          );
        }
      })
      .catch((err) => {
        setLoading(registerBtn, false);
        showAlert(alertError, "❌ Serveur indisponible.");
        console.error("Erreur register:", err);
      });
  });

  on(document, "keydown", (e) => {
    if (e.key === "Enter") registerBtn?.click();
  });
}

/* ──────────────────────────────────────────────────────────────
   5.  PAGE PROFIL  (data-page="profil")
   ────────────────────────────────────────────────────────────── */

function initProfil() {
  const alertError = $("#alertError");
  const alertSuccess = $("#alertSuccess");

  /* ── Chargement des infos utilisateur ── */
  function loadUserData() {
    fetch("api/get_profil.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) return;
        const u = data.user;

        /* Stocker en session */
        sessionStorage.setItem("user", JSON.stringify(u));

        /* Remplir les champs */
        if ($("#prenom")) $("#prenom").value = u.prenom || "";
        if ($("#nom")) $("#nom").value = u.nom || "";
        if ($("#email")) $("#email").value = u.email || "";
        if ($("#telephone")) $("#telephone").value = u.telephone || "";

        /* Affichage carte avatar */
        const nomComplet =
          `${u.prenom || ""} ${u.nom || ""}`.trim() || "Utilisateur";
        const initiales = nomComplet
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        if ($("#profilNomComplet"))
          $("#profilNomComplet").textContent = nomComplet;
        if ($("#profilEmail")) $("#profilEmail").textContent = u.email || "—";
        if ($("#avatarBig")) $("#avatarBig").textContent = initiales;
        if ($("#sidebarName")) $("#sidebarName").textContent = nomComplet;
        if ($("#sidebarAvatar")) $("#sidebarAvatar").textContent = initiales;

        /* Avatar image si existante */
        if (u.avatar) {
          const img = document.createElement("img");
          img.src = `uploads/${u.avatar}`;
          if ($("#avatarBig")) $("#avatarBig").innerHTML = "";
          if ($("#avatarBig")) $("#avatarBig").appendChild(img.cloneNode());
          if ($("#sidebarAvatar")) $("#sidebarAvatar").innerHTML = "";
          if ($("#sidebarAvatar")) $("#sidebarAvatar").appendChild(img);
        }

        /* Stats */
        if ($("#statTotalRes"))
          $("#statTotalRes").textContent = u.total_reservations || 0;
        if ($("#statConfirmes"))
          $("#statConfirmes").textContent = u.total_confirmes || 0;
        if ($("#statTermines"))
          $("#statTermines").textContent = u.total_termines || 0;

        /* Dernières réservations */
        loadDernieresReservations(u.reservations || []);
      })
      .catch((err) => console.error("Erreur chargement profil:", err));
  }

  /* ── Dernières réservations ── */
  function loadDernieresReservations(reservations) {
    const container = $("#dernieresReservations");
    if (!container) return;
    container.innerHTML = "";

    if (!reservations.length) {
      container.innerHTML =
        '<div class="empty-msg">Aucune réservation pour le moment.</div>';
      return;
    }

    reservations.slice(0, 4).forEach((r) => {
      const item = document.createElement("div");
      item.className = "res-item";
      item.innerHTML = `
        <div class="res-dot ${r.statut}"></div>
        <div class="res-info">
          <div class="res-service">${r.service_nom}</div>
          <div class="res-date">📅 ${r.date} à ${r.heure}</div>
        </div>
        <span class="res-badge ${r.statut}">${r.statut.replace("_", " ")}</span>
      `;
      container.appendChild(item);
    });
  }

  /* ── Sauvegarde infos personnelles ── */
  const saveBtn = $("#saveProfilBtn");

  function validatePrenomProfil() {
    const v = $("#prenom")?.value.trim();
    const e = $("#prenomError");
    if (!v || v.length < 2) {
      setFieldError($("#prenom"), e);
      return false;
    }
    setFieldSuccess($("#prenom"), e);
    return true;
  }
  function validateNomProfil() {
    const v = $("#nom")?.value.trim();
    const e = $("#nomError");
    if (!v || v.length < 2) {
      setFieldError($("#nom"), e);
      return false;
    }
    setFieldSuccess($("#nom"), e);
    return true;
  }
  function validateEmailProfil() {
    const v = $("#email")?.value;
    const e = $("#emailError");
    if (!isValidEmail(v)) {
      setFieldError($("#email"), e);
      return false;
    }
    setFieldSuccess($("#email"), e);
    return true;
  }

  on($("#prenom"), "input", validatePrenomProfil);
  on($("#nom"), "input", validateNomProfil);
  on($("#email"), "input", validateEmailProfil);

  on(saveBtn, "click", () => {
    hideAlert(alertError);
    hideAlert(alertSuccess);

    if (
      ![
        validatePrenomProfil(),
        validateNomProfil(),
        validateEmailProfil(),
      ].every(Boolean)
    )
      return;

    setLoading(saveBtn, true);

    const formData = new FormData();
    formData.append("prenom", $("#prenom").value.trim());
    formData.append("nom", $("#nom").value.trim());
    formData.append("email", $("#email").value.trim());
    formData.append("telephone", $("#telephone")?.value.trim() || "");

    fetch("api/update_profil.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(saveBtn, false);
        if (data.success) {
          showAlert(alertSuccess, "Profil mis à jour avec succès !");
          loadUserData(); /* Rafraîchir l'affichage */
        } else {
          showAlert(
            alertError,
            data.message || "Erreur lors de la mise à jour.",
          );
        }
      })
      .catch((err) => {
        setLoading(saveBtn, false);
        showAlert(alertError, "❌ Serveur indisponible.");
        console.error("Erreur profil:", err);
      });
  });

  /* ── Avatar : bouton + prévisualisation ── */
  const changeAvatarBtn = $("#changeAvatarBtn");
  const avatarInput = $("#avatarInput");

  on(changeAvatarBtn, "click", () => avatarInput?.click());

  on(avatarInput, "change", () => {
    const file = avatarInput.files[0];
    if (!file) return;

    /* Prévisualisation immédiate */
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      if ($("#avatarBig")) {
        $("#avatarBig").innerHTML =
          `<img src="${src}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      }
      if ($("#sidebarAvatar")) {
        $("#sidebarAvatar").innerHTML =
          `<img src="${src}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      }
    };
    reader.readAsDataURL(file);

    /* Upload vers le serveur */
    const formData = new FormData();
    formData.append("avatar", file);

    fetch("api/upload_avatar.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert(alertSuccess, "🖼️ Photo de profil mise à jour !");
        } else {
          showAlert(alertError, data.message || "Erreur lors de l'upload.");
        }
      })
      .catch((err) => console.error("Erreur upload avatar:", err));
  });

  /* ── Changement de mot de passe ── */
  const changePasswordBtn = $("#changePasswordBtn");

  /* Toggles show/hide */
  on($("#toggleOld"), "click", () => {
    const inp = $("#oldPassword");
    if (inp) {
      inp.type = inp.type === "password" ? "text" : "password";
    }
    if ($("#toggleOld"))
      $("#toggleOld").textContent =
        $("#oldPassword")?.type === "text" ? "🙈" : "👁";
  });
  on($("#toggleNew"), "click", () => {
    const inp = $("#newPassword");
    if (inp) {
      inp.type = inp.type === "password" ? "text" : "password";
    }
    if ($("#toggleNew"))
      $("#toggleNew").textContent =
        $("#newPassword")?.type === "text" ? "🙈" : "👁";
  });

  on(changePasswordBtn, "click", () => {
    hideAlert(alertError);
    hideAlert(alertSuccess);

    const oldPw = $("#oldPassword")?.value;
    const newPw = $("#newPassword")?.value;
    const confPw = $("#confirmPassword")?.value;

    let valid = true;
    if (!oldPw) {
      setFieldError($("#oldPassword"), $("#oldPasswordError"));
      valid = false;
    } else setFieldSuccess($("#oldPassword"), $("#oldPasswordError"));

    if (!newPw || newPw.length < 6) {
      setFieldError($("#newPassword"), $("#newPasswordError"));
      valid = false;
    } else setFieldSuccess($("#newPassword"), $("#newPasswordError"));

    if (newPw !== confPw) {
      setFieldError($("#confirmPassword"), $("#confirmPasswordError"));
      valid = false;
    } else if (confPw)
      setFieldSuccess($("#confirmPassword"), $("#confirmPasswordError"));

    if (!valid) return;

    setLoading(changePasswordBtn, true);

    const formData = new FormData();
    formData.append("old_password", oldPw);
    formData.append("new_password", newPw);

    fetch("api/change_password.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(changePasswordBtn, false);
        if (data.success) {
          showAlert(alertSuccess, "🔐 Mot de passe modifié avec succès !");
          $("#oldPassword").value = "";
          $("#newPassword").value = "";
          $("#confirmPassword").value = "";
          [$("#oldPassword"), $("#newPassword"), $("#confirmPassword")].forEach(
            (i) => resetField(i, null),
          );
        } else {
          showAlert(
            alertError,
            data.message || "Mot de passe actuel incorrect.",
          );
        }
      })
      .catch((err) => {
        setLoading(changePasswordBtn, false);
        showAlert(alertError, "❌ Serveur indisponible.");
        console.error("Erreur changement MDP:", err);
      });
  });

  /* ── Suppression compte ── */
  const deleteAccountBtn = $("#deleteAccountBtn");
  on(deleteAccountBtn, "click", () => {
    const confirmation = prompt(
      'Tapez "SUPPRIMER" pour confirmer la suppression définitive de votre compte :',
    );
    if (confirmation !== "SUPPRIMER") return;

    fetch("api/delete_account.php", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          sessionStorage.clear();
          window.location.href = "index.html";
        } else {
          showAlert(
            alertError,
            data.message || "Erreur lors de la suppression.",
          );
        }
      })
      .catch((err) => console.error("Erreur suppression:", err));
  });

  /* ── Déconnexion ── */
  const logoutBtn = $("#logoutBtn");
  on(logoutBtn, "click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  /* ── Init ── */
  loadUserData();
}

/* ──────────────────────────────────────────────────────────────
   6.  PAGE RÉSERVATION  (data-page="reservation")
   ────────────────────────────────────────────────────────────── */

function initReservation() {
  /* ── Chargement des services disponibles ── */
  function loadServices() {
    const serviceSelect = $("#serviceSelect");
    if (!serviceSelect) return;

    fetch("api/get_services.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) {
          data.services.forEach((service) => {
            const option = document.createElement("option");
            option.value = service.id;
            option.textContent = `${service.nom} — ${service.prix} TND`;
            serviceSelect.appendChild(option);
          });
        }
      })
      .catch((err) => console.error("Erreur chargement services:", err));
  }

  loadServices();

  /* ── Validation de la date (pas dans le passé) ── */
  const dateInput = $("#dateReservation");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  /* ── Soumission de la réservation ── */
  const reserverBtn = $("#reserverBtn");
  const alertError = $("#alertError");
  const alertSuccess = $("#alertSuccess");

  on(reserverBtn, "click", () => {
    hideAlert(alertError);
    hideAlert(alertSuccess);

    const serviceId = $("#serviceSelect")?.value;
    const date = $("#dateReservation")?.value;
    const heure = $("#heureReservation")?.value;
    const note = $("#noteReservation")?.value;

    if (!serviceId || !date || !heure) {
      showAlert(alertError, "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(reserverBtn, true);

    const formData = new FormData();
    formData.append("service_id", serviceId);
    formData.append("date", date);
    formData.append("heure", heure);
    formData.append("note", note || "");

    fetch("api/reserver.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(reserverBtn, false);
        if (data.success) {
          showAlert(
            alertSuccess,
            "✅ Réservation confirmée ! Un email de confirmation vous a été envoyé.",
          );
          /* Réinitialiser le formulaire */
          if ($("#reservationForm")) $("#reservationForm").reset();
        } else {
          showAlert(
            alertError,
            data.message || "Erreur lors de la réservation.",
          );
        }
      })
      .catch((err) => {
        setLoading(reserverBtn, false);
        showAlert(alertError, "❌ Serveur indisponible.");
        console.error("Erreur réservation:", err);
      });
  });

  /* ── Afficher les réservations de l'utilisateur ── */
  function loadMesReservations() {
    const container = $("#mesReservations");
    if (!container) return;

    fetch("api/get_reservations.php")
      .then((res) => res.json())
      .then((data) => {
        container.innerHTML = "";
        if (!data.reservations?.length) {
          container.innerHTML =
            '<p class="empty-msg">Aucune réservation pour le moment.</p>';
          return;
        }
        data.reservations.forEach((r) => {
          const card = document.createElement("div");
          card.className = "reservation-card";
          card.innerHTML = `
            <div class="res-header">
              <span class="res-service">${r.service_nom}</span>
              <span class="res-status status-${r.statut}">${r.statut}</span>
            </div>
            <div class="res-details">
              <span>📅 ${r.date}</span>
              <span>🕐 ${r.heure}</span>
            </div>
            ${r.statut === "en_attente" ? `<button class="btn-annuler" data-id="${r.id}">Annuler</button>` : ""}
          `;
          container.appendChild(card);
        });

        /* Boutons annuler */
        $$(".btn-annuler").forEach((btn) => {
          on(btn, "click", () => annulerReservation(btn.dataset.id));
        });
      })
      .catch((err) => console.error("Erreur chargement réservations:", err));
  }

  function annulerReservation(id) {
    if (!confirm("Confirmer l'annulation ?")) return;
    const formData = new FormData();
    formData.append("id", id);
    fetch("api/annuler_reservation.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) loadMesReservations();
      })
      .catch((err) => console.error("Erreur annulation:", err));
  }

  loadMesReservations();
}

/* ──────────────────────────────────────────────────────────────
   7.  PAGE DASHBOARD CRM  (data-page="dashboard")
   ────────────────────────────────────────────────────────────── */

function initDashboard() {
  /* ── Navigation sidebar ── */
  const navItems = $$(".sidebar-nav-item");
  const sections = $$(".dash-section");

  function showSection(target) {
    sections.forEach((s) =>
      s.classList.toggle("active", s.dataset.section === target),
    );
    navItems.forEach((n) =>
      n.classList.toggle("active", n.dataset.target === target),
    );
  }

  navItems.forEach((item) => {
    on(item, "click", () => showSection(item.dataset.target));
  });

  /* ── Chargement des stats ── */
  function loadStats() {
    fetch("api/get_stats.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        const map = {
          "#statServices": data.services,
          "#statReservations": data.reservations,
          "#statClients": data.clients,
          "#statRevenu": data.revenu + " TND",
        };
        Object.entries(map).forEach(([sel, val]) => {
          const el = $(sel);
          if (el) el.textContent = val;
        });
      })
      .catch((err) => console.error("Erreur stats:", err));
  }

  /* ── Gestion des services (CRUD) ── */
  function loadServices() {
    const tbody = $("#servicesTable");
    if (!tbody) return;

    fetch("api/get_services.php")
      .then((res) => res.json())
      .then((data) => {
        tbody.innerHTML = "";
        (data.services || []).forEach((s) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${s.id}</td>
            <td>
              ${s.image ? `<img src="uploads/${s.image}" class="service-thumb" alt="${s.nom}">` : ""}
              ${s.nom}
            </td>
            <td>${s.categorie || "—"}</td>
            <td>${s.prix} TND</td>
            <td><span class="badge-status status-${s.statut}">${s.statut}</span></td>
            <td>
              <button class="btn-edit"   data-id="${s.id}">✏️ Modifier</button>
              <button class="btn-delete" data-id="${s.id}">🗑️ Supprimer</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        /* Actions */
        $$(".btn-edit").forEach((btn) => {
          on(btn, "click", () => openEditService(btn.dataset.id));
        });
        $$(".btn-delete").forEach((btn) => {
          on(btn, "click", () => deleteService(btn.dataset.id));
        });
      })
      .catch((err) => console.error("Erreur services:", err));
  }

  /* ── Modal Ajout / Modification service ── */
  const modal = $("#serviceModal");
  const closeModal = $("#closeModal");
  const serviceForm = $("#serviceForm");
  const addServiceBtn = $("#addServiceBtn");

  on(addServiceBtn, "click", () => {
    if (serviceForm) serviceForm.reset();
    if ($("#serviceId")) $("#serviceId").value = "";
    if ($("#modalTitle")) $("#modalTitle").textContent = "Ajouter un service";
    modal?.classList.add("open");
  });

  on(closeModal, "click", () => modal?.classList.remove("open"));

  on(modal, "click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  function openEditService(id) {
    fetch(`api/get_service.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.service) return;
        const s = data.service;
        if ($("#serviceId")) $("#serviceId").value = s.id;
        if ($("#serviceNom")) $("#serviceNom").value = s.nom;
        if ($("#serviceCategorie"))
          $("#serviceCategorie").value = s.categorie || "";
        if ($("#servicePrix")) $("#servicePrix").value = s.prix;
        if ($("#serviceDescription"))
          $("#serviceDescription").value = s.description || "";
        if ($("#modalTitle"))
          $("#modalTitle").textContent = "Modifier le service";
        modal?.classList.add("open");
      })
      .catch((err) => console.error("Erreur chargement service:", err));
  }

  /* ── Sauvegarde service (ajout ou modif) ── */
  const saveServiceBtn = $("#saveServiceBtn");
  on(saveServiceBtn, "click", () => {
    const nomInput = $("#serviceNom");
    const prixInput = $("#servicePrix");

    if (!nomInput?.value.trim() || !prixInput?.value) {
      alert("Nom et prix sont obligatoires.");
      return;
    }

    setLoading(saveServiceBtn, true);

    const formData = new FormData();
    formData.append("id", $("#serviceId")?.value || "");
    formData.append("nom", nomInput.value.trim());
    formData.append("categorie", $("#serviceCategorie")?.value || "");
    formData.append("prix", prixInput.value);
    formData.append("description", $("#serviceDescription")?.value || "");

    /* Upload image */
    const imgInput = $("#serviceImage");
    if (imgInput?.files[0]) formData.append("image", imgInput.files[0]);

    const endpoint = $("#serviceId")?.value
      ? "api/update_service.php"
      : "api/add_service.php";

    fetch(endpoint, { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        setLoading(saveServiceBtn, false);
        if (data.success) {
          modal?.classList.remove("open");
          loadServices();
          loadStats();
        } else {
          alert(data.message || "Erreur lors de la sauvegarde.");
        }
      })
      .catch((err) => {
        setLoading(saveServiceBtn, false);
        console.error("Erreur save service:", err);
      });
  });

  /* ── Suppression service ── */
  function deleteService(id) {
    if (!confirm("Supprimer ce service définitivement ?")) return;
    const formData = new FormData();
    formData.append("id", id);
    fetch("api/delete_service.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          loadServices();
          loadStats();
        }
      })
      .catch((err) => console.error("Erreur suppression:", err));
  }

  /* ── Gestion des réservations ── */
  function loadReservations() {
    const tbody = $("#reservationsTable");
    if (!tbody) return;

    fetch("api/get_all_reservations.php")
      .then((res) => res.json())
      .then((data) => {
        tbody.innerHTML = "";
        (data.reservations || []).forEach((r) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.client_nom}</td>
            <td>${r.service_nom}</td>
            <td>${r.date} à ${r.heure}</td>
            <td>
              <select class="statut-select" data-id="${r.id}">
                <option value="en_attente" ${r.statut === "en_attente" ? "selected" : ""}>En attente</option>
                <option value="confirme"   ${r.statut === "confirme" ? "selected" : ""}>Confirmé</option>
                <option value="termine"    ${r.statut === "termine" ? "selected" : ""}>Terminé</option>
                <option value="annule"     ${r.statut === "annule" ? "selected" : ""}>Annulé</option>
              </select>
            </td>
          `;
          tbody.appendChild(tr);
        });

        /* Changement de statut */
        $$(".statut-select").forEach((sel) => {
          on(sel, "change", () =>
            updateStatutReservation(sel.dataset.id, sel.value),
          );
        });
      })
      .catch((err) => console.error("Erreur réservations:", err));
  }

  function updateStatutReservation(id, statut) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("statut", statut);
    fetch("api/update_statut_reservation.php", {
      method: "POST",
      body: formData,
    }).catch((err) => console.error("Erreur update statut:", err));
  }

  /* ── Gestion des clients ── */
  function loadClients() {
    const tbody = $("#clientsTable");
    if (!tbody) return;

    fetch("api/get_clients.php")
      .then((res) => res.json())
      .then((data) => {
        tbody.innerHTML = "";
        (data.clients || []).forEach((c) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.nom}</td>
            <td>${c.email}</td>
            <td>${c.nb_reservations || 0}</td>
            <td>${c.date_inscription}</td>
            <td><span class="badge-status status-${c.statut}">${c.statut}</span></td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => console.error("Erreur clients:", err));
  }

  /* ── Recherche / filtres ── */
  const searchInput = $("#searchInput");
  on(searchInput, "input", () => {
    const query = searchInput.value.toLowerCase();
    $$("tbody tr").forEach((tr) => {
      tr.style.display = tr.textContent.toLowerCase().includes(query)
        ? ""
        : "none";
    });
  });

  /* ── Déconnexion ── */
  const logoutBtn = $("#logoutBtn");
  on(logoutBtn, "click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  /* ── Initialisation ── */
  loadStats();
  loadServices();
  loadReservations();
  loadClients();
  showSection("dashboard"); /* section par défaut */
}

/* ──────────────────────────────────────────────────────────────
   8.  INITIALISATION AUTOMATIQUE
       Lit l'attribut data-page du <body> et lance la bonne fonction
   ────────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  const pages = {
    index: initIndex,
    login: initLogin,
    register: initRegister,
    profil: initProfil,
    reservation: initReservation,
    dashboard: initDashboard,
  };

  if (pages[page]) {
    pages[page]();
  } else {
    /* Initialise juste la navbar sur les pages non listées */
    initNavbar();
  }
});
