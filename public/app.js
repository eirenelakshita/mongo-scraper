// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

// $("#save-button").click(function() {
//   var thisId= $(this).attr("data-id");
//   $.ajax({
//     method: "PUT",
//     url: "/articles/" + thisId,
//     data: {
//       saved: false
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//     });
// })

$("#saved-button").on("click", function (event) {
  $.ajax("/scraped", {
    type: "GET"
  }).then(
    function () {
      console.log("changed saved status of " + id);
      // Reload the page to get the updated list
      location.reload();
    }
  );
});

$(document).on("click", "#save-button", function (event) {
  var id = $(this).data("id");
  console.log("Save button clicked: " + id);
  // Send the PUT request.
  $.ajax("/articles/" + id, {
    type: "PUT"
  }).then(
    function () {
      console.log("changed saved status of " + id);
      // Reload the page to get the updated list
      location.reload();
    }
  );
});

// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// When you click the savenote button
$(document).on("click", "#save-note", function (e) {
  e.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#inputNote").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#inputNote").val("");
      $(".modal-body").empty();
    });
    // $(".modal-body")
});

$(document).on("click", "#delete-article", function (e) {
  e.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/remove/articles/" + thisId
  })
    .then(function () {
      console.log("Deleted from Saved, article id " + id);
      location.reload();
    })

    // $(".modal-body")
});