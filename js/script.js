// main portfolio script — GSAP ScrollTrigger powered

$(function () {

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
				scrub: 1.2,
				toggleActions: 'play none none reverse'
			}
		});

		heroTl
			.to('.hero__title', {
				y: -120,
				opacity: 0,
				scale: 0.85,
				filter: 'blur(10px)',
				ease: 'none'
			}, 0)
			.to('.hero__subtitle', {
				y: -80,
				opacity: 0,
				ease: 'none'
			}, 0)
			.to('.hero__actions', {
				y: -60,
				opacity: 0,
				ease: 'none'
			}, 0.05)
			.to('.hero__clock-container', {
				y: -100,
				opacity: 0,
				x: 50,
				rotation: 5,
				ease: 'none'
			}, 0);

		// Background orbs parallax
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

	// ══════════════════════════════════════════════════════════
	// 2. ABOUT SECTION — Split reveal with stagger
	// ══════════════════════════════════════════════════════════

	function initAboutAnimations() {
		// Image wrapper — slides from left with rotation
		gsap.from('.about__image-wrapper', {
			x: -100,
			opacity: 0,
			rotation: -5,
			scale: 0.9,
			duration: 1.2,
			ease: backEase,
			scrollTrigger: {
				trigger: '.about__image-wrapper',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Image glow pulse animation
		gsap.fromTo('.about__image-glow', {
			scale: 0.8,
			opacity: 0
		}, {
			scale: 1,
			opacity: 0.5,
			duration: 1.5,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.about__image-wrapper',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// About text content — slides from right independently
		var aboutContent = document.querySelector('.about__grid');
		if (aboutContent) {
			var textElements = aboutContent.querySelectorAll('.about__heading, .about__text, .about__stats');
			
			textElements.forEach(function(el) {
				gsap.from(el, {
					y: 50, // Added vertical bounding from bottom as requested
					x: 30, // Still slides slightly from right
					opacity: 0,
					duration: 1,
					ease: smoothEase,
					scrollTrigger: {
						trigger: el,
						start: 'top 85%',
						toggleActions: 'play none none reverse'
					}
				});
			});
		}

		// Stats — independent count up with scale bounce
		var stats = document.querySelectorAll('.about__stat');
		stats.forEach(function(stat) {
			gsap.from(stat, {
				scale: 0,
				opacity: 0,
				y: 30,
				duration: 0.8,
				ease: elasticEase,
				scrollTrigger: {
					trigger: stat,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});
	}

	// ══════════════════════════════════════════════════════════
	// 3. TECH STACK — Bento grid cinematic entrance
	// ══════════════════════════════════════════════════════════

	function initTechStackAnimations() {
		// Section header — text reveal
		gsap.from('.tech-stack__header', {
			y: 60,
			opacity: 0,
			duration: 1,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.tech-stack__header',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Bento cards — independent 2D entrance for smooth, snappy mobile scrolling
		var bentoCards = document.querySelectorAll('.bento-card');
		bentoCards.forEach(function(card) {
			gsap.from(card, {
				y: 100,
				opacity: 0,
				scale: 0.95,
				duration: 0.8,
				ease: 'back.out(1.2)',
				scrollTrigger: {
					trigger: card,
					start: 'top 90%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Tech chips are visible by default — they animate naturally with their parent bento cards
		// No separate chip animation needed (was causing invisible state due to parent opacity conflict)
	}

	// ══════════════════════════════════════════════════════════
	// 4. SERVICES — Card fan entrance
	// ══════════════════════════════════════════════════════════

	function initServicesAnimations() {
		// Section header
		gsap.from('.services__header', {
			y: 50,
			opacity: 0,
			duration: 1,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.services__header',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Divider line grows from left
		gsap.from('.services__divider', {
			scaleX: 0,
			transformOrigin: 'left center',
			duration: 1.2,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.services__header',
				start: 'top 75%',
				toggleActions: 'play none none reverse'
			}
		});

		// Service cards — independent slide up straight from bottom
		var serviceCards = document.querySelectorAll('.service-card');
		serviceCards.forEach(function (card, i) {
			gsap.from(card, {
				y: 120,
				opacity: 0,
				scale: 0.95,
				duration: 0.8,
				ease: 'back.out(1.2)',
				scrollTrigger: {
					trigger: card,
					start: 'top 90%',
					toggleActions: 'play none none reverse'
				}
			});

			// Service card icon — bounce in
			var icon = card.querySelector('.service-card__icon-wrap');
			if (icon) {
				gsap.from(icon, {
					scale: 0,
					rotation: -180,
					duration: 0.8,
					ease: elasticEase,
					scrollTrigger: {
						trigger: card,
						start: 'top 90%',
						toggleActions: 'play none none reverse'
					}
				});
			}
		});
	}

	// ══════════════════════════════════════════════════════════
	// 5. PROJECTS — Cinematic horizontal reveal
	// ══════════════════════════════════════════════════════════

	function initProjectsAnimations() {
		// Section title
		gsap.from('.projects__title', {
			y: 40,
			opacity: 0,
			letterSpacing: '0.3em',
			duration: 1,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.projects__title',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Project cards — alternating slide directions
		var projectCards = document.querySelectorAll('.project-card');
		projectCards.forEach(function (card, i) {
			var direction = i % 2 === 0 ? -1 : 1;

			gsap.from(card, {
				x: 120 * direction,
				opacity: 0,
				scale: 0.9,
				rotation: 3 * direction,
				duration: 1.2,
				ease: smoothEase,
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					end: 'top 40%',
					toggleActions: 'play none none reverse'
				}
			});

			// Image parallax inside cards
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

			// Project tags — pop in per card
			var tags = card.querySelectorAll('.project-tag');
			if (tags.length > 0) {
				gsap.from(tags, {
					scale: 0,
					opacity: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: backEase,
					scrollTrigger: {
						trigger: card,
						start: 'top 80%',
						toggleActions: 'play none none reverse'
					}
				});
			}
		});
	}

	// ══════════════════════════════════════════════════════════
	// 6. TERMINAL — Code editor cinematic reveal
	// ══════════════════════════════════════════════════════════

	function initTerminalAnimations() {
		// Terminal frame — scale + rotation entrance
		gsap.from('.terminal__frame', {
			y: 80,
			opacity: 0,
			scale: 0.85,
			rotationX: 10,
			transformOrigin: 'center bottom',
			duration: 1.2,
			ease: backEase,
			scrollTrigger: {
				trigger: '.terminal__frame',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Terminal dots — sequential pop
		gsap.from('.terminal__dot', {
			scale: 0,
			duration: 0.4,
			stagger: 0.1,
			ease: elasticEase,
			scrollTrigger: {
				trigger: '.terminal__frame',
				start: 'top 70%',
				toggleActions: 'play none none reverse'
			}
		});

		// Terminal code — typewriter-style line reveal
		gsap.from('.terminal__code', {
			clipPath: 'inset(0 0 100% 0)',
			duration: 1.5,
			ease: 'power2.inOut',
			scrollTrigger: {
				trigger: '.terminal__frame',
				start: 'top 65%',
				toggleActions: 'play none none reverse'
			}
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
			scrollTrigger: {
				trigger: '.contact__heading',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Contact info — slide from left independently
		var contactInfo = document.querySelector('.contact__grid > .scroll-reveal');
		if (contactInfo) {
			gsap.from(contactInfo, {
				y: 50, // Added vertical bounding
				x: -40,
				opacity: 0,
				duration: 1,
				ease: smoothEase,
				scrollTrigger: {
					trigger: contactInfo,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		}

		// Contact form — slide from right independently
		gsap.from('.contact-form', {
			y: 50, // Added vertical bounding
			x: 40,
			opacity: 0,
			duration: 1,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Contact heading — text reveal
		gsap.from('.contact__heading', {
			y: 40,
			opacity: 0,
			clipPath: 'inset(100% 0 0 0)',
			duration: 1,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.contact__heading',
				start: 'top 85%',
				toggleActions: 'play none none reverse'
			}
		});

		// Contact info items — independent
		var infoItems = document.querySelectorAll('.contact__info-item');
		infoItems.forEach(function(item) {
			gsap.from(item, {
				x: -40,
				opacity: 0,
				duration: 0.8,
				ease: smoothEase,
				scrollTrigger: {
					trigger: item,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				}
			});
		});

		// Contact info icons animate naturally with their parent .contact__info-item
		// (Separate icon animation was causing opacity:0 conflict with parent)

		// Social links animate naturally with the parent contact slide
		// (Separate scale:0 animation was keeping them invisible)

		// Form groups — cascade slide up
		gsap.from('.form-group', {
			y: 40,
			opacity: 0,
			duration: 0.8,
			stagger: 0.12,
			ease: smoothEase,
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		// Submit button — scale entrance
		gsap.from('.btn--cta', {
			scale: 0.8,
			opacity: 0,
			y: 20,
			duration: 0.8,
			ease: backEase,
			scrollTrigger: {
				trigger: '.contact-form',
				start: 'top 65%',
				toggleActions: 'play none none reverse'
			}
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

		if (scrollPos > 500) {
			$scrollToTop.addClass('scroll-to-top--visible');
		} else {
			$scrollToTop.removeClass('scroll-to-top--visible');
		}
	}

	// highlighting mobile nav based on scroll
	function updateMobileNav() {
		var scrollPos = $window.scrollTop() + $window.height() / 3;
		var sections = ['work', 'tech', 'experience', 'contact'];

		$.each(sections, function (_, id) {
			var $section = $('#' + id);
			if ($section.length) {
				var top = $section.offset().top;
				var bottom = top + $section.outerHeight();

				if (scrollPos >= top && scrollPos < bottom) {
					$bottomNav.find('.bottom-navbar__item').removeClass('bottom-navbar__item--active');
					$bottomNav.find('[data-section="' + id + '"]').addClass('bottom-navbar__item--active');
				}
			}
		});
	}

	// smooth scroll event for anchor links
	$('a[href^="#"]').on('click', function (e) {
		var target = $(this.getAttribute('href'));
		if (target.length) {
			e.preventDefault();
			gsap.to(window, {
				duration: 1,
				scrollTo: { y: target.offset().top - 40, autoKill: false },
				ease: 'power3.inOut'
			});
		}
	});

	// scroll to top button click handler
	$scrollToTop.on('click', function () {
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: 0, autoKill: false },
			ease: 'power3.inOut'
		});
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
			start: 'top 85%',
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

	// scroll to top action
	$scrollToTop.on('click', function () {
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: 0, autoKill: false },
			ease: 'power3.inOut'
		});
		// jQuery fallback
		$('html, body').animate({
			scrollTop: 0
		}, 800, 'swing');
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
		ScrollTrigger.refresh();
	}

	init();

	// Refresh ScrollTrigger on window resize for responsiveness
	var resizeTimer;
	$window.on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			ScrollTrigger.refresh();
		}, 250);
	});

});
