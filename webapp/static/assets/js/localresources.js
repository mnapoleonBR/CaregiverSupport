$(document).ready(function() {

  var keywordMap = contextVar // this is set in the template

  // need to hold onto the resource references since they will be detached from DOM
  var $allResources = $(".resultColumn");
  var $resourcesContainer = $(".resourceResults");

  // Setting up the autocomplete
  var input = document.getElementById("resourceSearchBar");
  new Awesomplete(input, {
    list: Object.keys(keywordMap),
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
    var relevantIds = keywordMap[selectedKeyword];
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

  $(".resultPanel").click(function(e) {
    resourceName = e.target.parentNode.id;
    window.location.href = "/resource/" + resourceName;
  });
});