(function () {
    "use strict";

    const ADS = {
        desktop: {
            key: "868b4c8c4ebdbfe51d6251096e84b3c1",
            width: 728,
            height: 90,
            selector: ".adsterra-desktop"
        },

        mobile: {
            key: "b5d41c22f9f42b8c22a854697d3be912",
            width: 300,
            height: 250,
            selector: ".adsterra-mobile"
        }
    };

    function loadAd(slot, config) {

        if (!slot || slot.dataset.adLoaded === "true") {
            return;
        }

        slot.dataset.adLoaded = "true";

        const options = document.createElement("script");

        options.type = "text/javascript";

        options.textContent = `
            atOptions = {
                'key': '${config.key}',
                'format': 'iframe',
                'height': ${config.height},
                'width': ${config.width},
                'params': {}
            };
        `;

        const script = document.createElement("script");

        script.type = "text/javascript";

        script.src =
            "https://inefficientinherent.com/" +
            config.key +
            "/invoke.js";

        script.async = true;

        script.onerror = function () {

            console.error(
                "Adsterra script failed to load:",
                config.key
            );

            slot.dataset.adLoaded = "false";

        };

        slot.appendChild(options);

        slot.appendChild(script);
    }

    function initializeAds() {

        const isMobile = window.matchMedia(
            "(max-width: 760px)"
        ).matches;

        const config = isMobile
            ? ADS.mobile
            : ADS.desktop;

        document.querySelectorAll(
            config.selector
        ).forEach(function (slot) {

            loadAd(slot, config);

        });
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAds
        );

    } else {

        initializeAds();

    }

})();
