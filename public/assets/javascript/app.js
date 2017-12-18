// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append('<div id="' + data[i]._id + '">');
    $("#articles").append('<a href="' + data[i].link + '" target="_blank"> <h3 data-id="' + data[i]._id + '">' + data[i].title + '<br/></h3></a>');
    $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="note" class="btn btn-primary">Notes</button>  ');
    $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="delete" class="btn btn-danger">Delete</button>');
    $("#articles").append('<br><br></div>');
  }
});

// Whenever someone clicks refresh button 
$(document).on("click", "#refresh", function() {

  // Empty the articles 
  $("#articles").empty();

    // Empty the notes from the note section
  $("#notes").empty();

  // Rerender the articles, pulling in new articles
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append('<div id="' + data[i]._id + '">');
      $("#articles").append('<a href="' + data[i].link + '" target="_blank"> <h3 data-id="' + data[i]._id + '">' + data[i].title + '<br/></h3></a>');
      $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="note" class="btn btn-primary">Notes</button>  ');
      $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="delete" class="btn btn-danger">Delete</button>');
      $("#articles").append('<br><br></div>');
    }
  });

});

// Whenever someone clicks a notes button
$(document).on("click", "#note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h3>" + data.title + "</h3>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// Whenever someone clicks the delete button 
$(document).on("click", "#delete", function() {

  // Save the id from the element passed in, this matches the article ID
  var thisId = $(this).attr("data-id");

  // Now make an ajax call to delete the Article from our database
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function() {
      console.log("Removed article from database");

      // Empty the articles 
      $("#articles").empty();

        // Empty the notes from the note section
      $("#notes").empty();


      // Rerender the articles 
      // Grab the articles as a json
      $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append('<div id="' + data[i]._id + '">');
          $("#articles").append('<a href="' + data[i].link + '" target="_blank"> <h3 data-id="' + data[i]._id + '">' + data[i].title + '<br/></h3></a>');
          $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="note" class="btn btn-primary">Notes</button>  ');
          $("#articles").append('<button data-id="' + data[i]._id + '" type="button" id="delete" class="btn btn-danger">Delete</button>');
          $("#articles").append('<br><br></div>');
        }
      });
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
