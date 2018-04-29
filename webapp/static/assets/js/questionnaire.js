$(document).ready(function() {

  // right on load, hide topics-list and questionnaire
  $("#topics-list").hide();
  $("#questionnaire").hide();

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
    
    // if this is not the last question, switch to next quetsion
    if ($step.next().length > 0) {
      $pag.removeClass('is-active').next().addClass('is-active');

      $step.removeClass('is-showing').next().addClass('is-showing');
    // otherwise, submit the results
    } else {
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

  // only allow one input to be checked at a time for non-multiple questions
  $("input[type=radio]").on('change', function() {
      $('input').not(this).prop('checked', false);  
  });

  $("#questionnaire-button").click(function() {
    $("#questionnaire").show();
    $("#short-or-long").hide();
  });

  $("#topic-button").click(function() {
    $("#topics-list").show();
    $("#short-or-long").hide();
  });

  $("#questionnaire-restart-button").click(function() {
    window.location.href = "/questionnaire/restart";
  });

  $("#questionnaire-results-button").click(function() {
    window.location.href = "/questionnaire-results";
  });


});
