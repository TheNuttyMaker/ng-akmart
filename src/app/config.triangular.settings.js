(function() {
    'use strict';

    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(triSettingsProvider, triRouteProvider) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('AK Food Mart');
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' yourshopmanager.com');
        triSettingsProvider.setLogo('assets/images/logo.png');
        triSettingsProvider.setLoaderLogo('assets/images/loaderLogo.png');
        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('1.0.1');
        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('AK Food Mart');
        triRouteProvider.setSeparator('|');
    }
})();