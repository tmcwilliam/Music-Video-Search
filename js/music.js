/*
	Module to handle searching Yahoo's library of music videos
*/
var MUSIC = (function($){
	
	/* PRIVATE VARIABLES */
	var YQL_URL = 'http://query.yahooapis.com/v1/public/yql?format=json&callback=';
	
	/* PRIVATE METHODS */
	function getMusicVideoQuery(term) {
	  return 'select id,title,url,Artist.name from music.video.search where keyword="' + term + '"';
	}
	
	return {
		/* PUBLIC VARIABLES */
		public_variable: "foo",
		
		/* PUBLIC METHODS */
		/*
			Subscriber to handle searching Yahoo's music library
			@term: query entered by user
		*/		
		subscribeToSearchTerm: function(){
			$.subscribe('/search/term', function(term) {
			  $.getJSON(
			    YQL_URL, 
			    { q : getMusicVideoQuery(term) }, 
			    function(resp) {
			      if (!resp.query.results) { 
							$.publish('/search/noresults');
							return; 
						}
			      $.publish('/search/results', [ resp.query.results.Video ]);
			    }
			  );
			});
		},
	
		/*
			Subscriber to handle displaying search results
			@resultsId: HTML element id of container for results
			@results: result object from Yahoo
		*/
		subscribeToSearchResults: function(resultsId){
			$.subscribe('/search/results', function(results) {
			  var tmpl = '<li><p><a href="{{url}}" class="play_video" id="{{id}}" target="_blank">{{title}}</a> - {{artist}}</p></li>',
			      html = $.map(results, function(result) {
							var artist = result.Artist != undefined ? result.Artist.name : '';
			        return tmpl
			          .replace('{{url}}', result.url)
			          .replace('{{title}}', result.title)
								.replace('{{artist}}', artist)
								.replace('{{id}}', result.id)
			      }).join('');
			  $(resultsId).html(html);
			});
		},
	
		/*
			Subscriber to handle the display of no results
			@resultsId: HTML element id of container for results
		*/
		subscribeToNoResults: function(resultsId){
			$.subscribe('/search/noresults', function(){
				$(resultsId).html('<li><p>No Results Found. </p></li>');
			});
		},
	
		/*
			Subscriber to handle displaying a loader while executing a search
			@resultsId: HTML element id of container for results
		*/
		subscribeToShowLoader: function(resultsId){
			$.subscribe('/search/loader', function(){
				$(resultsId).html("<li><p>Loading...</p></li>");
			});
		},
		
		/*
			Subscriber to handle modal display of a video element
			@id: video id from Yahoo
		*/
		subscribeToShowVideo: function(){
			$.subscribe('/video/play', function(id){
				var tmpl = 	"<object width='576' height='356' id='uvp_fop' allowFullScreen='true'>"+
										"<param name='movie' value='http://d.yimg.com/m/up/fop/embedflv/swf/fop.swf'/>"+
										"<param name='flashVars' value='id=v{{id}}&amp;eID=1301797&amp;lang=us&amp;enableFullScreen=0&amp;shareEnable=1'/>"+
										"<param name='wmode' value='transparent'/>"+
										"<embed height='356' width='576' id='uvp_fop' allowFullScreen='true' src='http://d.yimg.com/m/up/fop/embedflv/swf/fop.swf"+ 
										"type='application/x-shockwave-flash' flashvars='id=v{{id}}&amp;eID=1301797&amp;lang=us&amp;ympsc=4195329&amp;enableFullScreen=1&amp;shareEnable=1' /></object>",
						html = tmpl.replace('{{id}}', id);
				$.modal(html);
			});
		}
	}
	
})(jQuery);