/* traditional way */
/*(function($) {

$(document).ready(function() {
  $('#searchForm').submit(function(e) {
    var term = $.trim($(this).find('input[name="query"]').val());

    if (!term) { return; }

    $.getJSON(
      'http://query.yahooapis.com/v1/public/yql?format=json&callback=', 
      { q : getQuery(term) }, 
      function(resp) {

        var results = resp.query.results.Video, 
            tmpl = '<li><p><a href="{{url}}">{{title}}</a> - {{artist}}</p></li>',
            html;

        if (!results.length) { return; }

        html = $.map(results, function(result) {
          return tmpl
            .replace('{{url}}', result.url)
            .replace('{{title}}', result.title)
						.replace('{{artist}}', result.Artist.name)
        }).join('');

        $('#video_results').html(html);
      }
    );

    e.preventDefault();
  });

  function getQuery(term) {
    return 'select title,url,Artist.name from music.video.search where keyword="' + term + '"';
  }
});

})(jQuery);
*/

/* pubsub way */
(function($) {

var RESULTS_ID = '#video_results';

MUSIC.subscribeToSearchTerm();
MUSIC.subscribeToSearchResults(RESULTS_ID);
MUSIC.subscribeToNoResults(RESULTS_ID);
MUSIC.subscribeToShowVideo();
MUSIC.subscribeToShowLoader(RESULTS_ID);

$(document).ready(function() {
  $('#searchForm').submit(function(e) {
    e.preventDefault();
    var term = $.trim($(this).find('input[name="query"]').val());
    if (!term) { return; }
		$.publish('/search/loader', []);
    $.publish('/search/term', [ term ]);
  });

	$('#video_results').delegate(".play_video", 'click', function(e) {
		e.preventDefault();
		var video_id = $(this).attr("id");
	  $.publish('/video/play', [ video_id ]);
	});
});

})(jQuery);