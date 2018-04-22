var selectedResourceIds = []
//var results = {};

$('.button').click(function() {
  var $btn = $(this),
      $step = $btn.parents('.modal-body'),
      stepIndex = $step.index(),
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
    submitResourceIds(selectedResourceIds);
  }
});

function submitResourceIds(resourceIds) {
  $.ajax({
    type: "POST",
    url: '/questionnaire-submit',
    data: JSON.stringify(resourceIds),
  });
}

function animateStep($step, $pag){
  // animate the step out
  $step.addClass('animate-out');
  
  // animate the step in
  setTimeout(function(){
    $step.removeClass('animate-out is-showing')
         .next().addClass('animate-in');
    $pag.removeClass('is-active')
          .next().addClass('is-active');
  }, 600);
  
  // after the animation, adjust the classes
  setTimeout(function(){
    $step.next().removeClass('animate-in')
          .addClass('is-showing');
    
  }, 1200);
}

// only allow one input to be checked at a time for non-multiple questions
$('input:not(.is-multiple)').on('change', function() {
    $('input').not(this).prop('checked', false);  
});

//$('input:checked.is-multiple').click(function() {
//    console.log("this is happening!!!!");
//    $(this).prop('checked', !$(this).prop('checked'));
//});