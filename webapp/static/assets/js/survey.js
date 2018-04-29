$(document).ready(function() {

  // right on load, hide topics-list and questionnaire
  $("#topics-list").hide();
  $("#questionnaire").hide();

  $("#questionnaire-button").click(function() {
    $("#questionnaire").show();
    $("#short-or-long").hide();
  });

  $("#topic-button").click(function() {
    $("#topics-list").show();
    $("#short-or-long").hide();
  });

  var selectedResourceIds = []

  $(".button").click(function(evt) {
    evt.preventDefault();
    var $btn = $(this),
        $step = $btn.parents('.modal-body'),
        stepIndex = $step.index() + 1,
        $pag = $('.modal-header span').eq(stepIndex),
        $input = $btn.closest('form').find('input:checked'),
        isMultiselect = $btn.closest('form').hasClass('is-multiple'),
        id = $btn.closest('.modal-body').find('.q_id').attr('id');

    // if nothing was selected, get mad
    if ($input.length === 0) {
      alert("Please choose at least one option.");
      return false;
    }

    // if this is a multi-select question, add all selected
    if (isMultiselect) {
      $input.each(function () {
        selectedResourceIds.push($(this).val());
      });
    // if it is a single-select question, only add the corresponding resource_id if relevant
    } else if ($input.val() === "yes") {
       selectedResourceIds.push(id);
    }
    
    if ($step.next().length > 0) {
      animateStep($step, $pag);
    
    } else {
      console.log("yo")
      submitResourceIds(selectedResourceIds);
    }
    return false;
  });

  function submitResourceIds(resourceIds) {
    $.ajax({
      type: "POST",
      url: '/questionnaire-submit',
      data: JSON.stringify(resourceIds),
      success: function(response) {
        window.location.href = JSON.parse(response).redirect_link;
      },
      error: function(response) {
        console.log(JSON.parse(response.responseText));
      }
    });
  }

  function animateStep($step, $pag){
    // animate the step out
    //$step.addClass('animate-out');
    
    // change the current step to inactive, and next step to active
    setTimeout(function(){
      $pag.removeClass('is-active')
            .next().addClass('is-active');
    }, 300);
    
    // afterwards, adjust the classes
    setTimeout(function(){
        $step.removeClass('is-showing')
            .next().addClass('is-showing');
    }, 300);
  }

  // only allow one input to be checked at a time for non-multiple questions
  $("input[type=radio]").on('change', function() {
      $('input').not(this).prop('checked', false);  
  });
});
