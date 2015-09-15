var language = {'English': 'en', 'Norwegian': 'no', 'Spanish': 'es', 'Chinese': 'zh-CHS', 'Japanese': 'ja', 'Swedish': 'sv', 'Danish': 'da', 'Russian': 'ru', 'French': 'fr', 'German': 'de', 'Dutch': 'nl' }


$(document).ready(function() {
	var currentLang = language['English'];
	var cookie = document.cookie;
	var authToken = cookie.substring(6, cookie.length);


	/**
	* Creates dropdown for language selection for translation of plot
	*/
	if ( !($('#langDropdownDiv').length === 0) ) {
		createDropdown('langDropdownDiv', 'langDropdown', language);
	};

	/**
	* Creates dropdown for language selection for subtitles
	*/
	if ( !($('#subtitleDropdownDiv').length === 0) ) {
		createDropdown('subtitleDropdownDiv', 'subtitleDropdown', language);
	};

	/**
	* Calls the translate API if another language is selected from the plot language drop and updates the text with the translated value.
	*/
	$("#langDropdown").change(function () {
		translate(authToken, moviePlot, currentLang, language[$("#langDropdown").val()], function (data) {
				$('#plot').text(data.substring(1,data.length - 1));
				currentLang = language[$("#langDropdown").val()];
		});		
	});

});



/**
* Translates a given text, using the token received from the server
* @params {string} token - The token received from the server.
* @params {string} text - The text to be translated.
* @params {string} from - The language which the text will be translated from.
* @params {string} to - The language which the text will be translated into.
*/
var translate = function (token, text, from, to, callback) {
	var url = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?appId=Bearer " + token + "&from=" + from + "&to=" + to + "&text=" + encodeURIComponent(text);

	$.ajax({
		type: 'GET',
		url: url,
		error: function(error) {
			console.log(error);
			callback('Please refresh this page');
		},
		success: function(xml_results) {
			callback(xml_results.replace(/\\"/g, '"'));
		}
	});
};


/**
* Creates a dropdown from a list of items
* @params {string} location - The id of the div where you want to create the dropdown 
* @params {string} movie - The id of the new dropdown for later references
* @params {object} arrayOfOptions - The array of the options that will populate the dropdown. The keys of the items are used
*/
var createDropdown = function (location, id, arrayOfOptions) {
	var myDiv = $("#" + location)[0];

	var selectList = document.createElement("select");
	selectList.id = id;
	selectList.className = 'btn btn-lg'
	selectList.name = 'selectLanguage';
	myDiv.appendChild(selectList);


	/**
	* Creates all the options in the dropdown from the elements in arrayOfOptions
	*/
	for (key in arrayOfOptions) {
	    var option = document.createElement("option");
	    option.value = key;
	    option.text = key;
	    selectList.appendChild(option);
	}
}

/**
* Downloads the selected subtitle
*/
function redirectToLink(value){
	value = value.substr(7);
	var downloadString = 'download-subtitle';
	var url = value.split('/');
	var id = url.pop()

	url.push(downloadString);
	url.push(id);
	link = "http://www." + url.join('/');
	window.location.href = link;
}
