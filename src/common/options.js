function saveCheckboxOption(elementId) {
  var element = document.getElementById(elementId);

  if (element) {
    return setKangoSetting(elementId, element.checked);
  } else {
    console.log("WARNING: Tried to saveCheckboxOption but couldn't find element " + elementId + " on the page.");
  }
}

function saveSelectOption(elementId) {
  var select = document.getElementById(elementId);

  if (select) {
    return setKangoSetting(elementId, select.options[select.selectedIndex].value);
  } else {
    console.log("WARNING: Tried to saveSelectOption but couldn't find element " + elementId + " on the page.");
  }
}

function restoreCheckboxOption(elementId) {
  return new Promise(function(resolve, reject) {
    var element = document.getElementById(elementId);

    if (element) {
      getKangoSetting(elementId).then(function(value) {
        element.checked = value;

        resolve();
      });

    } else {
      console.log("WARNING: Tried to restoreCheckboxOption but couldn't find element " + elementId + " on the page.");

      // We don't actually want to error if the element isn't there, we want execution to continue.
      // It's a warning, not an error.
      resolve();
    }
  });
}

function restoreSelectOption(elementId) {
  return new Promise(function(resolve, reject) {
    var select = document.getElementById(elementId);

    if (select) {
      getKangoSetting(elementId).then(function(data) {
        data = data || 0;

        select.value = data;

        resolve();
      });
    } else {
      console.log("WARNING: Tried to restoreSelectOption but couldn't find element " + elementId + " on the page.");

      // We don't actually want to error if the element isn't there, we want execution to continue.
      // It's a warning, not an error.
      resolve();
    }
  });

}

function saveOptions() {

  var promises = [];

  ynabToolKit.settings.forEach(function(setting) {
    if (setting.type == "checkbox") {
      promises.push(saveCheckboxOption(setting.name));
    } else if (setting.type == "select") {
      promises.push(saveSelectOption(setting.name));
    }
  });

  Promise.all(promises).then(function() {

    $('#settingsSaved').fadeIn()
                       .delay(1500)
                       .fadeOut();

  });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {

  return new Promise(function (resolve, reject) {
    ensureDefaultsAreSet().then(function() {

      var promises = [];

      ynabToolKit.settings.forEach(function(setting) {
        if (setting.type == "checkbox") {
          promises.push(restoreCheckboxOption(setting.name));
        } else if (setting.type == "select") {
          promises.push(restoreSelectOption(setting.name));
        }
      });

      Promise.all(promises).then(resolve);
    });
  });
}

function buildOptionsPage() {

  // Order by section, then type, then name.
  ynabToolKit.settings.sort(function(a, b) {
    if (a.section != b.section) {
      return a.section.localeCompare(b.section);
    }

    if (a.type != b.type) {
      return a.type.localeCompare(b.type);
    }

    return a.title.localeCompare(b.title);
  })

  ynabToolKit.settings.forEach(function(setting) {
    if (setting.type == 'checkbox') {

      var template =
      '<div class="row option-row">' +
        '<input type="checkbox" id="' + setting.name + '" name="' + setting.name + '" aria-describedby="' + setting.name + 'HelpBlock">' +
        '<div class="option-description">' +
          '<label for="' + setting.name + '">' + setting.title + '</label>' +
          '<span id="' + setting.name + 'HelpBlock" class="help-block">' + setting.description + '</span>' +
        '</div>' +
      '</div>';

      $('#' + setting.section + 'SettingsPage').append(template);

    } else if (setting.type == 'select') {

      var template =
      '<div class="row option-row">' +
        '<label for="' + setting.name + '">' + setting.title + '</label>' +
        '<select name="' + setting.name + '" id="' + setting.name + '" class="form-control" aria-describedby="' + setting.name + 'HelpBlock">';

      setting.options.forEach(function(option) {
        template += '<option value="' + option.value + '" style="' + (option.style || '') + '">' + option.name + '</option>';
      });

      template += '</select>' +
        '<span id="' + setting.name + 'HelpBlock" class="help-block">' + setting.description + '</span>' +
      '</div>';

      $('#' + setting.section + 'SettingsPage').append(template);
    }
  });
}

function loadPanel(panel, animated) {
  if (typeof animated === 'undefined') {
    animated = true;
  }

  // Do we need to do anything?
  var element = $('#' + panel + 'MenuItem');
  if (element.hasClass('active-menu')) { return; }

  $('.nav li a').removeClass('active-menu');
  element.addClass('active-menu');

  $('.settingsPage').hide();

  if (animated) {
    $('#' + panel + "SettingsPage").fadeIn();
  } else {
    $('#' + panel + "SettingsPage").show();
  }
}

KangoAPI.onReady(function() {
  // Set the logo.
  kango.invokeAsync('kango.io.getResourceUrl', 'assets/logos/toolkitforynab-logo-200.png', function(data) {
    $('#logo').attr('src', data);
  });

  buildOptionsPage();

  restoreOptions().then(function() {
    $('input:checkbox').bootstrapSwitch();

    loadPanel('general', false);

    $('#wrapper').fadeIn();
  });

  $('#generalMenuItem').click(function(e) { loadPanel('general'); e.preventDefault(); });
  $('#accountsMenuItem').click(function(e) { loadPanel('accounts'); e.preventDefault(); });
  $('#budgetMenuItem').click(function(e) { loadPanel('budget'); e.preventDefault(); });

  $('.save-button').click(saveOptions);
  $('.cancel-button').click(KangoAPI.closeWindow);
});
