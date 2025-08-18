(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], factory);
    } else if (typeof exports === "object" && typeof module === "object") {
        // CommonJS / Node
        module.exports = factory(require("jquery"));
    } else {
        // Browser global
        root.edgePane = factory(root.jQuery);
    }
})(this, function ($) {
    "use strict";

    const edgePane = {
        config: {
            dropdownMode: "multi", // "multi" or "single"
            sidebarState: "open", // "open" | "closed"
            hoverExpand: true,
            closeOnClickOutside: true,
            rememberDropdowns: true,
            sidebarColor: "#059669",
            fontFamily: "'Montserrat', sans-serif",
            sidebarWidth: "16rem",
            textColor: "#fff",
            activeLinkBg: "rgba(255,255,255,0.7)",
            activeLinkColor: "rgba(5,150,105,1)",
            showBrand: true,
            brand: {
                brandLogoSrc: "",
                brandName: "",
                brandTagline: "",
            },
            onSidebarToggle: function (state) {},
            onDropdownToggle: function (id, isOpen) {},
        },

        init(userOptions = {}) {
            // Merge user options
            this.config = $.extend(true, {}, this.config, userOptions);

            const $sidebar = $(".sidebar");
            const $overlay = $(".sidebar-overlay");
            const $toggler = $(".sidebar-toggle");
            const $mainContent = $(".main-content");
            const $dropdowns = $(".sidebar-dropdown");
            const $logo = $(".sidebar-logo");
            const $brandHeader = $(".sidebar-header");

            const SIDEBAR_STATE_KEY = "sidebar-state";
            const DROPDOWN_STATE_KEY = "sidebar-dropdowns";
            const ACTIVE_LINK_KEY = "active-link-key";

            let isHoverOpen = false;

            // --- Active link save on click ---
            $(document).on("click", ".sidebar-link", function () {
                const text = $(this).find(".sidebar-link-text").text().trim();
                localStorage.setItem(ACTIVE_LINK_KEY, text);

                $(".sidebar-link").removeClass("active");
                $(this).addClass("active");
            });

            // --- Active link restore ---
            (function restoreActiveLink() {
                const saved = localStorage.getItem(ACTIVE_LINK_KEY);

                const $match = $(".sidebar-link").filter(function () {
                    return (
                        $(this).find(".sidebar-link-text").text().trim() ===
                        saved
                    );
                });

                $(".sidebar-link").removeClass("active");

                ($match.length ? $match : $(".sidebar-link").first()).addClass(
                    "active",
                );
            })();

            // Apply dynamic open width
            $(":root").css("--sidebar-width-open", this.config.sidebarWidth);

            // Apply configurable CSS variables
            $(":root").css({
                "--sidebar-color": this.config.textColor,
                "--sidebar-bg-active": this.config.activeLinkBg,
                "--sidebar-color-active": this.config.activeLinkColor,
            });

            // --- Show/hide brand section ---
            if (!this.config.showBrand) {
                $brandHeader.hide();
            } else {
                $brandHeader.show();
            }

            // --- Apply brand info ---
            if (this.config.brand.brandLogoSrc)
                $logo.attr("src", this.config.brand.brandLogoSrc);
            if (this.config.brand.brandName)
                $(".sidebar-brand-name").text(this.config.brand.brandName);
            if (this.config.brand.brandTagline)
                $(".sidebar-brand-tagline").text(
                    this.config.brand.brandTagline,
                );

            // --- Apply colors and font ---
            $sidebar.css({
                background: this.config.sidebarColor,
                fontFamily: this.config.fontFamily,
            });

            // --- Load saved sidebar state ---
            let savedState = this.config.sidebarState;
            if (this.config.rememberDropdowns) {
                savedState =
                    localStorage.getItem(SIDEBAR_STATE_KEY) ||
                    this.config.sidebarState;
            }

            // Force closed on small screens
            if ($(window).width() <= 1023) {
                savedState = "closed";
            }

            $sidebar.attr("data-state", savedState);
            updateContentShift(savedState);

            // --- Load saved dropdown states ---
            let savedDropdowns = [];
            if (this.config.rememberDropdowns) {
                savedDropdowns = JSON.parse(
                    localStorage.getItem(DROPDOWN_STATE_KEY) || "[]",
                );
            }

            if (this.config.dropdownMode === "multi") {
                savedDropdowns.forEach((id) => $("#" + id).addClass("open"));
            } else {
                if (savedDropdowns.length)
                    $("#" + savedDropdowns[0]).addClass("open");
            }

            // --- Sidebar toggle click ---
            $toggler.on("click", () => {
                const isOpen = $sidebar.attr("data-state") === "open";
                const newState = isOpen ? "closed" : "open";
                setSidebarState(newState);
            });

            // --- Overlay click closes sidebar ---
            if (this.config.closeOnClickOutside) {
                $overlay.on("click", () => setSidebarState("closed"));
            }

            // --- Dropdown toggle ---
            $dropdowns.each((_, el) => {
                const $dropdown = $(el);
                const $toggle = $dropdown.find(".dropdown-toggle").first();

                $toggle.on("click", () => {
                    const isOpen = $dropdown.hasClass("open");

                    if (edgePane.config.dropdownMode === "single") {
                        $dropdowns
                            .not($dropdown)
                            .removeClass("open")
                            .find(".dropdown-toggle")
                            .attr("aria-expanded", "false");
                        $dropdowns
                            .not($dropdown)
                            .find(".dropdown-content")
                            .attr("aria-hidden", "true");
                    }

                    $dropdown.toggleClass("open");
                    $toggle.attr("aria-expanded", String(!isOpen));
                    $dropdown
                        .find(".dropdown-content")
                        .attr("aria-hidden", String(isOpen));

                    saveDropdowns();
                    edgePane.config.onDropdownToggle(
                        $dropdown.attr("id"),
                        !isOpen,
                    );
                });
            });

            // --- Hover to open ---
            if (this.config.hoverExpand) {
                $sidebar.on("mouseenter", () => {
                    if (
                        $(window).width() > 1023 &&
                        $sidebar.attr("data-state") === "closed"
                    ) {
                        $sidebar.attr("data-state", "open");
                        isHoverOpen = true;
                    }
                });
                $sidebar.on("mouseleave", () => {
                    if ($(window).width() > 1023 && isHoverOpen) {
                        $sidebar.attr("data-state", "closed");
                        isHoverOpen = false;
                    }
                });
            }

            // --- Helper functions ---
            function setSidebarState(state) {
                $sidebar.attr("data-state", state);
                updateContentShift(state);
                if (edgePane.config.rememberDropdowns) {
                    localStorage.setItem(SIDEBAR_STATE_KEY, state);
                }
                if ($(window).width() <= 1023) {
                    $overlay.toggleClass("show", state === "open");
                }
                edgePane.config.onSidebarToggle(state);
            }

            function saveDropdowns() {
                if (!edgePane.config.rememberDropdowns) return;
                const openIds = $dropdowns
                    .filter(".open")
                    .map((_, el) => $(el).attr("id"))
                    .get();
                localStorage.setItem(
                    DROPDOWN_STATE_KEY,
                    JSON.stringify(openIds),
                );
            }

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

            // --- Adjust on window resize ---
            $(window).on("resize", () => {
                updateContentShift($sidebar.attr("data-state"));
                if ($(window).width() > 1023) $overlay.removeClass("show");
            });
        },
    };

    return edgePane;
});
