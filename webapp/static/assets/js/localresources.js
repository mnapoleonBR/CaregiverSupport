$(document).ready(function() {

  // keywordToResources map is set in the template

  // need to hold onto the resource references since they will be detached from DOM
  var $allResources = $(".resultColumn");
  var $resourcesContainer = $(".resourceResults");

  var $autocomplete = $('#resourceSearchBar');

  $autocomplete.tagit({
    availableTags: Object.keys(keywordToResources),
    autocomplete: {autoFocus: true},
    beforeTagAdded: function(event, ui) {
      if (!(ui.tagLabel in keywordToResources)) {
        return false;
      }
    },
    afterTagAdded: function(event, ui) {
      showRelevantResources($autocomplete.tagit("assignedTags"));
    },
    afterTagRemoved: function(event, ui) {
      var remainingTags = $autocomplete.tagit("assignedTags");
      if (remainingTags.length === 0) {
        showAllResources();
      } else {
        showRelevantResources($autocomplete.tagit("assignedTags"));
      }
    }
  });

  function showRelevantResources(selectedTags) {
    var relevantResourceIds = []
    selectedTags.forEach(function(tag) {
      console.log(keywordToResources[tag]);
      relevantResourceIds = relevantResourceIds.concat(keywordToResources[tag]);
    });

    var $relevantResources = $(); 
    relevantResourceIds.forEach(function(id) {
      var $resource = $allResources.filter("#" + id)
      $relevantResources = $relevantResources.add($resource);
    })

    $allResources.detach();
    $relevantResources.appendTo($resourcesContainer);
  }

  function showAllResources() {
    $allResources.detach();
    $allResources.appendTo($resourcesContainer);
  }

  // tag clicks
  $(".keywordTag").click(function(e) {
    var selectedTag = $(this).text();
    $autocomplete.tagit("createTag", selectedTag);
    e.preventDefault();
  });

  // visual effects
  $(".resultPanel").hover(function() {
    $(this).find("h3").addClass("orangeText")
  }, function() {
    $(this).find("h3").removeClass("orangeText")
  });
});