(function bootstrap() {
  function activateSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');

    sections.forEach((section) => {
      section.classList.toggle('active', section.id === sectionId);
    });

    menuItems.forEach((button) => {
      const isActive = button.dataset.section === sectionId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    const activeSection = document.getElementById(sectionId);
    const sectionTitle = document.getElementById('sectionTitle');
    const sectionSubtitle = document.getElementById('sectionSubtitle');

    if (activeSection && sectionTitle && sectionSubtitle) {
      sectionTitle.textContent = activeSection.dataset.name || 'Section';
      sectionSubtitle.textContent = `Viewing ${activeSection.dataset.name || 'section'} details.`;
    }
  }

  function initApp() {
    const menu = document.getElementById('sidebarMenu');

    if (!menu) {
      console.error('Failed to initialize app: sidebar menu not found.');
      return;
    }

    menu.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const nextSection = target.dataset.section;
      if (nextSection) {
        activateSection(nextSection);
      }
    });

    activateSection('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
