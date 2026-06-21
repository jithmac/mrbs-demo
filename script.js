// LMS URL Placeholder - Swap before deploy
const LMS_URL = "#"; 

document.addEventListener("DOMContentLoaded", () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // --- LADDER RAIL ---
    const sections = gsap.utils.toArray('.ladder-section');
    const rungs = gsap.utils.toArray('.rung');
    const railProgress = document.getElementById('rail-progress');
    const ladderIcon = document.getElementById('ladder-icon');
    
    const colors = ['#D6483A', '#F0B94A', '#C9A24B', '#5CC1B0', '#6FA9C4', '#1A1B1E', '#D6483A', '#1A1B1E'];

    // Update rail progress on scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress * 100;
        
        if (window.innerWidth > 768) {
          railProgress.style.height = `${progress}%`;
          ladderIcon.style.top = `${progress}%`;
        } else {
          railProgress.style.width = `${progress}%`;
          ladderIcon.style.left = `${progress}%`;
        }

        // Color update for icon and rail based on current section
        const sectionIndex = Math.min(Math.floor(self.progress * sections.length), sections.length - 1);
        ladderIcon.style.background = colors[sectionIndex % colors.length];
      }
    });

    // Rung active state binding
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: self => {
          if (self.isActive && rungs[i]) {
            rungs.forEach(r => {
                r.classList.remove('filled');
                r.style.background = ''; // reset inline style
            });
            rungs[i].classList.add('filled');
            rungs[i].style.background = colors[i % colors.length];
          }
        }
      });
    });
  }

  // Rung click jump
  document.querySelectorAll('.rung').forEach(rung => {
    rung.addEventListener('click', () => {
      const targetSelector = rung.getAttribute('data-target');
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // --- HERO ---
  // Typing Effect
  const typingText = "නින්ද නොයන BS පන්තිය";
  const typeTarget = document.querySelector('.typewriter-text');
  if (typeTarget && !prefersReducedMotion) {
    let isDeleting = false;
    let charIndex = 0;
    
    function typeLoop() {
      let typeSpeed = isDeleting ? 30 : 60; // Backspace faster than typing
      
      if (!isDeleting && charIndex < typingText.length) {
        // Typing
        typeTarget.textContent = typingText.substring(0, charIndex + 1);
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        typeTarget.textContent = typingText.substring(0, charIndex - 1);
        charIndex--;
      }
      
      // State transitions and pauses
      if (!isDeleting && charIndex === typingText.length) {
        // Pause at the end before deleting
        typeSpeed = 3000;
        isDeleting = true;
        typeTarget.style.color = "var(--ladder-red)";
      } else if (isDeleting && charIndex === 0) {
        // Pause before typing again
        typeSpeed = 800;
        isDeleting = false;
        typeTarget.style.color = ""; // reset color
      } else if (!isDeleting) {
        typeTarget.style.color = ""; // default color while typing
      }
      
      setTimeout(typeLoop, typeSpeed);
    }
    
    typeLoop();
  } else if (typeTarget) {
    typeTarget.textContent = typingText;
    typeTarget.style.color = "var(--ladder-red)";
  }

  // Parallax
  const parallaxContainer = document.querySelector('.hero-parallax-container');
  const midLayer = document.querySelector('.mid-layer');
  const fgLayer = document.querySelector('.fg-layer');

  if (parallaxContainer && !prefersReducedMotion && window.innerWidth > 1024) {
    parallaxContainer.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      gsap.to(midLayer, { x: x * -15, y: y * -15, duration: 0.5, ease: "power2.out" });
      gsap.to(fgLayer, { x: x * 15, y: y * 15, duration: 0.5, ease: "power2.out" });
    });
  }

  // Rocket Click Boost
  const rocketWrapper = document.querySelector('.rocket-wrapper');
  if (rocketWrapper) {
    rocketWrapper.addEventListener('click', () => {
      if(prefersReducedMotion) return;
      gsap.timeline()
        .to(rocketWrapper, { y: -20, duration: 0.1, ease: "power1.out" })
        .to(rocketWrapper, { x: -2, rotation: -2, duration: 0.05, yoyo: true, repeat: 3 })
        .to(rocketWrapper, { y: 0, rotation: 0, x: 0, duration: 0.3, ease: "bounce.out" });
    });
    rocketWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') rocketWrapper.click();
    });
  }

  // Magnetic Buttons
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    if(prefersReducedMotion || window.innerWidth < 768) return;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      // bound range to a few px
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  });

  // Hero LMS button jump to LMS section if href not set
  const heroLmsBtn = document.getElementById('hero-lms-btn');
  if(heroLmsBtn) {
     heroLmsBtn.addEventListener('click', () => {
         document.getElementById('lms').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
     });
  }

  // --- PROOF STRIP ---
  const coins = document.querySelectorAll('.flip-coin');
  if (typeof ScrollTrigger !== 'undefined' && coins.length > 0) {
    ScrollTrigger.create({
      trigger: "#proof",
      start: "top 70%",
      onEnter: () => {
        if (!prefersReducedMotion) {
          coins.forEach((coin, i) => {
            setTimeout(() => {
              coin.classList.add('flipped');
            }, i * 120);
          });
        } else {
          coins.forEach(c => c.classList.add('flipped'));
        }
      },
      once: true
    });
  }
  coins.forEach(coin => {
    coin.addEventListener('click', () => coin.classList.toggle('flipped'));
    coin.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            coin.classList.toggle('flipped');
        }
    });
  });

  // --- ABOUT TEACHER ---
  const medallion = document.querySelector('.medallion-btn');
  const bioArea = document.querySelector('.bio-reveal-area');
  if (medallion && bioArea) {
    medallion.addEventListener('click', () => {
      bioArea.classList.toggle('revealed');
      medallion.classList.toggle('clicked');
    });
  }

  // --- WHY MRBS CAROUSEL ---
  const trackWrapper = document.querySelector('.carousel-track-wrapper');
  const progressBar = document.querySelector('.carousel-progress-bar');
  
  if (trackWrapper && progressBar) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Desktop Mouse Dragging
    trackWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      trackWrapper.style.cursor = 'grabbing';
      startX = e.pageX - trackWrapper.offsetLeft;
      scrollLeft = trackWrapper.scrollLeft;
    });
    trackWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      trackWrapper.style.cursor = 'grab';
    });
    trackWrapper.addEventListener('mouseup', () => {
      isDown = false;
      trackWrapper.style.cursor = 'grab';
    });
    trackWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - trackWrapper.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed multiplier
      trackWrapper.scrollLeft = scrollLeft - walk;
    });

    // Native scroll syncing for progress bar (works on touch too)
    trackWrapper.addEventListener('scroll', () => {
      const maxScroll = trackWrapper.scrollWidth - trackWrapper.clientWidth;
      let progress = 0;
      if(maxScroll > 0) {
         progress = trackWrapper.scrollLeft / maxScroll;
      }
      progressBar.style.width = `${25 + progress * 75}%`;
    });
  }

  // --- CLASSES COMPASS (ORBIT DIAL) ---
  const orbitIndicator = document.getElementById('orbit-indicator');
  const orbitNodes = document.querySelectorAll('.orbit-node');
  const classPanels = document.querySelectorAll('.class-panel');

  orbitNodes.forEach(node => {
    const triggerSelection = () => {
      const target = node.getAttribute('data-target');
      const angle = node.getAttribute('data-angle');
      
      // Update ARIA and styling
      orbitNodes.forEach(n => n.setAttribute('aria-selected', 'false'));
      node.setAttribute('aria-selected', 'true');

      // Rotate indicator
      if (orbitIndicator && !prefersReducedMotion) {
        orbitIndicator.style.transform = `rotate(${angle}deg)`;
      } else if (orbitIndicator) {
         orbitIndicator.style.transition = 'none';
         orbitIndicator.style.transform = `rotate(${angle}deg)`;
      }

      // Switch panels with crossfade
      classPanels.forEach(p => {
        p.classList.remove('active');
        // wait for fade out before hidden
        setTimeout(() => {
          if (!p.classList.contains('active')) p.setAttribute('hidden', 'true');
        }, 400); // matches CSS transition time
      });
      
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.removeAttribute('hidden');
        // trigger reflow for transition
        void targetPanel.offsetWidth;
        targetPanel.classList.add('active');
      }
    };

    node.addEventListener('click', triggerSelection);
    node.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerSelection();
        }
    });
  });

  // --- ENTREPRENEURSHIP STRIP ---
  const strip = document.getElementById('strip');
  const marqueeTrack = document.querySelector('.marquee-track');

  if (strip && !prefersReducedMotion) {
    let marqueeTween = gsap.to(marqueeTrack, {
      xPercent: -33.33,
      ease: "none",
      duration: 15,
      repeat: -1
    });

    strip.addEventListener('mouseenter', () => marqueeTween.pause());
    strip.addEventListener('mouseleave', () => marqueeTween.play());

    if(window.innerWidth > 768) {
       strip.addEventListener('mousemove', (e) => {
         const x = e.clientX / window.innerWidth;
         gsap.to('.gear-1', { rotation: x * 360, duration: 1, ease: "power1.out" });
         gsap.to('.gear-2', { rotation: -x * 360, duration: 1, ease: "power1.out" });
       });
    } else {
       gsap.to('.gear-1', { rotation: 360, duration: 20, repeat: -1, ease: "none" });
       gsap.to('.gear-2', { rotation: -360, duration: 20, repeat: -1, ease: "none" });
    }
  }

  // --- LMS LAUNCH ---
  const btnLaunch = document.getElementById('btn-launch');
  const launchContainer = document.querySelector('.launch-sequence-container');

  if (btnLaunch) {
    btnLaunch.addEventListener('click', (e) => {
      e.preventDefault();
      if(prefersReducedMotion) {
        window.location.href = LMS_URL;
        return;
      }

      // Inject rocket
      launchContainer.innerHTML = `
        <svg class="rocket-svg" viewBox="0 0 100 150" style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:90px;">
          <path d="M50 10 C30 50, 30 100, 30 100 L70 100 C70 100, 70 50, 50 10 Z" fill="var(--ink)"/>
          <path d="M30 100 L10 120 L30 110 Z" fill="var(--ladder-red)"/>
          <path d="M70 100 L90 120 L70 110 Z" fill="var(--ladder-red)"/>
          <rect x="40" y="100" width="20" height="30" fill="var(--ladder-yellow)" />
        </svg>
      `;
      const injectedRocket = launchContainer.querySelector('svg');

      gsap.to(btnLaunch, { opacity: 0, duration: 0.2 });
      
      // Streak upwards
      gsap.to(injectedRocket, { 
        y: -window.innerHeight, 
        duration: 0.8, 
        ease: "power2.in",
        onComplete: () => {
          window.location.href = LMS_URL;
        }
      });
    });
  }
});
