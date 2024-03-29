document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("entry");
    var button = document.getElementById("search");

    input.addEventListener("keydown", function (event) {
        if (event.code == "Enter") {
            getDefinition(false);
        }
    });

    getDefinition(true);
displayDefinition("", 0);
});



function displayDefinition(originElement, number) {
    number += 1;
    var allDefinitions = document.querySelectorAll('[id*="dfn"]');
    allDefinitions.forEach(element => {
        if (element.id == "dfn" + number) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });

    var allClasses = document.querySelectorAll('[class*="wordClass"');
    
    allClasses.forEach(element => {
        if (element == originElement) {
            console.log(element);
            element.id = "active";
        }
        else {
            element.id = "inactive";
        }
    });

    if (originElement == "") {
        allClasses[0].id = "active";
    }
    
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
        return;
    }

    try {
        // Assembling API request
        var apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

        // Receive and parse response
        var response = await fetch(apiUrl);
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
            if (i==0) {
                html = "<span class='wordClass' onclick='displayDefinition(this, " + i + ");' id='active'>" + wordClass + "</span>";
            }
            else {
                html = "<span class='wordClass' onclick='displayDefinition(this, " + i + ");'>" + wordClass + "</span>";
            }
            
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

        displayDefinition("", 0);
    } catch {
        // Accounting for failed requests
        document.getElementById("word").innerHTML = "Ouch!";
        document.getElementById("phonetics").innerHTML = "/ˈaʊtʃ/";
        document.getElementById("definition").innerHTML = "No results found for: " + word;
        document.getElementById("classBox").innerHTML = "";
        document.getElementById("synonym").innerHTML = "";
        document.getElementById("antonym").innerHTML = "";
    }
}