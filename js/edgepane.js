(function ($) {
    const edgePane = {
        config: {
            dropdownMode: "multi", // "multi" or "single"
            brand: {
                brandLogoSrc: "",
                brandName: "",
                brandTagline: "",
            },
        },

        init(options = {}) {
            // Merge user options into default config
            this.config = $.extend(true, {}, this.config, options);

            const $sidebar = $(".sidebar");
            const $overlay = $(".sidebar-overlay");
            const $toggler = $(".sidebar-toggle");
            const $mainContent = $(".main-content");
            const $dropdowns = $(".sidebar-dropdown");
            const $logo = $(".sidebar-logo");

            const SIDEBAR_STATE_KEY = "sidebar-state";
            const DROPDOWN_STATE_KEY = "sidebar-dropdowns";

            let isHoverOpen = false;

            // --- Apply brand info ---
            if (this.config.brand.brandLogoSrc) {
                $logo.attr("src", this.config.brand.brandLogoSrc);
            }
            if (this.config.brand.brandName) {
                $(".sidebar-brand-name").text(this.config.brand.brandName);
            }
            if (this.config.brand.brandTagline) {
                $(".sidebar-brand-tagline").text(
                    this.config.brand.brandTagline,
                );
            }

            // --- Set default logo size ---
            setLogoDefaultSize($logo);

            // --- Load saved sidebar state ---
            let savedState = localStorage.getItem(SIDEBAR_STATE_KEY) || "open";
            $sidebar.attr("data-state", savedState);
            updateContentShift(savedState);

            // --- Load saved dropdown states ---
            let savedDropdowns = JSON.parse(
                localStorage.getItem(DROPDOWN_STATE_KEY) || "[]",
            );
            if (this.config.dropdownMode === "multi") {
                savedDropdowns.forEach((id) => $("#" + id).addClass("open"));
            } else {
                if (savedDropdowns.length > 0) {
                    $("#" + savedDropdowns[0]).addClass("open");
                }
            }

            // --- Sidebar toggle click ---
            $toggler.on("click", function () {
                const isOpen = $sidebar.attr("data-state") === "open";
                const newState = isOpen ? "closed" : "open";
                $sidebar.attr("data-state", newState);
                localStorage.setItem(SIDEBAR_STATE_KEY, newState);
                updateContentShift(newState);

                if ($(window).width() <= 1023) {
                    $overlay.toggleClass("show", newState === "open");
                }
            });

            // --- Overlay click closes sidebar ---
            $overlay.on("click", function () {
                $sidebar.attr("data-state", "closed");
                localStorage.setItem(SIDEBAR_STATE_KEY, "closed");
                $overlay.removeClass("show");
            });

            // --- Dropdown toggle ---
            $dropdowns.each(function () {
                let $dropdown = $(this);
                let $toggle = $dropdown.find(".dropdown-toggle").first();

                $toggle.on("click", function () {
                    if (edgePane.config.dropdownMode === "single") {
                        $dropdowns.not($dropdown).removeClass("open");
                        $dropdown.toggleClass("open");
                        saveSingleDropdown();
                    } else {
                        $dropdown.toggleClass("open");
                        saveMultiDropdowns();
                    }
                });
            });

            // --- Hover to open (desktop only) ---
            $sidebar.on("mouseenter", function () {
                if (
                    $(window).width() > 1023 &&
                    $sidebar.attr("data-state") === "closed"
                ) {
                    $sidebar.attr("data-state", "open");
                    isHoverOpen = true;
                }
            });
            $sidebar.on("mouseleave", function () {
                if ($(window).width() > 1023 && isHoverOpen) {
                    $sidebar.attr("data-state", "closed");
                    isHoverOpen = false;
                }
            });

            // --- Save dropdown states ---
            function saveMultiDropdowns() {
                const openDropdowns = [];
                $dropdowns.each(function () {
                    if ($(this).hasClass("open") && $(this).attr("id")) {
                        openDropdowns.push($(this).attr("id"));
                    }
                });
                localStorage.setItem(
                    DROPDOWN_STATE_KEY,
                    JSON.stringify(openDropdowns),
                );
            }

            function saveSingleDropdown() {
                const openDropdowns = [];
                $dropdowns.each(function () {
                    if ($(this).hasClass("open") && $(this).attr("id")) {
                        openDropdowns.push($(this).attr("id"));
                    }
                });
                localStorage.setItem(
                    DROPDOWN_STATE_KEY,
                    JSON.stringify(openDropdowns),
                );
            }

            // --- Update content shift ---
            function updateContentShift(state) {
                if ($(window).width() > 1023) {
                    if (state === "open") {
                        $mainContent.addClass("shifted").removeClass("compact");
                    } else {
                        $mainContent.addClass("compact").removeClass("shifted");
                    }
                } else {
                    $mainContent.removeClass("shifted compact");
                }
            }

            // --- Default logo size helper ---
            function setLogoDefaultSize(
                $logo,
                defaultWidth = "2rem",
                defaultHeight = "2rem",
            ) {
                if (
                    !$logo.attr("style")?.includes("width") &&
                    !$logo.attr("class").match(/\bw-[^\s]+/)
                ) {
                    $logo.css("width", defaultWidth);
                }
                if (
                    !$logo.attr("style")?.includes("height") &&
                    !$logo.attr("class").match(/\bh-[^\s]+/)
                ) {
                    $logo.css("height", defaultHeight);
                }
            }

            // --- On resize adjust content shift ---
            $(window).on("resize", function () {
                updateContentShift($sidebar.attr("data-state"));
                if ($(window).width() > 1023) {
                    $overlay.removeClass("show");
                }
            });
        },
    };

    window.edgePane = edgePane;
})(jQuery);
