// Script mejorado para inicializar Prism.js
(function() {
  'use strict';
  
  function initializePrism() {
    // Verificar que Prism esté disponible
    if (typeof Prism === 'undefined') {
      // Intentar de nuevo en 100ms si Prism no está listo
      setTimeout(initializePrism, 100);
      return;
    }
    
    // Agregar clases de lenguaje a bloques sin especificar
    document.querySelectorAll('pre code').forEach(function(codeBlock) {
      const pre = codeBlock.parentElement;
      if (!pre.className.includes('language-')) {
        pre.classList.add('language-javascript');
        codeBlock.classList.add('language-javascript');
      }
    });
    
    // Configurar autoloader para cargar lenguajes automáticamente
    if (Prism.plugins && Prism.plugins.autoloader) {
      Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
    }
    
    // Aplicar highlighting
    Prism.highlightAll();
  }
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePrism);
  } else {
    initializePrism();
  }
  
  // Re-aplicar highlighting cuando cambia el tema
  document.addEventListener('themeChanged', function() {
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  });
  
  // Observer para nuevos elementos de código
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function() {
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
