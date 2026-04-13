/* ================================================================
   SchoolPro — Registration Form JavaScript
   Features: Validation, Progress, Smooth UX
   ================================================================ */

(function () {
  'use strict';

  // ================================
  // DOM References
  // ================================
  const form = document.getElementById('registration-form');
  const btnSubmit = document.getElementById('btn-submit');
  const successState = document.getElementById('success-state');
  const formIntro = document.getElementById('form-intro');

  // ================================
  // Progress Bar
  // ================================
  const progressBar = document.createElement('div');
  progressBar.className = 'form-progress';
  progressBar.style.width = '0%';
  document.body.prepend(progressBar);

  function updateProgress() {
    const allRequired = form.querySelectorAll('[required]');
    let filled = 0;

    allRequired.forEach(function (field) {
      if (field.value && field.value.trim() !== '') {
        filled++;
      }
    });

    const percentage = allRequired.length > 0 ? (filled / allRequired.length) * 100 : 0;
    progressBar.style.width = percentage + '%';
  }

  // Listen for input changes to update progress
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);

  // ================================
  // Slug field — auto-format
  // ================================
  const slugField = document.getElementById('slug_sekolah');
  if (slugField) {
    slugField.addEventListener('input', function () {
      this.value = this.value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/--+/g, '-');
    });
  }

  // ================================
  // Phone fields — numeric only
  // ================================
  const phoneFields = ['telepon_sekolah', 'whatsapp_pic'];
  phoneFields.forEach(function (id) {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
      });
    }
  });

  // ================================
  // Validation
  // ================================
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    // Remove previous error
    group.classList.remove('error');
    const existingError = group.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Check required
    if (field.hasAttribute('required') && (!field.value || field.value.trim() === '')) {
      showError(group, 'Wajib diisi');
      return false;
    }

    // Check email
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        showError(group, 'Format email tidak valid');
        return false;
      }
    }

    // Check URL
    if (field.type === 'url' && field.value) {
      try {
        new URL(field.value);
      } catch (e) {
        showError(group, 'Format URL tidak valid');
        return false;
      }
    }

    return true;
  }

  function showError(group, message) {
    group.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    group.appendChild(errorEl);
  }

  // Real-time validation on blur
  const allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(function (input) {
    input.addEventListener('blur', function () {
      validateField(this);
    });

    // Clear error on focus
    input.addEventListener('focus', function () {
      const group = this.closest('.form-group');
      if (group) {
        group.classList.remove('error');
        const error = group.querySelector('.error-message');
        if (error) error.remove();
      }
    });
  });

  // ================================
  // Form Submission
  // ================================
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all required fields
    let isValid = true;
    let firstError = null;

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
        if (!firstError) firstError = field;
      }
    });

    if (!isValid) {
      // Scroll to first error
      if (firstError) {
        const group = firstError.closest('.form-group');
        if (group) {
          group.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });

    // Add metadata
    data._submitted_at = new Date().toISOString();
    data._user_agent = navigator.userAgent;

    // Loading state
    btnSubmit.classList.add('loading');

    // Simulate submission (replace with actual API call)
    setTimeout(function () {
      // Log data to console (for development)
      console.log('📋 Form Data:', data);

      // Show success
      form.style.display = 'none';
      formIntro.style.display = 'none';
      successState.hidden = false;

      // Update progress to 100%
      progressBar.style.width = '100%';

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      btnSubmit.classList.remove('loading');
    }, 1800);
  });

  // ================================
  // Intersection Observer — Animate sections on scroll
  // ================================
  const sections = document.querySelectorAll('.form-section');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    // Fallback: show all sections immediately
    sections.forEach(function (section) {
      section.style.opacity = '1';
    });
  }

  // ================================
  // Initial progress check
  // ================================
  updateProgress();

})();
