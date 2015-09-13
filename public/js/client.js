var language = {'English': 'en', 'Norwegian': 'no', 'Spanish': 'es', 'Chinese': 'zh-CHS', 'Japanese': 'ja', 'Swedish': 'sv', 'Danish': 'da', 'Russian': 'ru' }


$(document).ready(function() {
	var currentLang = language['English'];
	var cookie = document.cookie;
	var authToken = cookie.substring(6, cookie.length);
	
	$("#langDropdown").change(function () {
    	translate(authToken, moviePlot, currentLang, language[$("#langDropdown").val()], function (data) {

    			$('#plot').text(data.substring(1,data.length - 1));
    			currentLang = language[$("#langDropdown").val()];
    	});

				
    });

});


var translate = function (token, text, from, to, callback) {
	var url = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?appId=Bearer " + token + "&from=" + from + "&to=" + to + "&text=" + text;

	$.ajax({
		type: 'GET',
		url: url,
		error: function(error) {
			console.log(error);
			callback('Please refresh this page');
		},
		success: function(xml_results) {
			callback(xml_results);
		}
	});
};
