
$(document).ready(function() {

    // process the form
    $('search-form').submit(function(event) {
    	console.log("JQURY AJAX POST")

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'movieSearch'              : $('input[name=movieSearch]').val(),
            'subtitle'             : $('input[name=subtitle]').val()
        };

        // process the form
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        encode          : true
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data); 
                console.log("JQUERY AJAX");

                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});