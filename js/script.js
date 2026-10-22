// main portfolio script — GSAP ScrollTrigger powered

$(function () {

	// ── Preloader & Initial Load Animation ──
	// Split text into individual characters for staggered animation
	$('.split-text').each(function() {
		var isGradient = $(this).hasClass('gradient-text');
		var text = $(this).text();
		var split = '';
		for(var i = 0; i < text.length; i++) {
			var char = text[i] === ' ' ? '&nbsp;' : text[i];
			var extraClass = isGradient ? ' hero__title-gradient' : '';
			split += '<span class="hero-char' + extraClass + '" style="display:inline-block;">' + char + '</span>';
		}
		// Remove the gradient class from the parent to avoid stacking context bug
		if (isGradient) $(this).removeClass('hero__title-gradient');
		$(this).html(split);
	});

	// Master timeline for initial load sequence (runs on DOM ready instead of waiting for window.load)
	var loadTl = gsap.timeline();
	
	// Animate each letter
	loadTl.from('.hero-char', {
		y: 60,
		opacity: 0,
		filter: 'blur(8px)',
		duration: 0.9,
		stagger: 0.05,
		ease: 'back.out(1.2)',
		clearProps: 'y,opacity,filter'
	});

	// ── Lenis Smooth Scroll (Water flowing effect) ──
	var lenis = new Lenis({
		duration: 1.5, // Increased for a flowing water feel
		easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
		direction: 'vertical',
		gestureDirection: 'vertical',
		smooth: true,
		mouseMultiplier: 1,
		smoothTouch: false,
		touchMultiplier: 2,
		infinite: false,
	});

	lenis.on('scroll', function() {
		ScrollTrigger.update();
		handleNavScroll();
		updateMobileNav();
	});

	gsap.ticker.add(function(time) {
		lenis.raf(time * 1000);
	});

	gsap.ticker.lagSmoothing(0);

	// ── configuration ──
	var SCROLL_THRESHOLD = 100;
	var COUNTER_DURATION = 2000;

	// ── cache dom selectors ──
	var $topNavbar = $('#top-navbar');
	var $sideNavbar = $('#side-navbar');
	var $bottomNav = $('#bottom-navbar');
	var $heroClock = $('#hero-clock');
	var $heroDate = $('#hero-date');
	var $contactForm = $('#contact-form');
	var $window = $(window);
	var $scrollToTop = $('#scroll-to-top');

	// ── register GSAP plugins ──
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

	// ── GSAP default easing ──
	var smoothEase = 'power3.out';
	var elasticEase = 'elastic.out(1, 0.5)';
	var backEase = 'back.out(1.7)';

	// ── Mobile / Tablet detection ──
	// Samsung S21 Ultra CSS viewport: 360x800 (portrait)
	// iPad: 768x1024, iPad Pro: 1024x1366
	var isMobile = window.innerWidth < 768;
	var isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
	var isSmallScreen = window.innerWidth < 1024;

	// ── Responsive animation values ──
	// On mobile, reduce distances to avoid overflow and ensure smooth rendering
	function getAnimValues() {
		var vw = window.innerWidth;
		if (vw < 480) {
			// Small phones (Samsung S21 Ultra = 360px, iPhone SE = 375px)
			return {
				slideX: 50,        // reduced from 100-120
				slideY: 40,        // reduced from 60-120
				slideSmallX: 30,   // for subtle slides
				slideSmallY: 25,
				cardSlideY: 50,    // for card entrances
				scaleFrom: 0.92,   // subtler scale
				duration: 1.0,     // Slower for smoother reveal (was 0.7)
				stagger: 0.08,
				triggerOffset: 140 // Wait until it clears the bottom navbar (was 80)
			};
		} else if (vw < 768) {
			// Larger phones
			return {
				slideX: 60,
				slideY: 50,
				slideSmallX: 35,
				slideSmallY: 30,
				cardSlideY: 60,
				scaleFrom: 0.93,
				duration: 1.1,     // Slower (was 0.8)
				stagger: 0.1,
				triggerOffset: 150 // Wait until it clears the bottom navbar (was 90)
			};
		} else if (vw < 1024) {
			// Tablets
			return {
				slideX: 80,
				slideY: 60,
				slideSmallX: 40,
				slideSmallY: 35,
				cardSlideY: 80,
				scaleFrom: 0.92,
				duration: 1.2,     // Slower (was 0.9)
				stagger: 0.1,
				triggerOffset: 150 // Reveal slightly later (was 100)
			};
		} else {
			// Desktop
			return {
				slideX: 100,
				slideY: 80,
				slideSmallX: 50,
				slideSmallY: 40,
				cardSlideY: 100,
				scaleFrom: 0.9,
				duration: 1,
				stagger: 0.12,
				triggerOffset: 100
			};
		}
	}

	var anim = getAnimValues();

	// ── Helper: Create ScrollTrigger config with pixel offset ──
	// Uses "top bottom-={offset}px" so the animation starts when the TOP of the 
	// element is {offset}px above the BOTTOM of the viewport.
	// This means: element enters viewport, scrolls up another {offset}px, THEN animates.
	function makeTrigger(el, extraOffset) {
		var offset = anim.triggerOffset + (extraOffset || 0);
		return {
			trigger: el,
			start: 'top bottom-=' + offset + 'px',
			toggleActions: 'play none none none'  // play once, don't reverse (avoids jank on scroll up)
		};
	}

	// ── disable native scroll-behavior for GSAP control ──
	// (GSAP handles smooth scrolling via ScrollTrigger)

	// ══════════════════════════════════════════════════════════
	// 1. HERO SECTION — Parallax fade + scale on scroll out
	// ══════════════════════════════════════════════════════════

	function initHeroAnimations() {
		var heroTl = gsap.timeline({
			scrollTrigger: {
				trigger: '.hero',
				start: 'top top',
				end: 'bottom top',
				scrub: isMobile ? 0.5 : 1.0,
				onLeaveBack: function () {
					gsap.set(['.hero__title', '.hero__subtitle', '.hero__actions', '.hero__clock-container'], {
						opacity: 1,
						y: 0,
						scale: 1,
						filter: 'blur(0px)',
						clearProps: 'transform,opacity,filter'
					});
				}
			}
		});

		heroTl
			.fromTo('.hero__title', 
				{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
				{ y: isMobile ? -60 : -120, opacity: 0, scale: isMobile ? 0.9 : 0.85, filter: 'blur(10px)', ease: 'none' },
				0
			)
			.fromTo('.hero__subtitle',
				{ y: 0, opacity: 1 },
				{ y: isMobile ? -40 : -80, opacity: 0, ease: 'none' },
				0
			)
			.fromTo('.hero__actions',
				{ y: 0, opacity: 1 },
				{ y: isMobile ? -30 : -60, opacity: 0, ease: 'none' },
				0
			)
			.fromTo('.hero__clock-container',
				{ y: 0, opacity: 1, x: 0, rotation: 0 },
				{ y: isMobile ? -50 : -100, opacity: 0, x: isMobile ? 25 : 50, rotation: isMobile ? 3 : 5, ease: 'none' },
				0
			);

		// Background orbs parallax — reduce on mobile
		if (!isMobile) {
			gsap.to('.bg-orb--primary', {
				y: -200,
				x: 100,
				scrollTrigger: {
					trigger: 'body',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 2
				}
			});

			gsap.to('.bg-orb--secondary', {
				y: 200,
				x: -100,
				scrollTrigger: {
					trigger: 'body',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 3
				}
			});
		}
	}

	// ══════════════════════════════════════════════════════════
	// 2. ABOUT SECTION — Split reveal with stagger
	// ══════════════════════════════════════════════════════════

	function initAboutAnimations() {
		// Image wrapper — slides from left
		gsap.from('.about__image-wrapper', {
			x: -anim.slideX,
			y: anim.slideSmallY,
			opacity: 0,
			rotation: isSmallScreen ? -2 : -5,
			scale: anim.scaleFrom,
			duration: anim.duration * 1.2,
			ease: backEase,
			scrollTrigger: makeTrigger('.about__image-wrapper')
		});

		// Image glow pulse animation
		gsap.fromTo('.about__image-glow', {
			scale: 0.8,
			opacity: 0
		}, {
			scale: 1,
			opacity: 0.5,
			duration: anim.duration * 1.5,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.about__image-wrapper')
		});

		// About text content — slides from right, each element triggers independently
		var aboutContent = document.querySelector('.about__grid');
		if (aboutContent) {
			var aboutHeading = aboutContent.querySelector('.about__heading');
			if (aboutHeading) {
				gsap.from(aboutHeading, {
					x: anim.slideSmallX,
					y: anim.slideSmallY,
					opacity: 0,
					duration: anim.duration,
					ease: smoothEase,
					scrollTrigger: makeTrigger(aboutHeading)
				});
			}

			var aboutTexts = aboutContent.querySelectorAll('.about__text');
			aboutTexts.forEach(function(el) {
				gsap.from(el, {
					x: anim.slideSmallX,
					y: anim.slideSmallY,
					opacity: 0,
					duration: anim.duration,
					ease: smoothEase,
					scrollTrigger: makeTrigger(el)
				});
			});

			var aboutStats = aboutContent.querySelector('.about__stats');
			if (aboutStats) {
				gsap.from(aboutStats, {
					y: anim.slideSmallY,
					opacity: 0,
					duration: anim.duration,
					ease: smoothEase,
					scrollTrigger: makeTrigger(aboutStats)
				});
			}
		}

		// Stats — independent count up with scale bounce
		var stats = document.querySelectorAll('.about__stat');
		stats.forEach(function(stat) {
			gsap.from(stat, {
				scale: 0.3,
				opacity: 0,
				y: anim.slideSmallY,
				duration: anim.duration * 0.8,
				ease: elasticEase,
				scrollTrigger: makeTrigger(stat)
			});
		});
	}

	// ══════════════════════════════════════════════════════════
	// 3. TECH STACK — Bento grid cinematic entrance
	// ══════════════════════════════════════════════════════════

	function initTechStackAnimations() {
		// Section header — slides from bottom
		gsap.from('.tech-stack__header', {
			y: anim.slideSmallY,
			opacity: 0,
			duration: anim.duration,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.tech-stack__header')
		});

		// Bento cards — each triggers independently when it enters the viewport
		// Alternate directions: even from left, odd from right
		var bentoCards = document.querySelectorAll('.bento-card');
		bentoCards.forEach(function(card, i) {
			var direction = i % 2 === 0 ? -1 : 1;
			gsap.from(card, {
				x: anim.slideSmallX * direction,
				y: anim.cardSlideY,
				opacity: 0,
				scale: anim.scaleFrom,
				duration: anim.duration,
				ease: 'back.out(1.2)',
				scrollTrigger: makeTrigger(card)
			});
		});

		// Tech chips are visible by default — they animate naturally with their parent bento cards
		// No separate chip animation needed (was causing invisible state due to parent opacity conflict)
	}

	// ══════════════════════════════════════════════════════════
	// 4. SERVICES — Card fan entrance
	// ══════════════════════════════════════════════════════════

	function initServicesAnimations() {
		// Section header — slides from bottom
		gsap.from('.services__header', {
			y: anim.slideSmallY,
			opacity: 0,
			duration: anim.duration,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.services__header')
		});

		// Divider line grows from left
		gsap.from('.services__divider', {
			scaleX: 0,
			transformOrigin: 'left center',
			duration: anim.duration * 1.2,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.services__header', 20)
		});

		// Service cards — each triggers independently
		// Alternate: first from left, second from bottom, third from right
		var serviceCards = document.querySelectorAll('.service-card');
		var directions = [-1, 0, 1]; // left, bottom, right
		serviceCards.forEach(function (card, i) {
			var dir = directions[i % 3];
			var fromProps = {
				y: anim.cardSlideY,
				opacity: 0,
				scale: anim.scaleFrom,
				duration: anim.duration,
				ease: 'back.out(1.2)',
				scrollTrigger: makeTrigger(card)
			};

			if (dir !== 0) {
				fromProps.x = anim.slideSmallX * dir;
			}

			gsap.from(card, fromProps);

			// Service card icon — bounce in (triggers with the card)
			var icon = card.querySelector('.service-card__icon-wrap');
			if (icon) {
				gsap.from(icon, {
					scale: 0,
					rotation: isSmallScreen ? -90 : -180,
					duration: anim.duration * 0.8,
					ease: elasticEase,
					scrollTrigger: makeTrigger(card, 10)
				});
			}
		});
	}

	// ══════════════════════════════════════════════════════════
	// 5. PROJECTS — Cinematic horizontal reveal
	// ══════════════════════════════════════════════════════════

	function initProjectsAnimations() {
		// Section title — from bottom
		gsap.from('.projects__title', {
			y: anim.slideSmallY,
			opacity: 0,
			duration: anim.duration,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.projects__title')
		});

		// Project cards — alternating slide directions (left/right)
		var projectCards = document.querySelectorAll('.project-card');
		projectCards.forEach(function (card, i) {
			var direction = i % 2 === 0 ? -1 : 1;

			gsap.from(card, {
				x: anim.slideX * direction,
				opacity: 0,
				scale: anim.scaleFrom,
				rotation: isSmallScreen ? 1.5 * direction : 3 * direction,
				duration: anim.duration * 1.2,
				ease: smoothEase,
				scrollTrigger: makeTrigger(card)
			});

			// Image parallax inside cards — only on desktop (skip on mobile for perf)
			if (!isSmallScreen) {
				var img = card.querySelector('.project-card__image');
				if (img) {
					gsap.fromTo(img, {
						scale: 1.2,
						y: 30
					}, {
						scale: 1,
						y: -30,
						ease: 'none',
						scrollTrigger: {
							trigger: card,
							start: 'top bottom',
							end: 'bottom top',
							scrub: 1.5
						}
					});
				}
			}

			// Project tags — pop in per card
			var tags = card.querySelectorAll('.project-tag');
			if (tags.length > 0) {
				gsap.from(tags, {
					scale: 0,
					opacity: 0,
					duration: 0.5,
					stagger: anim.stagger,
					ease: backEase,
					scrollTrigger: makeTrigger(card, 20)
				});
			}
		});
	}

	// ══════════════════════════════════════════════════════════
	// 6. TERMINAL — Code editor cinematic reveal
	// ══════════════════════════════════════════════════════════

	function initTerminalAnimations() {
		// Terminal frame — scale + slide from bottom (no rotationX on mobile)
		gsap.from('.terminal__frame', {
			y: anim.cardSlideY,
			opacity: 0,
			scale: isSmallScreen ? 0.9 : 0.85,
			// Skip rotationX on mobile — causes rendering issues
			rotationX: isSmallScreen ? 0 : 10,
			transformOrigin: 'center bottom',
			duration: anim.duration * 1.2,
			ease: backEase,
			scrollTrigger: makeTrigger('.terminal__frame')
		});

		// Terminal dots — sequential pop
		gsap.from('.terminal__dot', {
			scale: 0,
			duration: 0.4,
			stagger: 0.1,
			ease: elasticEase,
			scrollTrigger: makeTrigger('.terminal__frame', 30)
		});

		// Terminal code — typewriter-style line reveal
		gsap.from('.terminal__code', {
			clipPath: 'inset(0 0 100% 0)',
			duration: 1.5,
			ease: 'power2.inOut',
			scrollTrigger: makeTrigger('.terminal__frame', 50)
		});
	}

	// ══════════════════════════════════════════════════════════
	// 7. CONTACT — Split entrance from both sides
	// ══════════════════════════════════════════════════════════

	function initContactAnimations() {
		// Contact container — glow pulse
		gsap.from('.contact__glow', {
			scale: 0,
			opacity: 0,
			duration: 2,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.contact__heading')
		});

		// Contact heading — text reveal from bottom
		gsap.from('.contact__heading', {
			y: anim.slideSmallY,
			opacity: 0,
			clipPath: 'inset(100% 0 0 0)',
			duration: anim.duration,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.contact__heading')
		});

		// Contact intro text
		var contactIntro = document.querySelector('.contact__intro');
		if (contactIntro) {
			gsap.from(contactIntro, {
				y: anim.slideSmallY,
				opacity: 0,
				duration: anim.duration,
				ease: smoothEase,
				scrollTrigger: makeTrigger(contactIntro)
			});
		}

		// Contact info — slide from left independently
		var contactInfo = document.querySelector('.contact__grid > .scroll-reveal');
		if (contactInfo) {
			gsap.from(contactInfo, {
				x: -anim.slideSmallX,
				y: anim.slideSmallY,
				opacity: 0,
				duration: anim.duration,
				ease: smoothEase,
				scrollTrigger: makeTrigger(contactInfo)
			});
		}

		// Contact form — slide from right independently
		gsap.from('.contact-form', {
			x: anim.slideSmallX,
			y: anim.slideSmallY,
			opacity: 0,
			duration: anim.duration,
			ease: smoothEase,
			scrollTrigger: makeTrigger('.contact-form')
		});

		// Contact info items — each slides from left independently
		var infoItems = document.querySelectorAll('.contact__info-item');
		infoItems.forEach(function(item) {
			gsap.from(item, {
				x: -anim.slideSmallX,
				opacity: 0,
				duration: anim.duration * 0.8,
				ease: smoothEase,
				scrollTrigger: makeTrigger(item)
			});
		});

		// Contact info icons animate naturally with their parent .contact__info-item
		// (Separate icon animation was causing opacity:0 conflict with parent)

		// Social links animate naturally with the parent contact slide
		// (Separate scale:0 animation was keeping them invisible)

		// Form groups — cascade slide up, each triggers independently
		var formGroups = document.querySelectorAll('.form-group');
		formGroups.forEach(function(group) {
			gsap.from(group, {
				y: anim.slideSmallY,
				opacity: 0,
				duration: anim.duration * 0.8,
				ease: smoothEase,
				scrollTrigger: makeTrigger(group)
			});
		});

		// Submit button — scale entrance
		gsap.from('.btn--cta', {
			scale: 0.8,
			opacity: 0,
			y: 20,
			duration: anim.duration * 0.8,
			ease: backEase,
			scrollTrigger: makeTrigger('.btn--cta')
		});
	}

	// ══════════════════════════════════════════════════════════
	// 8. SECTION DIVIDER ANIMATIONS — subtle horizontal lines
	// ══════════════════════════════════════════════════════════

	function initSectionTransitions() {
		// Each major section gets a subtle border-top glow animation
		var sections = document.querySelectorAll('.tech-stack, .services, .projects, .terminal, .contact');

		sections.forEach(function (section) {
			gsap.fromTo(section, {
				backgroundPosition: '0% 0%'
			}, {
				backgroundPosition: '100% 0%',
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top bottom',
					end: 'top 60%',
					scrub: 1
				}
			});
		});
	}

	// ══════════════════════════════════════════════════════════
	// 9. MAGNETIC HOVER — Navbar links subtle pull effect
	// ══════════════════════════════════════════════════════════

	function initMagneticElements() {
		// Only init on non-touch devices (magnetic hover doesn't work on touch)
		if ('ontouchstart' in window) return;

		$('.side-navbar__link, .contact__social-link').on('mouseenter', function (e) {
			var el = this;
			$(el).on('mousemove.magnetic', function (ev) {
				var rect = el.getBoundingClientRect();
				var x = ev.clientX - rect.left - rect.width / 2;
				var y = ev.clientY - rect.top - rect.height / 2;
				gsap.to(el, {
					x: x * 0.3,
					y: y * 0.3,
					duration: 0.3,
					ease: 'power2.out'
				});
			});
		}).on('mouseleave', function () {
			$(this).off('mousemove.magnetic');
			gsap.to(this, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: elasticEase
			});
		});
	}

	// ══════════════════════════════════════════════════════════
	// EXISTING FUNCTIONALITY (preserved)
	// ══════════════════════════════════════════════════════════

	// checking scroll position and handling adaptive navigation
	function handleNavScroll() {
		var scrollPos = $window.scrollTop();

		if (scrollPos > SCROLL_THRESHOLD) {
			$topNavbar.addClass('top-navbar--hidden');
			$sideNavbar.removeClass('side-navbar--hidden');
		} else {
			$topNavbar.removeClass('top-navbar--hidden');
			$sideNavbar.addClass('side-navbar--hidden');
		}

		if (scrollPos <= 30) {
			gsap.set(['.hero__title', '.hero__subtitle', '.hero__actions', '.hero__clock-container'], {
				opacity: 1,
				y: 0,
				scale: 1,
				filter: 'blur(0px)',
				clearProps: 'transform,opacity,filter'
			});
		}

		if (scrollPos > 500) {
			$scrollToTop.addClass('scroll-to-top--visible');
		} else {
			$scrollToTop.removeClass('scroll-to-top--visible');
		}
	}

	function resetHeroElements() {
		gsap.set(['.hero__title', '.hero__subtitle', '.hero__actions', '.hero__clock-container'], {
			opacity: 1,
			y: 0,
			scale: 1,
			filter: 'blur(0px)',
			clearProps: 'transform,opacity,filter'
		});
		ScrollTrigger.update();
		handleNavScroll();
		updateMobileNav();
	}

	// ── Scroll-to-top click handler ──
	$scrollToTop.on('click', function (e) {
		e.preventDefault();
		if (typeof lenis !== 'undefined' && lenis) {
			lenis.scrollTo(0, {
				duration: 1.2,
				onComplete: resetHeroElements
			});
		} else {
			gsap.to(window, {
				scrollTo: { y: 0 },
				duration: 1.0,
				ease: 'power3.inOut',
				onComplete: resetHeroElements
			});
		}
	});

	// highlighting mobile nav based on scroll
	function updateMobileNav() {
		var scrollPos = $window.scrollTop() + $window.height() / 3;
		var sections = ['tech', 'experience', 'work', 'contact'];
		var activeSection = null;

		var $firstSection = $('#' + sections[0]);
		var firstTop = $firstSection.length ? $firstSection.offset().top : 999999;

		if (scrollPos >= firstTop) {
			$.each(sections, function (_, id) {
				var $section = $('#' + id);
				if ($section.length) {
					var top = $section.offset().top;
					var bottom = top + $section.outerHeight();

					if (scrollPos >= top && scrollPos < bottom) {
						activeSection = id;
					}
				}
			});
		}

		$bottomNav.find('.bottom-navbar__item').removeClass('bottom-navbar__item--active');
		if (activeSection) {
			$bottomNav.find('[data-section="' + activeSection + '"]').addClass('bottom-navbar__item--active');
		}
	}

	// smooth scroll event for anchor links
	$('a[href^="#"]').on('click', function (e) {
		var href = $(this).attr('href');
		if (href && href.length > 1 && href.startsWith('#')) {
			var $target = $(href);
			if ($target.length) {
				e.preventDefault();
				if (typeof lenis !== 'undefined' && lenis) {
					lenis.scrollTo($target[0], { offset: -40, duration: 1.2 });
				} else {
					gsap.to(window, {
						duration: 1,
						scrollTo: { y: $target.offset().top - 40, autoKill: true },
						ease: 'power3.inOut'
					});
				}
			}
		}
	});

	// updating hero digital clock
	function updateHeroClock() {
		var now = new Date();

		var hours = String(now.getHours()).padStart(2, '0');
		var minutes = String(now.getMinutes()).padStart(2, '0');
		var seconds = String(now.getSeconds()).padStart(2, '0');
		var timeStr = hours + ':' + minutes + ':' + seconds;

		var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
		var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		var dayName = days[now.getDay()];
		var monthStr = months[now.getMonth()];
		var dateNum = String(now.getDate()).padStart(2, '0');
		var dateStr = dayName + ', ' + monthStr + ' ' + dateNum;

		$heroClock.text(timeStr);
		$heroDate.text(dateStr);
	}

	// Start clock
	updateHeroClock();
	setInterval(updateHeroClock, 1000);

	// GSAP-powered scroll reveal (replaces old IntersectionObserver)
	function initScrollReveal() {
		// Mark all scroll-reveal items as visible since GSAP handles animations now
		$('.scroll-reveal').addClass('is-visible');
	}

	// animating stat numbers
	function animateCounter($el, end, suffix) {
		if ($el.data('counted')) return;
		$el.data('counted', true);

		var frames = 60;
		var step = end / frames;
		var current = 0;

		var interval = setInterval(function () {
			current += step;
			if (current >= end) {
				current = end;
				clearInterval(interval);
			}
			$el.text(Math.floor(current) + suffix);
		}, COUNTER_DURATION / frames);
	}

	// triggering counters with GSAP ScrollTrigger — fires when stats are actually visible
	function initStatCounters() {
		ScrollTrigger.create({
			trigger: '.about__stats',
			start: 'top bottom-=' + anim.triggerOffset + 'px',
			onEnter: function () {
				animateCounter($('#stat-years'), 5, '+');
				animateCounter($('#stat-projects'), 50, '+');
			},
			once: true
		});
	}

	// submitting contact form and validating inputs
	$contactForm.on('submit', function (e) {
		e.preventDefault();

		var $btn = $('#contact-submit');
		var name = $.trim($('#contact-name').val());
		var email = $.trim($('#contact-email').val());
		var message = $.trim($('#contact-message').val());

		// Basic validation
		if (!name || !email || !message) {
			shakeElement($btn);
			return;
		}

		// Simulate submission
		var originalText = $btn.text();
		$btn.text('Sending...').prop('disabled', true).css('opacity', '0.7');

		setTimeout(function () {
			$btn.text('Message Sent ✓').css({
				'background': 'linear-gradient(to right, #7de9ff, #1ad0eb)',
				'opacity': '1'
			});

			// Reset form
			$contactForm[0].reset();

			// Restore button after delay
			setTimeout(function () {
				$btn.text(originalText).prop('disabled', false).css({
					'background': 'linear-gradient(to right, var(--primary), var(--primary-container))',
					'opacity': '1'
				});
			}, 3000);
		}, 1500);
	});

	// shake animation for form errors (GSAP powered)
	function shakeElement($el) {
		gsap.to($el[0], {
			x: -8,
			duration: 0.08,
			yoyo: true,
			repeat: 5,
			ease: 'power2.inOut',
			onComplete: function () {
				gsap.set($el[0], { x: 0 });
			}
		});
	}

	// binding scroll events
	var scrollTicking = false;

	$window.on('scroll', function () {
		if (!scrollTicking) {
			window.requestAnimationFrame(function () {
				handleNavScroll();
				updateMobileNav();
				scrollTicking = false;
			});
			scrollTicking = true;
		}
	});

	// ══════════════════════════════════════════════════════════
	// INITIALIZATION
	// ══════════════════════════════════════════════════════════

	function init() {
		handleNavScroll();
		initScrollReveal();
		initStatCounters();
		updateMobileNav();

		// GSAP ScrollTrigger Animations
		initHeroAnimations();
		initAboutAnimations();
		initTechStackAnimations();
		initServicesAnimations();
		initProjectsAnimations();
		initTerminalAnimations();
		initContactAnimations();
		initSectionTransitions();
		initMagneticElements();

		// Refresh ScrollTrigger after all animations are set
		// Use a small delay to ensure DOM is fully laid out (critical on mobile)
		setTimeout(function() {
			ScrollTrigger.refresh();
		}, 100);
	}

	init();

	// Refresh ScrollTrigger on window resize for responsiveness
	// Also recalculate animation values on orientation change
	var resizeTimer;
	$window.on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			// Recalculate device type
			isMobile = window.innerWidth < 768;
			isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
			isSmallScreen = window.innerWidth < 1024;
			anim = getAnimValues();
			ScrollTrigger.refresh();
		}, 250);
	});

});
