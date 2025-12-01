// custom.js - Integrazione Design Italia con CKAN
document.addEventListener('DOMContentLoaded', function() {
    console.log('CKAN Design Italia - Comune di Brescia loaded');

    // Miglioramento accessibilità per elementi CKAN
    document.querySelectorAll('.dataset-item, .group-item, .organization-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'article');
    });

    // Inizializzazione componenti Design Italia su elementi CKAN
    if (typeof bootstrap !== 'undefined') {
        // Tooltip
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Dropdown
        var dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
        var dropdownList = dropdownTriggerList.map(function (dropdownTriggerEl) {
            return new bootstrap.Dropdown(dropdownTriggerEl);
        });
    }

    // Compatibilità con menu CKAN esistente
    const ckanNavigation = document.querySelector('.nav-pills');
    if (ckanNavigation) {
        ckanNavigation.classList.add('navbar-nav');
    }
});
