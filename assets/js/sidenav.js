// State tracking flags
let navAction = false;
let isHoverOpen = false;
let overlayClicked = false;

// Check if screen is large
const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;

// Parse nav state from localStorage or fallback to data-state attribute or default to 'nav_open'
let savedPreference;
try {
    savedPreference = JSON.parse(localStorage.getItem('sideNavState')) || $('.side_nav').attr('data-state') || 'nav_open';
} catch (e) {
    savedPreference = $('.side_nav').attr('data-state') || 'nav_open';
}

// Force close nav on small screens
if (!isLargeScreen) {
    savedPreference = 'nav_close';
    localStorage.setItem('sideNavState', JSON.stringify('nav_close'));
}

// Set data-state attribute and remove legacy classes
$('.side_nav')
    .attr('data-state', savedPreference)
    .removeClass('nav_open nav_close');

// Adjust main body margin based on saved nav state
if (savedPreference === 'nav_open') {
    $('.main_body').addClass('lg:ml-[16rem]').removeClass('lg:ml-[4.5rem]');
    openNav();
} else {
    $('.main_body').removeClass('lg:ml-[16rem]').addClass('lg:ml-[4.5rem]');
    closeNav();
}

// Trigger nav state application
navToggle();

/**
 * Toggle nav between open and close depending on state and navAction
 */
function navToggle() {
    const isOpen = $('.side_nav').attr('data-state') === 'nav_open';

    if (navAction) {
        if (isOpen) {
            closeNav();
            localStorage.setItem('sideNavState', JSON.stringify('nav_close'));
        } else {
            openNav();
            localStorage.setItem('sideNavState', JSON.stringify('nav_open'));
        }
    } else {
        isOpen ? openNav() : closeNav();
    }
}

/**
 * Open side nav and update UI elements
 */
function openNav() {
    $('.side_nav')
        .attr('data-state', 'nav_open')
        .removeClass('-left-full lg:w-[4.5rem]')
        .addClass('lg:w-64 w-64 left-0');

    $('.nav_text').removeClass('opacity-0 w-0');
    $('.nav_indicator_txt').removeClass('hidden opacity-0');
    $('.nav_indicator_icn').addClass('hidden opacity-0');
    $('.dropdown_indicator').removeClass('hidden');
    $('.nav_heading').removeClass('w-0').addClass('w-max');

    if (navAction || overlayClicked) {
        $('.main_body').addClass('lg:ml-[16rem]').removeClass('lg:ml-[4.5rem]');
    }

    if (window.innerWidth < 1024) {
        $('.nav-overlay').removeClass('hidden');
    }

    // Re-apply dropdown open state
    $('.nav_dropdown').each(function () {
        navDropdownToggle(this);
    });
}

/**
 * Close side nav and update UI elements
 */
function closeNav() {
    $('.side_nav')
        .attr('data-state', 'nav_close')
        .removeClass('lg:w-64 w-64 left-0')
        .addClass('-left-full lg:w-[4.5rem]');

    $('.nav_text').addClass('opacity-0 w-0');
    $('.nav_indicator_txt').addClass('hidden opacity-0');
    $('.nav_indicator_icn').removeClass('hidden opacity-0');
    $('.dropdown_indicator').addClass('hidden');
    $('.nav_heading').removeClass('w-max').addClass('w-0');

    if (navAction || overlayClicked) {
        $('.main_body').removeClass('lg:ml-[16rem]').addClass('lg:ml-[4.5rem]');
    }

    $('.nav_dropdown_con').removeClass('max-h-[99rem]');
    $('.nav-overlay').addClass('hidden');
}

/**
 * Manual toggle button click
 */
$('.nav_toggler').on('click', function () {
    navAction = true;
    overlayClicked = true;
    isHoverOpen = false;
    navToggle();

    // Reset after short delay
    setTimeout(() => {
        navAction = false;
        overlayClicked = false;
    }, 100);
});

/**
 * Mobile overlay click (close nav)
 */
$('.nav-overlay').on('click', function () {
    navAction = true;
    closeNav();
    localStorage.setItem('sideNavState', JSON.stringify('nav_close'));
});

/**
 * Large screen hover behavior
 */
$('.side_nav').on('mouseenter', function () {
    if (window.matchMedia("(min-width: 1024px)").matches && $(this).attr('data-state') === 'nav_close') {
        openNav();
        $(this).addClass('lg:absolute');
        isHoverOpen = true;
    }
});

$('.side_nav').on('mouseleave', function () {
    if (window.matchMedia("(min-width: 1024px)").matches && isHoverOpen) {
        closeNav();
        $(this).removeClass('lg:absolute');
        isHoverOpen = false;

        // Reset dropdown icons
        $('.nav_dropdown').each(function () {
            navDropdownToggle(this);
        });
    }
});

/**
 * Open/close a specific dropdown and update icon
 */
function navDropdownToggle(element) {
    const $dropdown = $(element);
    const $dropdownContent = $dropdown.find('.nav_dropdown_con');
    const $dropdownIndicator = $dropdown.find('.dropdown_indicator');
    const isNavOpen = $('.side_nav').attr('data-state') === 'nav_open';

    if ($dropdown.hasClass('dropdown_active') && isNavOpen) {
        $dropdownContent.addClass('max-h-[99rem]');
        $dropdownIndicator.addClass('rotate-90');
    } else {
        $dropdownContent.removeClass('max-h-[99rem]');
        $dropdownIndicator.removeClass('rotate-90');
    }
}

// Restore dropdowns from localStorage
const activeDropdowns = JSON.parse(localStorage.getItem('activeDropdowns') || '[]');

$('.nav_dropdown').each(function () {
    const $dropdown = $(this);
    const id = $dropdown.data('id');

    if (activeDropdowns.includes(id)) {
        $dropdown.addClass('dropdown_active');
    }

    navDropdownToggle(this);
});

/**
 * Handle dropdown click toggle
 */
$('.nav_dropdown').on('click', function () {
    const $clicked = $(this);
    const dropdownId = $clicked.data('id');
    const isActive = $clicked.hasClass('dropdown_active');

    let activeDropdowns = [];

    // Remove current states from all
    $('.nav_dropdown').removeClass('dropdown_active');
    $('.nav_dropdown_con').removeClass('max-h-[99rem]');
    $('.dropdown_indicator').removeClass('rotate-90');

    // Store all open dropdowns before update (for timing sync)
    const $allDropdowns = $('.nav_dropdown_con');

    if (!isActive) {
        // Delay opening to give time for closing animation to finish
        setTimeout(() => {
            $clicked.addClass('dropdown_active');
            navDropdownToggle($clicked);
        }, 150); // match with your `duration-300` (halfway)
        activeDropdowns.push(dropdownId);
    }

    // Store updated state
    localStorage.setItem('activeDropdowns', JSON.stringify(activeDropdowns));
});
