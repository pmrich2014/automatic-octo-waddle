const apiKey = "cb53ed1ff4dccb488391fee859e0994c";

$(document).ready(function($) {

  //button click method
  $("#aboutButton").click(function() {

  });

  //button click method
  $("#getButton").click(function() {

    // get values
    let media_type = $('#mediaSelect').val();
    let time_window = $('#timeSelect').val();

    // run functions
    updateHeading(media_type, time_window);
    getData(media_type, time_window);

  });


  //default values
  media_type = 'movie';
  time_window = 'week';

  // results resultsHeading
  $('#resultsHeading').html("<p>Movies trending This Week...</p>")

  //retrieve weather data
  getData(media_type, time_window);
  updateHeading(media_type, time_window);


});

function goToTop(){
    window.scrollTo(0, 0);
}

function getData(media_type, time_window) {
  //access web service using the ajax function.
  $.ajax({
    url: makeUrl(media_type, time_window),
    dataType: 'jsonp',
    success: function(data) {

      var titles = [];
      var vote_averages = [];
      var overviews = [];
      var posters = [];
      var ids = [];
      var types = [];

      results = data['results'];

      for (resultNum in results) {

        var result = results[resultNum];

        if (result['media_type'] == 'tv') {
          var title = result['name'];

        } else {
          var title = result['title'];

        }

        var poster = result['poster_path'];
        var vote_average = result['vote_average'];
        var overview = result['overview'];
        var id = result['id'];
        var type = result['media_type'];

        posters.push(poster);
        titles.push(title);
        vote_averages.push(vote_average);
        overviews.push(overview);
        ids.push(id);
        types.push(type);
      }

      updateTable(titles, vote_averages, overviews, posters, ids, types);


    },
    error: function(xhr, status, error) {
      console.log(xhr);
      console.log(xhr.status),
        $('.error').html('Request Failed - Try Again');
    },
  });
}

//creates the url for the requested location
function makeUrl(media_type, time_window) {
  let url = "https://api.themoviedb.org/3/trending/";
  url += media_type + "/" + time_window + "?api_key=" + apiKey;
  console.log(url);
  return url;
}

function updateHeading(media_type, time_window) {
  $('#resultsHeading').html('');

  // parse input to build result heading
  if (media_type == 'tv') {
    var mediaHeading = 'TV shows trending';
  } else if (media_type == 'movie') {
    var mediaHeading = 'Movies trending';
  } else {
    var mediaHeading = 'Popular titles trending';
  };

  if (time_window == 'day') {
    var timeHeading = ' Today...'
  } else {
    var timeHeading = ' This Week...'
  }
  // output result heading
  $('#resultsHeading').append("<p>" + mediaHeading + timeHeading + "</p>");
}

function updateTable(titles, vote_averages, overviews, posters, ids, types) {
  $('#detail').html('');

  posterUrl = "https://image.tmdb.org/t/p/original/"
  tmdbUrl = "https://www.themoviedb.org/"

  for (rowNum in titles) {
    var title = titles[rowNum];
    var vote_average = vote_averages[rowNum];
    var overview = overviews[rowNum];
    var poster_path = posterUrl + posters[rowNum];
    var tmdbLink = tmdbUrl + types[rowNum] + "/" + ids[rowNum];


    $('#detail').append("<div class='card h-100' id='card'><img src= '" +
      poster_path + "'" +
      "class='card-img-top img-fluid img-thumbnail' id='imgHover'><div class='rating'> Average Rating: " +
      vote_average + "</div><div class='card-body'><h5 class='card-title'> " +
      title +
      "</h5><p class='card-text'>" +
      overview +
      "</p><a href='" + tmdbLink + "'target= '_blank' class='stretched-link'></a></div></div>");
  }
}
