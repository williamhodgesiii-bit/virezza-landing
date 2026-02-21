// MOBILE MENU TOGGLE
  function toggleMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    var ham  = document.getElementById('hamburger');
    if (!menu) return;
    menu.classList.toggle('is-open');
    ham.classList.toggle('is-open');
  }

  // Close mobile menu on outside click
  document.addEventListener('click', function(e) {
    var menu = document.getElementById('mobile-menu');
    var ham  = document.getElementById('hamburger');
    if (!menu || !menu.classList.contains('is-open')) return;
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      menu.classList.remove('is-open');
      ham.classList.remove('is-open');
    }
  });

// Virezza scripts
  // SUPABASE
  var sbClient = window.supabase.createClient(
    'https://rnevtptdxzbkbtotjszj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZXZ0cHRkeHpia2J0b3Rqc3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTk4NzQsImV4cCI6MjA4NzA5NTg3NH0.n4v_n_3qd95ADxpnJ7aK9QtVDEa7E_680BASxerzM4Y'
  );

  // PAGE SWITCHING
  function showPage(page, scrollTo) {
    document.getElementById('home-page').style.display  = (page === 'home')  ? 'block' : 'none';
    document.getElementById('about-page').style.display = (page === 'about') ? 'block' : 'none';
    if (scrollTo) {
      setTimeout(function() {
        var el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // CONTACT MODAL
  function openContact() {
    document.getElementById('contact-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeContact() {
    document.getElementById('contact-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
  function handleOverlayClick(e) {
    if (e.target === document.getElementById('contact-modal')) closeContact();
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeContact();
  });

  async function handleContact(e) {
    e.preventDefault();
    var name    = document.getElementById('contact-name').value;
    var email   = document.getElementById('contact-email').value;
    var message = document.getElementById('contact-message').value;

    var btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      var res = await fetch('https://formspree.io/f/xqeddwyk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message })
      });

      if (res.ok) {
        document.getElementById('contact-form-wrap').style.display = 'none';
        document.getElementById('contact-success').style.display = 'flex';
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      alert('Something went wrong. Please try again.');
    }
  }

  // EMAIL SIGNUP
  async function handleSignup(e) {
    e.preventDefault();
    var email = document.getElementById('email-input').value;
    if (!email) return;

    var btn = document.querySelector('#signup-form button');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    var result = await sbClient.from('signups').insert({ email: email });

    if (result.error) {
      btn.disabled = false;
      btn.textContent = 'Get Early Access';
      alert('Oops! Something went wrong. Please try again.');
      console.error('Supabase error:', result.error.message);
      return;
    }

    document.getElementById('signup-form').style.display = 'none';
    var successEl = document.getElementById('success-msg');
    successEl.style.display = 'flex';
    // Mint pulse effect
    successEl.classList.remove('pulsing');
    void successEl.offsetWidth; // reflow to restart animation
    successEl.classList.add('pulsing');
  }

  // COUNT-UP ANIMATION
  function animateCount(el, target, duration) {
    var start = 0;
    var step = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function() {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  // SCROLL OBSERVER for count-up
  var countTriggered = false;
  var signupSection = document.getElementById('signup');
  if (signupSection) {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !countTriggered) {
        countTriggered = true;
        var el = document.getElementById('fan-count');
        if (el) animateCount(el, 1284, 1400);
      }
    }, { threshold: 0.3 });
    observer.observe(signupSection);
  }

  // TYPING MICRO-INTERACTION
  var emailInput = document.getElementById('email-input');
  var emailForm  = document.getElementById('signup-form');
  if (emailInput && emailForm) {
    emailInput.addEventListener('input', function() {
      if (emailInput.value.length > 0) {
        emailForm.classList.add('typing');
      } else {
        emailForm.classList.remove('typing');
      }
    });
  }

  // WHAT-IF FADE IN
  var whatifEl = document.getElementById('whatif-block');
  if (whatifEl) {
    var whatifObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        whatifEl.classList.add('in-view');
        whatifObs.disconnect();
      }
    }, { threshold: 0.15 });
    whatifObs.observe(whatifEl);
  }

  // CHANGE 2 — gently update ticker value every ~12s so it feels live
  (function() {
    var ticker = document.querySelector('.card-ticker');
    if (!ticker) return;
    var vals = ['+0.8%', '+1.2%', '+1.5%', '+0.6%', '+2.1%', '+1.9%'];
    var i = 1;
    setInterval(function() {
      ticker.style.transition = 'opacity 0.4s';
      ticker.style.opacity = '0';
      setTimeout(function() {
        if (!ticker) return;
        ticker.textContent = vals[i % vals.length] + ' in the last hour';
        ticker.style.opacity = '0.7';
        i++;
      }, 420);
    }, 12000);
  })();
