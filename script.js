(() => {
  const body = document.body;
  const heroVideo = document.getElementById("heroVideo");
  const header = document.getElementById("siteHeader");
  const menu = document.getElementById("mobileMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const revealAt = 5.47;
  const sessionKey = "lux-intro-seen";

  function revealUI() {
    if (!body.classList.contains("ui-visible")) {
      body.classList.add("ui-visible");
      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch (_) {}
    }
  }

  if (body.classList.contains("home-page")) {
    let seen = false;

    try {
      seen = sessionStorage.getItem(sessionKey) === "true";
    } catch (_) {}

    if (seen) {
      body.classList.add("ui-visible");
    } else if (heroVideo) {
      const syncReveal = () => {
        if (heroVideo.currentTime >= revealAt) {
          revealUI();
          heroVideo.removeEventListener("timeupdate", syncReveal);
        }
      };

      heroVideo.addEventListener("timeupdate", syncReveal);

      heroVideo.addEventListener("loadedmetadata", () => {
        if (heroVideo.currentTime >= revealAt) revealUI();
      });

      // Safety fallback if the browser throttles video timeupdate.
      window.setTimeout(revealUI, 6200);
    } else {
      revealUI();
    }

    const updateHeader = () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 42);
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);

  if (menu) {
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll(".date-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".date-chip").forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });
})();
