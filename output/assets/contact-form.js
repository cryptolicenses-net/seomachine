/**
 * CryptoLicenses.net — Contact Form Handler
 * Works for both the main /contact/ form and CTA forms on all pages.
 * Include this script on any page that has a [data-contact-form] form.
 */
(function () {
  'use strict';

  function initForms() {
    // Handle both the named "contact" form and any [data-contact-form] forms
    const forms = document.querySelectorAll('form[name="contact"], form[data-contact-form]');

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit(form);
      });
    });
  }

  function handleSubmit(form) {
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn ? btn.textContent : '';

    // Disable button + show loading state
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    // Remove old status messages
    const oldMsg = form.querySelector('.form-status');
    if (oldMsg) oldMsg.remove();

    // Collect form data
    const data = {};
    new FormData(form).forEach(function (val, key) {
      data[key] = val;
    });

    // Attach source URL
    data.page_url = window.location.href;

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          showMessage(form, 'success',
            '✓ Thank you for your request! We will reply in a few hours (during workdays).');
          form.reset();
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      })
      .catch(function (err) {
        console.error('Form error:', err);
        showMessage(form, 'error',
          'Something went wrong. Please email us directly: info@cryptolicenses.net');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      });
  }

  function showMessage(form, type, text) {
    const msg = document.createElement('div');
    msg.className = 'form-status form-status--' + type;
    msg.style.cssText = [
      'margin-top:16px',
      'padding:12px 16px',
      'font-size:.85rem',
      'font-weight:600',
      'border:2px solid',
      type === 'success'
        ? 'border-color:#2d6a4f;color:#2d6a4f;background:#d8f3dc'
        : 'border-color:#9d0208;color:#9d0208;background:#ffeae8',
    ].join(';');
    msg.textContent = text;
    form.appendChild(msg);

    if (type === 'success') {
      setTimeout(function () { msg.remove(); }, 8000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
