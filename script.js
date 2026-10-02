const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    });
  });
}

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const slideDots = Array.from(document.querySelectorAll(".slide-dot"));
const slideCount = document.querySelector(".current-slide");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let slideTimer;

document.querySelectorAll(".footer-bottom span:first-child").forEach((copyright) => {
  copyright.textContent = `© ${new Date().getFullYear()} FAIR FARM RESORT`;
});

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  });
  slideDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
  slideCount.textContent = String(activeSlide + 1).padStart(2, "0");
}

function restartSlideTimer() {
  window.clearInterval(slideTimer);
  if (slides.length && !reducedMotion.matches && !document.hidden) {
    slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  }
}

if (slides.length && slideCount && slideDots.length === slides.length) {
  document.querySelector(".slide-prev")?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    restartSlideTimer();
  });
  document.querySelector(".slide-next")?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    restartSlideTimer();
  });
  slideDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlideTimer();
    });
  });
  document.addEventListener("visibilitychange", restartSlideTimer);
  reducedMotion.addEventListener("change", restartSlideTimer);
  showSlide(0);
  restartSlideTimer();
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach((dateInput) => {
  dateInput.min = localToday;
});

const checkin = document.querySelector('input[name="checkin"]');
const checkout = document.querySelector('input[name="checkout"]');
if (checkin && checkout) {
  checkin.addEventListener("change", () => {
    checkout.min = checkin.value || localToday;
    if (checkout.value && checkout.value <= checkin.value) {
      checkout.value = "";
    }
  });
}

const stayForm = document.querySelector("#booking-form");
if (stayForm) {
  stayForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(stayForm);
    const checkinDate = new Date(`${formData.get("checkin")}T00:00:00`);
    const checkoutDate = new Date(`${formData.get("checkout")}T00:00:00`);
    const message = stayForm.querySelector(".form-message");

    if (checkoutDate <= checkinDate) {
      message.textContent = "Please choose a check-out date after your check-in.";
      checkout.focus();
      return;
    }

    message.textContent = "Your dates are selected. This demo does not send reservations; please connect the form to Fair Farm's booking service.";
  });
}

document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
  const venue = new URLSearchParams(window.location.search).get("venue");
  const venueSelect = form.querySelector('select[name="venue"]');
  if (venue && venueSelect && Array.from(venueSelect.options).some((option) => option.value === venue)) {
    venueSelect.value = venue;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.querySelector(".form-message").textContent = "Your enquiry is ready, but this demo does not send messages. Connect the form to Fair Farm Resort's enquiry service before publishing.";
  });
});
