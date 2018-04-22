var answers = [];
//var results = {};

$('.button').click(function() {
  var $btn = $(this),
      $step = $btn.parents('.modal-body'),
      stepIndex = $step.index(),
      $pag = $('.modal-header span').eq(stepIndex),
      $input = $btn.closest('form').find('input:checked');
    
  answers.push($input.val() || 'none');
    
  if ($step.next().length > 0) {
    animateStep($step, $pag);
  } else {
    alert(answers.join(', '));
  }
});

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