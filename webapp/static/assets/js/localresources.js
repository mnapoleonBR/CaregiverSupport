$(document).ready(function() {

  // keywordToResources map is set in the template

  // need to hold onto the resource references since they will be detached from DOM
  var $allResources = $(".resultColumn");
  var $resourcesContainer = $(".resourceResults");

  // Setting up the autocomplete
  var input = document.getElementById("resourceSearchBar");
  var autocomplete = new Awesomplete(input, {
    list: Object.keys(keywordToResources),
    autoFirst: true,
    minChars: 1,
    filter: Awesomplete.FILTER_STARTSWITH,
  });

  Awesomplete.$.bind(input, {
    "awesomplete-selectcomplete": function(evt) {
      showRelevantResource(evt.text);
    }
  });

  function showRelevantResource(selectedKeyword) {
    var relevantIds = keywordToResources[selectedKeyword];
    var $relevantResources = $(); 
    relevantIds.forEach(function(id) {
      var $resource = $allResources.filter("#" + id)
      $relevantResources = $relevantResources.add($resource);
    })

    $allResources.detach();
    $relevantResources.appendTo($resourcesContainer);
  }

  // when the search bar is back to empty, show all
  $("#resourceSearchBar").on("input", function(e) {
    if (!e.target.value) {
      $allResources.detach();
      $allResources.appendTo($resourcesContainer);
    }
  });

  // tag clicks
  $(".keywordTag").click(function(e) {
    var selectedTag = $(this).text();
    $("#resourceSearchBar").val(selectedTag);
    autocomplete.evaluate();
    autocomplete.select();
    e.preventDefault();
  });

  // visual effects
  $(".resultPanel").hover(function() {
    $(this).find("h3").addClass("orangeText")
  }, function() {
    $(this).find("h3").removeClass("orangeText")
  });
});