(() => {
  const body = document.body;
  const heroVideo = document.getElementById("heroVideo");
  const header = document.getElementById("siteHeader");
  const hero = document.querySelector(".hero");
  const bookingCta = document.getElementById("bookingCta");
  const footer = document.getElementById("footer");
  const menu = document.getElementById("mobileMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const menuBackground = [...body.children].filter(
    (element) => element !== menu && element.tagName !== "SCRIPT"
  );
  const revealAt = 5.47;
  const sessionKey = "lux-intro-seen";
  let returnFocus = null;

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

    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealUI();
    } else if (heroVideo) {
      const syncReveal = () => {
        if (heroVideo.currentTime >= revealAt) {
          revealUI();
          heroVideo.removeEventListener("timeupdate", syncReveal);
        }
      };

      heroVideo.addEventListener("timeupdate", syncReveal);
      heroVideo.addEventListener("loadedmetadata", syncReveal);
      heroVideo.addEventListener("error", revealUI, { once: true });
      window.setTimeout(revealUI, 6200);
    } else {
      revealUI();
    }

    const updateHeader = () => {
      if (!header) return;
      const switchPoint = hero ? Math.max(0, hero.offsetHeight - header.offsetHeight) : window.innerHeight * 0.6;
      header.classList.toggle("is-scrolled", window.scrollY > switchPoint);
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    if (bookingCta && footer && "IntersectionObserver" in window) {
      const footerObserver = new IntersectionObserver(
        ([entry]) => bookingCta.classList.toggle("is-hidden", entry.isIntersecting),
        { threshold: 0.08 }
      );
      footerObserver.observe(footer);
    }
  }

  function openMenu() {
    if (!menu) return;
    returnFocus = document.activeElement;
    menu.inert = false;
    menu.setAttribute("aria-hidden", "false");
    menuBackground.forEach((element) => { element.inert = true; });
    body.classList.add("menu-open");
    menuToggle?.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      menu.classList.add("is-open");
      menuClose?.focus();
    });
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menu.inert = true;
    menuBackground.forEach((element) => { element.inert = false; });
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (restoreFocus && returnFocus instanceof HTMLElement) returnFocus.focus();
  }

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", () => closeMenu());

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu({ restoreFocus: false }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const revealItems = document.querySelectorAll(".reveal-on-scroll");

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const dateChips = [...document.querySelectorAll(".date-chip")];
  const classCards = [...document.querySelectorAll("[data-class-card]")];
  const scheduleHeading = document.querySelector(".schedule-heading");
  const bookingSheet = document.getElementById("bookingSheet");
  const bookingPanel = bookingSheet?.querySelector(".booking-sheet__panel");
  const bookingClose = bookingSheet?.querySelector(".booking-sheet__close");
  const bookingBackdrop = bookingSheet?.querySelector(".booking-sheet__backdrop");
  const bookingSelection = bookingSheet?.querySelector("[data-booking-selection]");
  const bookingConfirmation = bookingSheet?.querySelector("[data-booking-confirmation]");
  const bookingReserve = bookingSheet?.querySelector("[data-booking-reserve]");
  const bookingDone = bookingSheet?.querySelector("[data-booking-done]");
  const bookingHeader = document.querySelector(".booking-header");
  const bookingMain = document.querySelector(".booking-main");
  let selectedClass = null;

  const demoClasses = [
    [
      ["7:00", "AM", "REFORMER", "Morning Flow", "50 min", "All levels", "6 spots available", "reserve"],
      ["12:00", "PM", "REFORMER", "Core & Control", "50 min", "Intermediate", "3 spots available", "reserve"],
      ["6:30", "PM", "REFORMER", "After Hours", "50 min", "All levels", "Waitlist", "waitlist"]
    ],
    [
      ["8:00", "AM", "REFORMER", "Essential Flow", "50 min", "All levels", "4 spots available", "reserve"],
      ["12:30", "PM", "SCULPT", "LUX Sculpt", "45 min", "All levels", "2 spots available", "reserve"],
      ["5:30", "PM", "REFORMER", "Evening Reset", "50 min", "All levels", "5 spots available", "reserve"]
    ],
    [
      ["7:30", "AM", "REFORMER", "Morning Flow", "50 min", "All levels", "3 spots available", "reserve"],
      ["11:00", "AM", "REFORMER", "Core & Control", "50 min", "Intermediate", "Waitlist", "waitlist"],
      ["6:00", "PM", "SCULPT", "Friday Sculpt", "45 min", "All levels", "4 spots available", "reserve"]
    ],
    [
      ["9:00", "AM", "REFORMER", "Weekend Flow", "50 min", "All levels", "2 spots available", "reserve"],
      ["10:30", "AM", "REFORMER", "Core & Control", "50 min", "Intermediate", "4 spots available", "reserve"],
      ["12:00", "PM", "PRIVATE", "Private Session", "50 min", "Personalized", "1 spot available", "reserve"]
    ],
    [
      ["9:30", "AM", "REFORMER", "Sunday Reset", "50 min", "All levels", "5 spots available", "reserve"],
      ["11:00", "AM", "SCULPT", "LUX Sculpt", "45 min", "All levels", "3 spots available", "reserve"],
      ["4:30", "PM", "REFORMER", "Slow Flow", "50 min", "All levels", "Waitlist", "waitlist"]
    ]
  ];

  function classFromArray(values) {
    const [time, period, type, name, duration, level, availability, status] = values;
    return { time, period, type, name, duration, level, availability, status };
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function renderSchedule(dayIndex) {
    const chip = dateChips[dayIndex];
    if (!chip) return;

    dateChips.forEach((item, index) => {
      const active = index === dayIndex;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    chip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    const date = new Date(`${chip.dataset.date}T12:00:00`);
    const classes = demoClasses[dayIndex].map(classFromArray);

    if (scheduleHeading) {
      scheduleHeading.firstElementChild.textContent = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric"
      }).format(date).toUpperCase();
      scheduleHeading.lastElementChild.textContent = `${classes.length} CLASSES`;
    }

    classCards.forEach((card, index) => {
      const classInfo = classes[index];
      card.querySelector(".class-card__time strong").textContent = classInfo.time;
      card.querySelector(".class-card__time span").textContent = classInfo.period;
      card.querySelector(".class-card__type").textContent = classInfo.type;
      card.querySelector("h2").textContent = classInfo.name;
      const details = card.querySelectorAll(".class-card__body > p:not(.class-card__type)");
      details[0].textContent = `${classInfo.duration} · ${classInfo.level}`;
      details[1].textContent = classInfo.availability;
      card.classList.toggle("class-card--waitlist", classInfo.status === "waitlist");
      card.dataset.classInfo = JSON.stringify({ ...classInfo, date: formatLongDate(date) });
      const action = card.querySelector(".class-card__action");
      action.setAttribute(
        "aria-label",
        classInfo.status === "waitlist" ? `Join ${classInfo.name} waitlist` : `Reserve ${classInfo.name}`
      );
    });
  }

  function closeBookingSheet() {
    if (!bookingSheet || bookingSheet.hidden) return;
    bookingSheet.classList.remove("is-open");
    bookingSheet.setAttribute("aria-hidden", "true");
    body.classList.remove("booking-open");
    window.setTimeout(() => {
      bookingSheet.hidden = true;
      bookingSelection.hidden = false;
      bookingConfirmation.hidden = true;
      if (bookingHeader) bookingHeader.inert = false;
      if (bookingMain) bookingMain.inert = false;
      returnFocus?.focus();
    }, 320);
  }

  function openBookingSheet(card) {
    if (!bookingSheet || !bookingPanel) return;
    selectedClass = JSON.parse(card.dataset.classInfo);
    returnFocus = document.activeElement;
    bookingSheet.querySelector("[data-booking-date]").textContent = selectedClass.date;
    bookingSheet.querySelector("[data-booking-title]").textContent = selectedClass.name;
    bookingSheet.querySelector("[data-booking-meta]").textContent =
      `${selectedClass.time} ${selectedClass.period} · ${selectedClass.duration} · ${selectedClass.level}`;
    bookingSheet.querySelector("[data-booking-availability]").textContent = selectedClass.availability;
    bookingReserve.firstChild.textContent = selectedClass.status === "waitlist" ? "JOIN WAITLIST " : "RESERVE SPOT ";
    bookingSelection.hidden = false;
    bookingConfirmation.hidden = true;
    bookingSheet.hidden = false;
    bookingSheet.setAttribute("aria-hidden", "false");
    if (bookingHeader) bookingHeader.inert = true;
    if (bookingMain) bookingMain.inert = true;
    body.classList.add("booking-open");
    requestAnimationFrame(() => {
      bookingSheet.classList.add("is-open");
      bookingClose.focus();
    });
  }

  if (dateChips.length && classCards.length) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    dateChips.forEach((chip, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      chip.dataset.date = `${year}-${month}-${day}`;
      chip.querySelector("span").textContent = new Intl.DateTimeFormat("en-US", { weekday: "short" })
        .format(date)
        .toUpperCase();
      chip.querySelector("strong").textContent = date.getDate();
      chip.setAttribute("aria-label", formatLongDate(date));
      chip.addEventListener("click", () => renderSchedule(index));
    });

    classCards.forEach((card) => {
      card.querySelector(".class-card__action").addEventListener("click", () => openBookingSheet(card));
    });

    renderSchedule(0);
  }

  bookingClose?.addEventListener("click", closeBookingSheet);
  bookingBackdrop?.addEventListener("click", closeBookingSheet);
  bookingDone?.addEventListener("click", closeBookingSheet);
  bookingReserve?.addEventListener("click", () => {
    if (!selectedClass) return;
    bookingSelection.hidden = true;
    bookingConfirmation.hidden = false;
    bookingSheet.querySelector("[data-confirmation-title]").textContent =
      selectedClass.status === "waitlist" ? "You’re on the waitlist." : "Your spot is reserved.";
    bookingSheet.querySelector("[data-confirmation-copy]").textContent =
      `${selectedClass.name} · ${selectedClass.date} · ${selectedClass.time} ${selectedClass.period}`;
    bookingDone.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (!bookingSheet || bookingSheet.hidden) return;
    if (event.key === "Escape") {
      closeBookingSheet();
      return;
    }

    if (event.key === "Tab") {
      const focusable = [...bookingPanel.querySelectorAll("button:not([hidden])")]
        .filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
