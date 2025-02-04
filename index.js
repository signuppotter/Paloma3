// Mouse glow effect
function updateGlow(e) {
  const glowEffect = document.querySelector(".glow-effect");
  const x = e.clientX;
  const y = e.clientY;

  gsap.to(glowEffect, {
    x: x,
    y: y,
    duration: 0.6,
    ease: "power2.out"
  });
}

// Parallax effect
function parallaxEffect(e) {
  const moveX = e.clientX * 0.08;
  const moveY = e.clientY * 0.08;

  gsap.to(".bg1", {
    x: moveX * 0.8,
    y: moveY * 0.8,
    duration: 1,
    ease: "power1.out"
  });

  gsap.to(".bg2", {
    x: moveX * 0.5,
    y: moveY * 0.5,
    duration: 1,
    ease: "power1.out"
  });
}

// Collection item hover effects
function setupCollectionAnimations() {
  const items = document.querySelectorAll(".item-wrapper");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item.querySelector(".image-container"), {
        scale: 1.1,
        y: -10,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item.querySelector(".image-container"), {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    });

    item.addEventListener("click", () => {
      gsap.to(item.querySelector(".image-container"), {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.in",
        onComplete: () => {
          // Create ripple effect
          const ripple = document.createElement("div");
          ripple.className = "ripple";
          item.appendChild(ripple);

          gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
          });
        }
      });
    });
  });
}

// Logo and explore text animations
function setupLogoAnimations() {
  const logo = document.querySelector(".logo-container");
  const explore = document.querySelector(".explore-container");

  setInterval(() => {
    gsap.to(".explore-glow", {
      opacity: 0.5,
      duration: 1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  }, 4000);
}

// Content entrance animations
function animateContent() {
  const timeline = gsap.timeline({
    defaults: { duration: 1, ease: "power3.out" }
  });

  timeline
    .to(".content-wrapper", {
      opacity: 1,
      duration: 0.5
    })
    .to(
      ".logo",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.8)"
      },
      "-=0.3"
    )
    .to(
      ".explore-text",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.8)"
      },
      "-=0.7"
    )
    .to(
      ".collection-item",
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)"
      },
      "-=0.5"
    )
    .from(
      ".item-wrapper",
      {
        rotation: 15,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out"
      },
      "-=1"
    );
}

// Random position generator
function getRandomUpperPosition() {
  return Math.random() * (window.innerHeight * 0.5);
}

// Cloud and bird animations
function startBackgroundAnimations() {
  let cloudY = getRandomUpperPosition();
  let birdY = getRandomUpperPosition();

  gsap.set(".cloud", { y: cloudY, x: -200 });
  gsap.set(".bird", { y: birdY, x: -100 });

  gsap.to(".cloud", {
    x: window.innerWidth + 200,
    duration: 15,
    repeat: -1,
    ease: "none",
    onRepeat: () => {
      cloudY = getRandomUpperPosition();
      gsap.set(".cloud", { x: -200, y: cloudY });
    }
  });

  gsap.to(".bird", {
    x: window.innerWidth + 100,
    duration: 8,
    repeat: -1,
    ease: "none",
    onRepeat: () => {
      birdY = getRandomUpperPosition();
      gsap.set(".bird", { x: -100, y: birdY });
    }
  });

  // Add floating effect to bird
  gsap.to(".bird", {
    y: "+=15",
    duration: 1.5,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
  });
}

// Initialize everything
window.addEventListener("load", () => {
  // Initial setup
  gsap.set(".content-wrapper", { opacity: 0 });
  gsap.set(".logo, .explore-text", { opacity: 0, y: -50 });
  gsap.set(".collection-item", { opacity: 0, y: 50 });
  gsap.set(".cloud", { x: -200 });
  gsap.set(".bird", { x: -100 });

  // Initial fade in
  gsap.from("body", {
    opacity: 0,
    duration: 1,
    ease: "power2.in"
  });

  // Start the sequence
  gsap.to(".bg2", {
    y: 0,
    duration: 1.5,
    delay: 1,
    ease: "power3.inOut",
    onComplete: () => {
      startBackgroundAnimations();
      animateContent();
      setupCollectionAnimations();
      setupLogoAnimations();
    }
  });
});

// Event listeners
window.addEventListener("mousemove", (e) => {
  updateGlow(e);
  parallaxEffect(e);
});

window.addEventListener("resize", () => {
  gsap.set(".cloud", { x: -200 });
  gsap.set(".bird", { x: -100 });
});

// Add touch events for mobile
document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  updateGlow(touch);
  parallaxEffect(touch);
});

// Optional: Add preloader
window.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");
  let loadedImages = 0;

  images.forEach((img) => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener("load", () => {
        loadedImages++;
        if (loadedImages === images.length) {
          // All images loaded
          document.body.classList.add("loaded");
        }
      });
    }
  });
});

// Helper function for smooth scroll animations
function smoothScroll(target, duration = 1) {
  gsap.to(window, {
    duration: duration,
    scrollTo: target,
    ease: "power2.inOut"
  });
}

// Add keyframe animations for additional visual interest
gsap.to(".glow-effect", {
  scale: 1.2,
  opacity: 0.8,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// Handle collection item focus states for keyboard navigation
document.querySelectorAll(".item-wrapper").forEach((item) => {
  item.addEventListener("focus", () => {
    gsap.to(item.querySelector(".image-container"), {
      scale: 1.1,
      y: -10,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  item.addEventListener("blur", () => {
    gsap.to(item.querySelector(".image-container"), {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  });
});
