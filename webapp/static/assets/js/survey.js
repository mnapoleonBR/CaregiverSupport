var answers = []

$('.button').click(function(){
  var $btn = $(this),
      $step = $btn.parents('.modal-body'),
      stepIndex = $step.index(),
      $pag = $('.modal-header span').eq(stepIndex),
      $input = $btn.closest('form').find('input:checked');

  answers.push($input.val() || 'none');
  console.log(answers)
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

// only allow one input to be checked at a time
$('input').on('change', function() {
    $('input').not(this).prop('checked', false);  
});
