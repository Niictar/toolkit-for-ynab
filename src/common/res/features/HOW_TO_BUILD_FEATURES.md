How to Build Features
---------------------

**Main things to note:**

1. Use plain HTML, JS and CSS
1. We have a build system in ```/build``` and ```/build.bat``` that generates some files which help keep features contained to their own directories. If you follow the conventions below you'll find this makes life easy.
1. There is a single [Mutation Observer](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) that is available for you to hook into in order to watch for DOM changes and do what you want to do. We'll talk about how you hook into this below.
1. Every feature must be configurable by users. It can have a default to on if it's very useful for a wide swath of users, but there must always be the ability to turn it off. There are no mandatory features.
1. The settings and the things they do to get your feature to work when they're turned on are configured in your feature directory.

General Structure
-----------------

Each feature has its own folder. Please name the folder in a way that's clear what your feature does!

Within that folder, there is only one mandatory file for your feature to do something, and that's the file that says what your setting looks like to users called ```settings.json```. You can include as many or as few other files in your feature directory as you require. Feel free to peruse some of the other features for examples.

Many simple like colourblind mode and Hide Age of Money are a single CSS file and the ```settings.json``` file with nothing more. The Reports feature includes Charts.js and a bunch of script. Make it as simple as you can. CSS is always preferred to Javascript if you can achieve what you want that way as it'll perform better and will be 100% consistently applied without relying on logic to reinstate itself as the user moves around the application.

Settings
--------

Settings appear in the options page one of two ways, either as a checkbox (which shows up as a switch) or as a select.

Settings appear sorted by type first (checkboxes then selects), then alphabetical by title. This ensures they're consistent and hopefully a bit easier for users to locate.

To ask for a setting to show up, include a ```settings.json``` file in your feature directory. Here's a simple example ```settings.json``` file:

```
{
         "name": "hideAOM",
         "type": "checkbox",
      "default": false,
      "section": "general",
        "title": "Hide Age of Money Calculation",
  "description": "Hides the Age of Money calculation. Some users find it's not relevant or helpful for them, so they'd rather hide it.",
      "actions": {
                    "true": [
                      "injectCSS", "main.css"
                    ]
                 }
}
```

This particular setting adds a checkbox to the options page in the General tab. When the user activates the feature by switching it on and saving the settings, the ```main.css``` file in the same directory as this file will be injected into YNAB's DOM automatically by the settings system because of the "true" action.

Here's a full explanation of all the fields:

| Field       | Meaning                                                                                                                                                                                                                                                                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name        | This is the field that is used as the unique value that stores the option in the database. Give it a short but meaningful name.                                                                                                                                                                                                                                  |
| type        | This field tells the settings system whether to generate a checkbox or select for you. Acceptable values are "checkbox" or "select".                                                                                                                                                                                                                             |
| default     | This field tells the settings system what the default value for this setting should be.                                                                                                                                                                                                                                                                          |
| section     | This field tells the settings system which tab in the options page your setting should show up on. Acceptable values are "general", "budget" or "accounts".                                                                                                                                                                                                      |
| title       | This is the heading displayed to the user to describe your setting / feature.                                                                                                                                                                                                                                                                                    |
| description | This is the help text that is shown underneath the setting. Please stay light on HTML here so if we decide to restyle the page we don't have to edit your settings file.                                                                                                                                                                                         |
| actions     | This object defines what action to take whenever it finds a settings value. Values are converted to strings for this operation, so "true" and "false", or "0" etc for selects are the correct choice here. Possible values for actions are "injectCSS", "injectScript", and "injectJSString". Any files need to be referenced relative to the current directory. |

Here's an example for a select setting. The only difference is the ```options``` key, which tells the settings system what options to show in the drop down, and then the actions and default use these values instead of "true" or "false":

```
{
         "name": "daysOfBufferingHistoryLookup",
         "type": "select",
      "default": "0",
      "section": "budget",
        "title": "Days of Buffering History Lookup",
  "description": "How old transactions should be used for average daily outflow calculation.",
      "options": [
                { "name": "All", "value": "0" },
                { "name": "1 year", "value": "12" },
                { "name": "6 months", "value": "6" },
                { "name": "3 months", "value": "3" },
                { "name": "1 month", "value": "1" }
             ],
      "actions": {
             "0": [ "injectJSString", "var daysOfBufferingHistoryLookup = 0;" ],
             "12": [ "injectJSString", "var daysOfBufferingHistoryLookup = 12;" ],
             "6": [ "injectJSString", "var daysOfBufferingHistoryLookup = 6;" ],
             "3": [ "injectJSString", "var daysOfBufferingHistoryLookup = 3;" ],
             "1": [ "injectJSString", "var daysOfBufferingHistoryLookup = 1;" ]
          }
}
```

Multiple Settings
-----------------
It's also possible to have your single feature expose multiple settings, just put them in an array like so:

```
[{
         "name": "daysOfBuffering",
         "type": "checkbox",
      "default": false,
      "section": "budget",
        "title": "Days of Buffering Metric",
  "description": "This calculation shows how long your money would likely last if you never earned another cent based on your average spending. We know that no month is 'average' but this should give you some idea of how much of a buffer you have. Equal to budget accounts total divided by the average daily outflow. That comes from sum of all outflow transactions from on budget accounts only divided by the age of budget in days. You can also change the number of days taken into account by this metric with the 'Days of Buffering History Lookup' setting.",
      "actions": {
                    "true": [
                      "injectCSS", "main.css",
                      "injectScript", "main.js"
                    ]
                 }
},
{
         "name": "daysOfBufferingHistoryLookup",
         "type": "select",
      "default": "0",
      "section": "budget",
        "title": "Days of Buffering History Lookup",
  "description": "How old transactions should be used for average daily outflow calculation.",
      "options": [
                { "name": "All", "value": "0" },
                { "name": "1 year", "value": "12" },
                { "name": "6 months", "value": "6" },
                { "name": "3 months", "value": "3" },
                { "name": "1 month", "value": "1" }
             ],
      "actions": {
             "0": [ "injectJSString", "var daysOfBufferingHistoryLookup = 0;" ],
             "12": [ "injectJSString", "var daysOfBufferingHistoryLookup = 12;" ],
             "6": [ "injectJSString", "var daysOfBufferingHistoryLookup = 6;" ],
             "3": [ "injectJSString", "var daysOfBufferingHistoryLookup = 3;" ],
             "1": [ "injectJSString", "var daysOfBufferingHistoryLookup = 1;" ]
          }
}]
```

How does this Magic Work?
-------------------------
There's a [python script](https://github.com/blargity/toolkit-for-ynab/blob/master/populateFeaturesFiles.py) that's invoked as part of the build process. It scans for these files and pulls them all into a single Javascript file, which is included in the extension. This saves us massive amounts of merge conflicts and makes building these features much easier.

What If I Can't Get My Setting to Work?
---------------------------------------
Open a pull request with where you're up to and ask for help. We'll update this document to explain whatever we failed to explain the first time!

Writing Javascript Based Features / Act on Changes / Mutation Observer
----------------------------------------------------------------------
Ok, so you can't do what you want with CSS. You need to add a button, or do something fancy. No worries! Make sure you implement your feature with a couple of things in mind.

- The Toolkit is loaded before YNAB is finished loading. This means things like JQuery aren't available until after some arbitrary delay.
- YNAB is in charge of the DOM, not us. So we need to watch what they do and inject our stuff, rather than wiping out their UI and replacing it with our own.
- YNAB is built with EmberJS. The [Ember Inspector browser extension](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi) will help you navigate their stuff much more effectively than just using normal Inspect Element.

We've built a pattern that will help you get started. The example file is here: https://github.com/blargity/toolkit-for-ynab/blob/master/src/common/res/features/shared/example.js

This is what it looks like:
```
(function poll() {
// Waits until an external function gives us the all clear that we can run (at /shared/main.js)
if ( typeof ynabToolKit !== "undefined"  && ynabToolKit.pageReady === true ) {

  ynabToolKit.awesomeFeature = new function ()  {

    // Supporting functions,
    // or variables, etc

    this.invoke = function() {
      // Code you expect to run each time your feature needs to update or modify YNAB's state
    },

    this.observe = function(changedNodes) {

      if ( changedNodes.has('class-name-of-interest') ) {
        ynabToolKit.awesomeFeature.invoke();
        // Call this.invoke() to activate your function if you find any class names
        // in the set of changed nodes that indicates your function need may need to run.
      }

    }

  }; // Keep feature functions contained within this object

  ynabToolKit.awesomeFeature.invoke(); // Run your script once on page load

} else {
  setTimeout(poll, 250);
}
})();
```

Let's break it down and talk about the sections.

- ```poll()``` function: This waits until we're ready and then loads your feature in.
- ```ynabToolKit.awesomeFeature()```: This is your container object for your feature. The build system looks for this line in your file to include your feature into the observe stuff we'll talk about below.
- ```this.invoke()```: Think of this like a constructor, or an initialiser. Do what you want to do here to get it set up.
- ```this.observe(changedNodes)```: You can (optionally) define this function to watch the DOM for changes. ```changedNodes``` is a set of strings that describe the nodes which have just changed. Since this gets called every single time anything on the page changes at all, please ensure you guard your logic with an ```if``` statement which makes sure something you care about changed, or the browser will likely struggle with the amount of work it has to do on every change.

Mutation Observer Tips
----------------------
If you want to see what's changing, you can use the console to set ```ynabToolKit.debugNodes = true``` in the console, and further changes will get logged.

Shared Library
--------------
There are some common features which have been pulled into a shared library. We will all need to format currency to match the YNAB settings for currency that the user has chosen for example.

These functions / features can be found here: https://github.com/blargity/toolkit-for-ynab/blob/master/src/common/res/features/shared/main.js

Make as much use of these as possible. These are pre-tested and ready to go!
