// custom.js - Integrazione Design Italia con CKAN - Versione Migliorata
(function() {
    'use strict';
    
    function initBresciaOpenData() {
        console.log('CKAN Design Italia - Comune di Brescia loaded');

        // Verifica che Bootstrap sia caricato
        if (typeof bootstrap === 'undefined') {
            console.warn('Bootstrap non ancora caricato, retry tra 200ms...');
            setTimeout(initBresciaOpenData, 200);
            return;
        }

        // Miglioramento accessibilità per elementi CKAN
        document.querySelectorAll('.dataset-item, .group-item, .organization-item').forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'article');
        });

        // Inizializzazione Dropdown
        const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(el => {
            try {
                new bootstrap.Dropdown(el);
            } catch(e) {
                console.warn('Errore inizializzazione dropdown:', e);
            }
        });

        // Inizializzazione Collapse (per menu mobile)
        const collapses = document.querySelectorAll('[data-bs-toggle="collapse"]');
        collapses.forEach(el => {
            try {
                new bootstrap.Collapse(el, { toggle: false });
            } catch(e) {
                console.warn('Errore inizializzazione collapse:', e);
            }
        });

        // Inizializzazione Tooltip
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(el => {
            try {
                new bootstrap.Tooltip(el);
            } catch(e) {
                console.warn('Errore inizializzazione tooltip:', e);
            }
        });

        // Compatibilità con menu CKAN esistente
        const ckanNavigation = document.querySelector('.nav-pills');
        if (ckanNavigation) {
            ckanNavigation.classList.add('navbar-nav');
        }

        // Fix per navbar toggler su mobile
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('data-bs-target'));
                if (target) {
                    target.classList.toggle('show');
                }
            });
        }

        console.log('Inizializzazione Design Italia completata');
    }

    // Attendi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBresciaOpenData);
    } else {
        initBresciaOpenData();
    }
})();