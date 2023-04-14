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

function displayDefinition(number) {
    number += 1;
    var allDefinitions = document.querySelectorAll('[id*="dfn"]');
    allDefinitions.forEach(element => {
        if (element == document.getElementById("dfn" + number)) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });
}


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
        var meanings = parsedData[0].meanings;
        var wordClass;
        var html;
        document.getElementById("definition").innerHTML = "";
        document.getElementById("classBox").innerHTML = "";
        for (var i = 0; i < meanings.length; i++) {
            wordClass = meanings[i].partOfSpeech;
            html = "<span class='wordClass' onclick='displayDefinition(" + i + ");'>" + wordClass + "</span>";
            document.getElementById("classBox").innerHTML += html;
        }

        // Updating definitions HTML
        var meanings = parsedData[0].meanings;
        var html = "";
        for (var i = 0; i < meanings.length; i++) {
            var definitions = meanings[i].definitions;
            var defHtml = "";
            for (var j = 0; j < definitions.length; j++) {
                defHtml += "<li>" + definitions[j].definition + "</li><br>";
            }
            html += "<ol id='dfn" + (i + 1) + "'>" + defHtml + "</ol>";
        }
        document.getElementById("definition").innerHTML = html;

        // Updating synonym HTML
        var synonyms = parsedData[0].meanings[0].synonyms;
        var html = "";
        for (var i = 0; i < synonyms.length; i++) {
            html += "<span id='pill'>" + synonyms[i] + "</span>";
        }
        document.getElementById("synonym").innerHTML = html;

        // Updating antonym HTML
        var antonyms = parsedData[0].meanings[0].antonyms;
        var html = "";
        for (var i = 0; i < antonyms.length; i++) {
            html += "<span id='pill'>" + antonyms[i] + "</span>";
        }
        document.getElementById("antonym").innerHTML = html;
    } catch {
        // Accounting for failed requests
        alert("404 (Not Found): no definition available.");
    }
}