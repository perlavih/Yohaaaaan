(() => {
  const portfolio = document.getElementById('portfolio-dialog');
  const browse = portfolio.querySelector('.portfolio-browse');
  const viewer = portfolio.querySelector('.portfolio-viewer');
  const fullImage = viewer.querySelector('img');
  const backButton = viewer.querySelector('.gallery-back');
  const items = [...portfolio.querySelectorAll('.portfolio-item')];
  const yearSelect = portfolio.querySelector('#portfolio-year');
  const scrollBody = portfolio.querySelector('.window-body');
  let galleryScroll = 0;
  let selectedItem = null;
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const thumbnail = item.querySelector('img');
    fullImage.src = item.dataset.fullSrc || thumbnail.src;
    fullImage.alt = thumbnail.alt;
    viewer.querySelector('figcaption').textContent = item.querySelector('span').textContent;
    viewer.querySelector('.gallery-position').textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function showGallery(restoreFocus = true) {
    browse.hidden = false;
    viewer.hidden = true;
    portfolio.classList.remove('is-viewing');
    fullImage.removeAttribute('src');
    fullImage.alt = '';
    scrollBody.scrollTop = galleryScroll;
    if (restoreFocus && selectedItem) selectedItem.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-open-dialog]').forEach((button) => {
    const dialog = document.getElementById(button.dataset.openDialog);
    button.addEventListener('click', () => {
      if (!dialog.open) dialog.showModal();
    });
  });

  document.querySelectorAll('.art-dialog').forEach((dialog) => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  });

  yearSelect.addEventListener('change', () => {
    const section = document.getElementById(yearSelect.value);
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    });
  });

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      selectedItem = item;
      galleryScroll = scrollBody.scrollTop;
      showImage(index);
      browse.hidden = true;
      viewer.hidden = false;
      portfolio.classList.add('is-viewing');
      scrollBody.scrollTop = 0;
      backButton.focus();
    });
  });

  viewer.querySelector('.gallery-previous').addEventListener('click', () => showImage(currentIndex - 1));
  viewer.querySelector('.gallery-next').addEventListener('click', () => showImage(currentIndex + 1));
  viewer.querySelector('.gallery-navigation').hidden = items.length < 2;
  portfolio.addEventListener('keydown', (event) => {
    if (viewer.hidden || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  backButton.addEventListener('click', () => showGallery());
  portfolio.addEventListener('cancel', (event) => {
    if (!viewer.hidden) {
      event.preventDefault();
      showGallery();
    }
  });
  portfolio.addEventListener('close', () => showGallery(false));
  portfolio.querySelector('.portfolio-count').textContent = `${items.length} imagens`;
})();
