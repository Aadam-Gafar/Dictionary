document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("entry");
    var button = document.getElementById("search");

    input.addEventListener("keydown", function (event) {
        if (event.code == "Enter") {
            getDefinition();
        }
    });
});

getDefinition(true);

async function getDefinition(isDefault) {
    // Reading user input
    var word = "";
    if (isDefault) {
        word = "dictionary";
    }
    else {
        var word = document.getElementById("entry").value;
    }


    // Accounting for non-entries
    if (word.length <= 0) {
        alert("Please enter a word.");
        return;
    }

    try {
        // Assembling API request
        var corsUrl = "https://cors-anywhere.herokuapp.com/";
        var apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

        // Receive and parse response
        var response = await fetch(corsUrl + apiUrl);
        var jsonData = await response.json();
        var stringData = JSON.stringify(jsonData);
        var parsedData = JSON.parse(stringData);

        // Updating word HTML
        var word = parsedData[0].word;
        var html = word;
        document.getElementById("word").innerHTML = html;

        // Updating phonetics HTML
        var phonetics = parsedData[0].phonetics[0].text;
        var html = phonetics;
        document.getElementById("phonetics").innerHTML = html;

        // Updating class HTML
        var wordClass = parsedData[0].meanings[0].partOfSpeech;
        var html = wordClass;
        document.getElementById("wordClass").innerHTML = html;

        // Updating definitions HTML
        var definitions = parsedData[0].meanings[0].definitions;
        var html = "";
        for (var i = 0; i < definitions.length; i++) {
            html += "<li>" + definitions[i].definition + "</li><br>";
        }
        document.getElementById("definition").innerHTML = "<ol>" + html + "</ol>";

        // Updating synonym HTML
        var synonyms = parsedData[0].meanings[0].synonyms;
        var html = "";
        for (var i = 0; i < synonyms.length; i++) {
            html += "<li>" + synonyms[i] + "</li>";
        }
        document.getElementById("synonym").innerHTML = "<ul>" + html + "</ul>";
    } catch {
        // Accounting for failed requests
        alert("404 (Not Found): no definition available.");
    }
}