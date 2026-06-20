// main portfolio script

$(function () {

	// configuration
	var SCROLL_THRESHOLD = 100;    // px before nav swap
	var REVEAL_OFFSET = 0.15;   // 15% visible to trigger
	var COUNTER_DURATION = 2000;  // ms for number animation

	// cache dom selectors
	var $topNavbar = $('#top-navbar');
	var $sideNavbar = $('#side-navbar');
	var $bottomNav = $('#bottom-navbar');
	var $heroClock = $('#hero-clock');
	var $heroDate = $('#hero-date');
	var $contactForm = $('#contact-form');
	var $scrollItems = $('.scroll-reveal');
	var $window = $(window);
	var $scrollToTop = $('#scroll-to-top');

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
			$('html, body').animate({
				scrollTop: target.offset().top - 40
			}, 800, 'swing');
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

	// revealing elements on scroll
	function initScrollReveal() {
		if (!('IntersectionObserver' in window)) {
			// Fallback: show all immediately
			$scrollItems.addClass('is-visible');
			return;
		}

		var observer = new IntersectionObserver(function (entries) {
			$.each(entries, function (_, entry) {
				if (entry.isIntersecting) {
					$(entry.target).addClass('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: REVEAL_OFFSET,
			rootMargin: '0px 0px -50px 0px'
		});

		$scrollItems.each(function () {
			observer.observe(this);
		});
	}

	// animating stat numbers
	function animateCounter($el, end, suffix) {
		var start = 0;
		var frames = 60;
		var step = end / frames;
		var current = start;
		var counted = false;

		if ($el.data('counted')) return;
		$el.data('counted', true);

		var interval = setInterval(function () {
			current += step;
			if (current >= end) {
				current = end;
				clearInterval(interval);
			}
			$el.text(Math.floor(current) + suffix);
		}, COUNTER_DURATION / frames);
	}

	// triggering counters
	function initStatCounters() {
		if (!('IntersectionObserver' in window)) {
			return; // Counters show static values without IO
		}

		var statsObserver = new IntersectionObserver(function (entries) {
			$.each(entries, function (_, entry) {
				if (entry.isIntersecting) {
					animateCounter($('#stat-years'), 5, '+');
					animateCounter($('#stat-projects'), 50, '+');
					statsObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		var aboutSection = document.getElementById('about');
		if (aboutSection) {
			statsObserver.observe(aboutSection);
		}
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

	// shake animation for form errors
	function shakeElement($el) {
		$el.css('transform', 'translateX(-8px)');
		setTimeout(function () { $el.css('transform', 'translateX(8px)'); }, 100);
		setTimeout(function () { $el.css('transform', 'translateX(-4px)'); }, 200);
		setTimeout(function () { $el.css('transform', 'translateX(4px)'); }, 300);
		setTimeout(function () { $el.css('transform', 'translateX(0)'); }, 400);
	}

	// glass sheen hover effect handling

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
		$('html, body').animate({
			scrollTop: 0
		}, 800, 'swing');
	});

	// initializing scripts
	function init() {
		handleNavScroll();     // Set initial nav state
		initScrollReveal();    // Set up scroll animations
		initStatCounters();    // Set up stat counter animations
		updateMobileNav();     // Set initial mobile nav state
	}

	init();

});
