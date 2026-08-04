(() => {
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".main-navigation");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;

    menuButton.classList.remove("active");
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu de navegação");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuButton.classList.toggle("active", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );

      document.body.classList.toggle("menu-open", isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  const heroItems = document.querySelectorAll(".hero-enter");

  requestAnimationFrame(() => {
    heroItems.forEach((item) => item.classList.add("visible"));
  });

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const track = document.querySelector(".testimonial-track");
  const previousButton = document.querySelector(".carousel-previous");
  const nextButton = document.querySelector(".carousel-next");
  const dots = Array.from(document.querySelectorAll(".dot"));

  const testimonialCards = track
    ? Array.from(track.querySelectorAll(".testimonial-card"))
    : [];

  const cardPosition = (index) => {
    const card = testimonialCards[index];

    if (!track || !card) return 0;

    return card.offsetLeft - track.offsetLeft;
  };

  const setActiveDot = (index) => {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  const scrollToCard = (index) => {
    if (!track || !testimonialCards.length) return;

    const safeIndex = Math.max(0, Math.min(index, testimonialCards.length - 1));

    track.scrollTo({
      left: cardPosition(safeIndex),
      behavior: "smooth"
    });

    setActiveDot(safeIndex);
  };

  const getCurrentIndex = () => {
    if (!track || !testimonialCards.length) return 0;

    const currentLeft = track.scrollLeft;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    testimonialCards.forEach((card, index) => {
      const distance = Math.abs(cardPosition(index) - currentLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  previousButton?.addEventListener("click", () => {
    scrollToCard(getCurrentIndex() - 1);
  });

  nextButton?.addEventListener("click", () => {
    scrollToCard(getCurrentIndex() + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToCard(index));
  });

  let scrollTimeout;

  track?.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimeout);

    scrollTimeout = window.setTimeout(() => {
      setActiveDot(getCurrentIndex());
    }, 80);
  });

  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
})();
