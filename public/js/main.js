document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  const modal = document.querySelector('.modal');
  const signUpBtn = document.querySelector('#home-banner a');
  const modalCloseBtn = document.querySelector('.modal-close');
  const html = document.querySelector('html');
  const notification = document.querySelector('.notification');

  // Check if there are any navbar burgers
  if (navbarBurgers.length > 0) {
    // Add a click event on each of them
    navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
  if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
      modal.classList.toggle('is-active');
      html.classList.toggle('is-clipped');
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.toggle('is-active');
      html.classList.toggle('is-clipped');
    });
  }

  if (notification) {
    notification.addEventListener('click', () => {
      notification.remove();
    });
  }
});
