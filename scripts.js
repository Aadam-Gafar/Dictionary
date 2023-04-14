async function getDefinition() {
    // Reading user input
    var word = document.getElementById("entry").value;

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

        // Updating definitions HTML
        var definitions = parsedData[0].meanings[0].definitions;
        var html = "";
        for (var i = 0; i < definitions.length; i++) {
            html += "<li>" + definitions[i].definition + "</li>";
        }
        document.getElementById("definition").innerHTML = "<ul>" + html + "</ul>";
    } catch {
        // Accounting for failed requests
        alert("404 (Not Found): no definition available.");
    }
}
