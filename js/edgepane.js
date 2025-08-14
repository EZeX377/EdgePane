(function ($) {
    const edgePane = {
        config: {
            dropdownMode: "multi", // "multi" or "single"
            sidebarState: "open", // "open" | "closed"
            hoverExpand: true,
            closeOnClickOutside: true,
            rememberDropdowns: true,
            sidebarColor: "#059669",
            accentColor: "#059669",
            fontFamily: "'Montserrat', sans-serif",
            sidebarWidth: "16rem",
            brand: {
                brandLogoSrc: "",
                brandName: "",
                brandTagline: "",
                logoWidth: "2rem",
                logoHeight: "2rem",
            },
            onSidebarToggle: function (state) {},
            onDropdownToggle: function (id, isOpen) {},
        },

        init(userOptions = {}) {
            // Merge user options
            this.config = $.extend(true, {}, this.config, userOptions);

            // ✅ Apply dynamic open width
            document.documentElement.style.setProperty(
                "--sidebar-width-open",
                this.config.sidebarWidth,
            );

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
            if (this.config.brand.brandLogoSrc)
                $logo.attr("src", this.config.brand.brandLogoSrc);
            if (this.config.brand.brandName)
                $(".sidebar-brand-name").text(this.config.brand.brandName);
            if (this.config.brand.brandTagline)
                $(".sidebar-brand-tagline").text(
                    this.config.brand.brandTagline,
                );

            // --- Set logo size ---
            $logo.css({
                width: this.config.brand.logoWidth,
                height: this.config.brand.logoHeight,
            });

            // --- Apply colors and font ---
            $sidebar.css({
                background: this.config.sidebarColor,
                fontFamily: this.config.fontFamily,
            });
            $(".sidebar-link.active").css({ color: this.config.accentColor });

            // --- Load saved sidebar state ---
            let savedState = this.config.sidebarState;
            if (this.config.rememberDropdowns) {
                savedState =
                    localStorage.getItem(SIDEBAR_STATE_KEY) ||
                    this.config.sidebarState;
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

    window.edgePane = edgePane;
})(jQuery);
