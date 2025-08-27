/*!
 * EdgePane Sidebar
 * ------------------------------------
 * A lightweight, responsive, customizable sidebar
 * with dropdowns, branding, overlay, and theming.
 *
 * Version: 1.0.0
 * Author: Your Name / Team
 * License: MIT
 *
 * Features:
 * - Initialize sidebar with egpSidebar.init({...})
 * - Toggle open/closed states
 * - Dropdown menus (single or multi)
 * - Overlay for mobile
 * - Remember dropdown state (optional)
 * - Callbacks for events (onToggle, onDropdown, etc.)
 *
 * Usage:
 *  egpSidebar.init({
 *    sidebarState: "open",        // "open" | "closed"
 *    hoverExpand: true,           // expand on hover
 *    closeOnClickOutside: true,   // overlay behavior
 *    dropdownMode: "single",      // or "multi"
 *    rememberDropdowns: true
 *  });
 *
 * Dependencies:
 *  - jQuery (required)
 *  - Bootstrap Icons (optional, for icons)
 *
 * ------------------------------------
 */

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
            sidebarColor: "rgba(225,225,225,1)",
            fontFamily: "'Montserrat', sans-serif",
            sidebarWidth: "16rem",
            textColor: "rgba(70,70,70,1)",
            activeLinkBg: "rgba(180,180,180,1)",
            activeLinkColor: "rgba(70,70,70,1)",
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

            const $sidebar = $(".egp-sidebar");
            const $overlay = $(".egp-sidebar-overlay");
            const $toggler = $(".egp-sidebar-toggle");
            const $mainContent = $(".egp-main-content");
            const $dropdowns = $(".egp-sidebar-dropdown");
            const $logo = $(".egp-sidebar-logo");
            const $brandHeader = $(".egp-sidebar-header");

            const SIDEBAR_STATE_KEY = "sidebar-state";
            const DROPDOWN_STATE_KEY = "sidebar-dropdowns";
            const ACTIVE_LINK_KEY = "active-link-key";

            let isHoverOpen = false;
            let matchPer = null;

            // --- Active link save on click ---
            (function () {
                // On click: store active link and highlight it
                $(document).on("click", ".egp-sidebar-link", function () {
                    const text = $(this)
                        .find(".egp-sidebar-link-text")
                        .text()
                        .trim();
                    localStorage.setItem(ACTIVE_LINK_KEY, text);

                    $(".egp-sidebar-link").removeClass("active");
                    $(this).addClass("active");
                });

                // Collect all sidebar href paths
                let allMatch = $(".egp-sidebar-link")
                    .map(function () {
                        const href = $(this).attr("href");
                        if (!href || href === "#") return null;

                        let linkPath = new URL(href, window.location.origin)
                            .pathname;
                        return linkPath.replace(/^\/|\/$/g, "").toLowerCase();
                    })
                    .get();

                function getBestRouteFromPath(path) {
                    let cleanPath = path.split(/[?#]/)[0]; // remove query/hash
                    const parts = cleanPath.split("/").filter(Boolean);

                    if (!parts.length) return null;

                    const last = parts[parts.length - 1].toLowerCase();
                    if (allMatch.includes(last)) return last;

                    if (parts.length >= 2) {
                        const lastTwo = parts.slice(-2).join("/").toLowerCase();
                        if (allMatch.includes(lastTwo)) return lastTwo;
                    }

                    return null;
                }

                // Detect current route
                const currentRoute = window.location.pathname.replace(
                    /\/$/,
                    "",
                );
                const routeActive = getBestRouteFromPath(currentRoute);

                if (routeActive) {
                    // Try to match against sidebar links
                    matchPer = $(".egp-sidebar-link")
                        .filter(function () {
                            const href = $(this).attr("href");
                            if (!href || href === "#") return false;

                            const cleanHref = href
                                .replace(/^\.\//, "")
                                .toLowerCase();
                            return cleanHref.toLowerCase() === routeActive.toLowerCase();
                        })
                        .first();
                }

                if (matchPer && matchPer.length) {
                    $(".egp-sidebar-link").removeClass("active");
                    matchPer.addClass("active");

                    // Update localStorage with the matched text
                    const text = matchPer
                        .find(".egp-sidebar-link-text")
                        .text()
                        .trim();
                    localStorage.setItem(ACTIVE_LINK_KEY, text);
                } else {
                    const lastActiveText =
                        localStorage.getItem(ACTIVE_LINK_KEY);
                    if (lastActiveText) {
                        matchPer = $(".egp-sidebar-link")
                            .filter(function () {
                                return (
                                    $(this)
                                        .find(".egp-sidebar-link-text")
                                        .text()
                                        .trim() === lastActiveText
                                );
                            })
                            .first();

                        if ((matchPer ?? []).length) {
                            $(".egp-sidebar-link").removeClass("active");
                            matchPer.addClass("active");
                        }
                    }
                }
            })();

            // remove old actives
            $(".egp-sidebar-link").removeClass("active");

            // set new active
            ((matchPer ?? []).length
                ? matchPer
                : $(".egp-sidebar-link").first()
            ).addClass("active");

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
                $(".egp-sidebar-brand-name").text(this.config.brand.brandName);
            if (this.config.brand.brandTagline)
                $(".egp-sidebar-brand-tagline").text(
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
                    localStorage.getItem(SIDEBAR_STATE_KEY) || savedState;
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
                try {
                    savedDropdowns = JSON.parse(
                        localStorage.getItem(DROPDOWN_STATE_KEY) || "[]",
                    );
                } catch (e) {
                    savedDropdowns = [];
                }
            }

            if (this.config.dropdownMode === "multi") {
                savedDropdowns.forEach((id) => $("#" + id).addClass("open"));
            } else {
                if (savedDropdowns.length)
                    $("#" + savedDropdowns[0]).addClass("open");
            }

            // --- Sidebar toggle click ---
            $toggler.off("click").on("click", () => {
                const isOpen = $sidebar.attr("data-state") === "open";
                const newState = isOpen ? "closed" : "open";
                setSidebarState(newState);
            });

            // --- Overlay click closes sidebar ---
            if (this.config.closeOnClickOutside) {
                $overlay
                    .off("click")
                    .on("click", () => setSidebarState("closed"));
            }

            // --- Dropdown toggle ---
            $dropdowns.each((_, el) => {
                const $dropdown = $(el);
                const $toggle = $dropdown.find(".egp-dropdown-toggle").first();

                $toggle.on("click", () => {
                    const isOpen = $dropdown.hasClass("open");

                    if (edgePane.config.dropdownMode === "single") {
                        $dropdowns
                            .not($dropdown)
                            .removeClass("open")
                            .find(".egp-dropdown-toggle")
                            .attr("aria-expanded", "false");
                        $dropdowns
                            .not($dropdown)
                            .find(".egp-dropdown-content")
                            .attr("aria-hidden", "true");
                    }

                    $dropdown.toggleClass("open");
                    $toggle.attr("aria-expanded", String(!isOpen));
                    $dropdown
                        .find(".egp-dropdown-content")
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
                if ($(window).width() <= 1023) {
                    $mainContent.removeClass("shifted compact");
                    return;
                }
                $mainContent.toggleClass("shifted", state === "open");
                $mainContent.toggleClass("compact", state === "closed");
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
