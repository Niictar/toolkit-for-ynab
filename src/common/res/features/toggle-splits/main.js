(function poll() { 
  // Waits until an external function gives us the all clear that we can run (at /shared/main.js)
  if ( typeof ynabToolKit !== "undefined"  && ynabToolKit.actOnChangeInit === true ) {
  
    ynabToolKit.toggleSplits = new function()  { // Keep feature functions contained within this
      
      this.setting = 'init',
      
      this.invoke = function() { 
      
        if ( !$('#toggleSplits').length ) {
         var toggleButton = "<button id=\"toggleSplits\" class=\"ember-view button\"><i class=\"ember-view flaticon stroke right\"></i><i class=\"ember-view flaticon stroke down\"></i> Toggle Splits </button>"
           $(toggleButton).insertAfter(".accounts-toolbar .undo-redo-container");
        }
        
        // default the right arrow to hidden
        if ( ynabToolKit.toggleSplits.setting === 'init' ) {
          $("#toggleSplits > .down").hide();
          ynabToolKit.toggleSplits.setting = 'hide';      
        }
         
        if ( ynabToolKit.toggleSplits.setting === 'hide' ) {
          $(".ynab-grid-body-sub").hide();
        } else {
          $(".ynab-grid-body-sub").show();
        }

         ynabToolKit.toggleSplits.findButton();
      },
      
      this.findButton = function() {
        
        $("#toggleSplits").on("click", function() {
          if ( ynabToolKit.toggleSplits.setting === 'hide' ) {
           ynabToolKit.toggleSplits.setting = 'show';
           $(".ynab-grid-body-sub").show();
          } else {
             ynabToolKit.toggleSplits.setting = 'hide';
             $(".ynab-grid-body-sub").hide();
          }
          
          $("#toggleSplits > i").toggle();
        });
      },
    
    this.observe = function(digest) {

      for ( var i = 0; i < digest.length; i++ ) {
        // We found Account transactions rows
        if ($(digest[i]).hasClass('ynab-grid-body')) {
          ynabToolKit.toggleSplits.invoke();
          break;
        }
      }

      if ( $(".accounts-toolbar.undo-redo-container").length ) {
        ynabToolKit.toggleSplits.findButton();
      }
        
    }
  };
  ynabToolKit.toggleSplits.invoke(); // call itself once

  } else {
    setTimeout(poll, 250);
  }   
})();
