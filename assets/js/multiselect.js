let selectedValues = [];
const $multiselect = $('.custom-multiselect');
const $dropdown = $multiselect.find('.options-dropdown');
const $selectedTags = $multiselect.find('.selected-tags');
const $placeholder = $selectedTags.find('.placeholder');
const $hiddenInput = $('#taggedUsersInput');
const input = $dropdown.find('input');
const list = $dropdown.find('.options-list');

// Highlight selected option
function highlightOption(value, add = true) {
    const $option = $dropdown.find(`li[data-value="${value}"]`);
    if (add) {
        $option.addClass('bg-gray-100');
    } else {
        $option.removeClass('bg-gray-100');
    }
}

// Load preselected values
if ($hiddenInput.val()) {
    selectedValues = $hiddenInput.val().split(',');
    selectedValues.forEach(value => {
        addTag(value);
        highlightOption(value, true);
    });
    togglePlaceholder();
}

// Toggle dropdown
$selectedTags.on('click', function () {
    $dropdown.toggleClass('hidden');
});

// Select an option
$dropdown.on('click', '.options-list li', function () {
    const value = $(this).data('value');
    if (!selectedValues.includes(value)) {
        selectedValues.push(value);
        addTag(value);
        updateHiddenInput();
        togglePlaceholder();
        highlightOption(value, true);
    }
});

// Remove tag
$selectedTags.on('click', '.remove-tag', function (e) {
    e.stopPropagation();
    const value = $(this).data('value');
    $(this).closest('.tag').remove();
    selectedValues = selectedValues.filter(v => v !== value);
    updateHiddenInput();
    togglePlaceholder();
    highlightOption(value, false);
});

// Filter items
input.on('keyup', function () {
  const val = $(this).val().toLowerCase();
  list.children('li').each(function () {
    $(this).toggle($(this).text().toLowerCase().includes(val));
  });
});

// Close dropdown on outside click
$(document).on('click', function (e) {
    if (!$multiselect.is(e.target) && $multiselect.has(e.target).length === 0) {
        $dropdown.addClass('hidden');
    }
});

// Submit form
$('form').on('submit', function (e) {
    e.preventDefault();
    console.log('Selected users:', $hiddenInput.val());
});

function addTag(value) {
    const tag = $(`
      <span class="tag bg-green-100 text-green-600 text-xs sm:text-sm px-2 py-1 rounded-md flex items-center gap-1">
        ${value}
        <button type="button" class="ml-1 text-red-300 font-bold remove-tag" data-value="${value}">×</button>
      </span>
    `);
    $selectedTags.append(tag);
}

function updateHiddenInput() {
    $hiddenInput.val(selectedValues.join(','));
}

function togglePlaceholder() {
    $placeholder.toggle(selectedValues.length === 0);
}