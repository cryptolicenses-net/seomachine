/**
 * CryptoLicenses.net — self-contained contact form handler.
 * Include on any page with a form[name="contact"] or form[data-contact-form].
 * - Ensures the Cloudflare Turnstile script is loaded.
 * - Injects a Turnstile widget into each form if one is not already present.
 * - Submits via AJAX to /api/contact (Resend + Telegram) with the captcha token.
 * - Shows a styled inline status message (no alert()).
 * Safe to include alongside a pre-existing widget — it never duplicates.
 */
(function () {
  'use strict';

  var SITEKEY = '0x4AAAAAADSozv_Cijq9nDuu';
  var TS_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

  function ensureWidget(form) {
    if (form.querySelector('.cf-turnstile')) return;
    var div = document.createElement('div');
    div.className = 'cf-turnstile';
    div.setAttribute('data-sitekey', SITEKEY);
    div.style.cssText = 'margin:1rem 0';
    var btn = form.querySelector('[type="submit"]');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(div, btn);
    else form.appendChild(div);
  }

  function ensureTurnstileScript() {
    if (document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) return;
    var s = document.createElement('script');
    s.src = TS_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  function showMessage(form, type, text) {
    var old = form.querySelector('.form-status');
    if (old) old.remove();
    var msg = document.createElement('div');
    msg.className = 'form-status form-status--' + type;
    msg.style.cssText = [
      'margin-top:16px', 'padding:12px 16px', 'font-size:.9rem', 'font-weight:600', 'border:2px solid',
      type === 'success'
        ? 'border-color:#1a7a3a;color:#1a7a3a;background:#d8f3dc'
        : 'border-color:#9d0208;color:#9d0208;background:#ffeae8',
    ].join(';');
    msg.textContent = text;
    form.appendChild(msg);
    if (type === 'success') setTimeout(function () { try { msg.remove(); } catch (e) {} }, 9000);
  }

  function attach(form) {
    if (form.__clBound) return;
    form.__clBound = true;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.page_url = location.href;
      if (document.referrer) data.referrer = document.referrer;

      function fail(text) {
        if (btn) { btn.disabled = false; btn.textContent = orig; }
        if (window.turnstile) { try { window.turnstile.reset(); } catch (_) {} }
        showMessage(form, 'error', text);
      }

      if (!data['cf-turnstile-response']) {
        fail('Please complete the captcha (the “I’m not a robot” check) and try again.');
        return;
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
        .then(function (res) {
          if (res && res.success) {
            showMessage(form, 'success', '✓ Thank you — your enquiry has been received. We will reply within one business day.');
            form.reset();
            if (window.turnstile) { try { window.turnstile.reset(); } catch (_) {} }
          } else {
            var err = (res && res.error) || '';
            if (/captcha/i.test(err)) {
              fail('Captcha check failed. Please tick the captcha again and resubmit.');
            } else if (err) {
              // Surface the real server message instead of a generic mask so users
              // can actually fix their input (missing email, invalid format, etc.).
              fail(err + ' If the problem persists, email us directly: info@cryptolicenses.net');
            } else {
              fail('Something went wrong. Please email us directly: info@cryptolicenses.net');
            }
          }
        })
        .catch(function () {
          fail('Network error. Please email us directly: info@cryptolicenses.net');
        });
    });
  }

  function init() {
    var forms = document.querySelectorAll('form[name="contact"], form[data-contact-form]');
    if (!forms.length) return;
    forms.forEach(function (f) { ensureWidget(f); attach(f); });
    ensureTurnstileScript();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
