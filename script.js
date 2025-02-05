// Mouse glow effect - unchanged
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

// Parallax effect - unchanged
function parallaxEffect(e) {
    const moveX = e.clientX * 0.05;
    const moveY = e.clientY * 0.05;

    gsap.to(".bg1", {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: "power1.out"
    });

    gsap.to(".bg2", {
        x: moveX * 0.7,
        y: moveY * 0.7,
        duration: 1,
        ease: "power1.out"
    });
}

// Collection item animations - unchanged
function setupCollectionAnimations() {
    const items = document.querySelectorAll(".item-wrapper");

    items.forEach((item) => {
        const imageContainer = item.querySelector(".image-container"); // Target image container
        gsap.set(imageContainer, { scale: 1, y: 0 }); // Set initial scale for container

        item.addEventListener("mouseenter", () => {
            gsap.to(imageContainer, { // Animate image container
                scale: 1.05,
                duration: 0.3, // Shorten duration for snappier effect
                ease: "power2.out"
            });
        });

        item.addEventListener("mouseleave", () => {
            gsap.to(item.querySelector(".image-container"), { // Animate image container
                scale: 1,
                duration: 0.3, // Shorten duration for snappier effect
                ease: "power2.inOut"
            });
        });
    });
}

// Initial Door Shake Animation - New Function with Delay
function initialDoorShake() {
    gsap.to(".door-container", {
        x: "+=7", // Increased shake amount slightly
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.out",
        onComplete: () => {
            gsap.delayedCall(0.5, playDoorAnimation); // Delay playDoorAnimation by 0.5 seconds
        }
    });
}


// Enhanced door animation with mystical effects - Content starts WITH slide-in
function playDoorAnimation() {
    const timeline = gsap.timeline({
        onComplete: () => {
            gsap.set(".door-container", { display: "none" }); // Hide the door container completely
            setupCollectionAnimations(); // Initialize collection animations after content is visible
            setupLogoAnimations(); // Initialize logo glow animation
        }
    });

    // Set initial states - unchanged
    gsap.set([".door-left", ".door-right"], { x: 0 });
    gsap.set(".content-wrapper", {
        opacity: 0,
        visibility: "visible"
    });
    gsap.set([".cloud", ".bird"], { opacity: 0 });
    gsap.set(".door::before", { opacity: 0 });
    gsap.set(".collection-item", { opacity: 0, y: 50 }); // Ensure collection items are initially hidden and positioned
    gsap.set(".item-wrapper", { rotation: 15, opacity: 0 }); // Initialize item wrappers for entrance animation


    timeline.addLabel("doorOpenAnimation"); // Label for door open animation
    timeline.addLabel("bg2SlideInStart", "doorOpenAnimation+=0.2"); // BG2 starts slightly after door open starts
    timeline.addLabel("contentStart", "bg2SlideInStart"); // Content Animation Start Label - NOW AT BG2 START!


    // Mystical door animation sequence - unchanged
    timeline
        // Initial mystical buildup
        .to(".door::before", {
            opacity: 0.8,
            duration: 1,
            ease: "power2.inOut"
        })
        // Mystical glow pulse
        .to(".door::before", {
            opacity: 0,
            duration: 0.5,
            ease: "power4.inOut"
        })
        // Door opening with enhanced effects - Animation to label 'doorOpenAnimation'
        .to([".door-left", ".door-right"], {
            x: function(i) { return i === 0 ? "-100%" : "100%"; },
            duration: 2,
            ease: "power4.inOut",
            stagger: 0.1
        }, "doorOpenAnimation")
         // BG2 Animation - moved to during door opening, starting slightly after door starts opening
        .to(".bg2", {
            y: 0,
            duration: 1.5,
            ease: "power3.inOut"
        }, "bg2SlideInStart") // Start BG2 slightly after door opening starts
        // Start Content Animations DIRECTLY in Timeline, chained WITH BG2
        .add(startBackgroundAnimations, "contentStart") // Call startBackgroundAnimations DIRECTLY at contentStart Label - NOW WITH BG2!
        .add(animateContent, "contentStart")          // Call animateContent DIRECTLY at contentStart Label - NOW WITH BG2!
        // Fade out doors - starts AFTER doorOpenAnimation is complete
        .to(".door-container", {
            opacity: 0,
            duration: 0.3, // Shortened fade out duration
        }, "doorOpenAnimation+=2"); // Start fade out 2 seconds after label (door opening duration)
}

// Separate content animation function - Modified to animate collection items entrance
function animateContent() {
    const contentTimeline = gsap.timeline();

    contentTimeline
        // Fade in content wrapper - unchanged
        .to(".content-wrapper", {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        })
        // Animate logo - unchanged
        .from(".logo", {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.5")
        // Animate explore text - unchanged
        .from(".explore-text", {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.7")
        // Animate collection items - Reinstated entrance animations
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
        .to(
            ".item-wrapper",
            {
                rotation: 0, // Changed rotation to 0 to animate from rotated to normal
                opacity: 1, // Animate opacity in as well
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            },
            "-=1"
        );
}

// Updated background animations - Modified to add truly random Y position on repeat
function startBackgroundAnimations() {
    // Show elements before animation
    gsap.set([".cloud", ".bird"], { opacity: 1 }); // Ensure bird and cloud are visible immediately

    function animateElement(element, duration, delay = 0) {
        const elementWidth = element.offsetWidth; // Get element width OUTSIDE fromTo for accurate reset

        gsap.to(element, // Changed from gsap.fromTo to gsap.to for seamless repeat
            {
                x: window.innerWidth + elementWidth,
                duration: duration,
                delay: delay,
                ease: "none",
                repeat: -1,
                onRepeat: () => {
                    const newY = Math.random() * (window.innerHeight * 0.3); // Generate new random Y
                    gsap.set(element, {
                        y: newY, // Set new random Y position
                        x: -elementWidth // Reset x position to the left, using elementWidth
                    });
                },
                // Initial values are now set using gsap.set OUTSIDE animateElement
            }
        );

        // Floating effect - unchanged
        gsap.to(element, {
            y: "+=20",
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    const cloud = document.querySelector(".cloud");
    const bird = document.querySelector(".bird");

    // Initial setup for cloud and bird positions (outside animateElement)
    gsap.set(cloud, { x: -cloud.offsetWidth, y: Math.random() * (window.innerHeight * 0.3) });
    gsap.set(bird, { x: -bird.offsetWidth, y: Math.random() * (window.innerHeight * 0.3) });


    animateElement(cloud, 20);
    animateElement(bird, 10, 2);
}

// Logo and explore text animations - unchanged
function setupLogoAnimations() {
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


// Initialize animations - Modified to remove bg2 animation from here and add delayed call for door shake
function initializeAnimations() {
    // Set initial states - unchanged and added collection-item opacity and item-wrapper rotation/opacity
    gsap.set(".content-wrapper", {
        opacity: 0,
        visibility: "hidden"
    });
    gsap.set(".door-container", { scale: 1 });
    gsap.set(".collection-item", { opacity: 0, y: 50 }); // Initialize collection items to be hidden and positioned
    gsap.set([".cloud", ".bird"], { opacity: 1 }); // Initialize cloud and bird to be VISIBLE from start
    gsap.set(".item-wrapper", { rotation: 15, opacity: 0 }); // Initialize item wrappers for entrance animation


    // Start door animation with delay after image load completion
    const startAnimation = () => {
         initialDoorShake(); // Call initial door shake first, which will then call playDoorAnimation after delay
    };

    // Check image loading and then start animation
    const images = document.querySelectorAll("img");
    let loadedImages = 0;
    const totalImages = images.length;

    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            startAnimation(); // Call startAnimation when all images are loaded
        }
    }

    if (totalImages === 0) {
        startAnimation(); // If no images, start animation immediately
    } else {
        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded); // Handle error cases
            }
        });
    }
}


// Keep your existing event listeners - unchanged
window.addEventListener("mousemove", (e) => {
    updateGlow(e);
    parallaxEffect(e);
});

document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    updateGlow(touch);
    parallaxEffect(touch);
});

window.addEventListener("load", initializeAnimations);
