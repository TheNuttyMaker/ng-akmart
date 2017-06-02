(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triSettings', settingsProvider);

    /* @ngInject */
    function settingsProvider() {
        // Provider
        var settings = {
            languages: [],
            name: '',
            logo: '',
            loaderLogo: '',
            copyright: '',
            version: ''
        };

        this.addLanguage = addLanguage;
        this.setLogo = setLogo;
        this.setLoaderLogo = setLoaderLogo;
        this.setName = setName;
        this.setCopyright = setCopyright;
        this.setVersion = setVersion;

        function addLanguage(newLanguage) {
            settings.languages.push(newLanguage);
        }

        function setLogo(logo) {
            settings.logo = logo;
        }

        function setLoaderLogo(loaderLogo) {
            settings.loaderLogo = loaderLogo;
        }

        function setName(name) {
            settings.name = name;
        }

        function setCopyright(copy) {
            settings.copyright = copy;
        }

        function setVersion(version) {
            settings.version = version;
        }

        // Service
        this.$get = function() {
            return {
                languages: settings.languages,
                name: settings.name,
                copyright: settings.copyright,
                logo: settings.logo,
                loaderLogo: settings.loaderLogo,
                version: settings.version,
                defaultSkin: settings.defaultSkin
            };
        };
    }
})();