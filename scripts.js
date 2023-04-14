async function getDefinition() {
    // Reading user input
    var word = document.getElementById("word").value;

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
        console.log("Parsed data: " + parsedData);

        // Updating HTML
        var definitions = parsedData[0].meanings[0].definitions;
        var html = "";
        for (var i = 0; i < definitions.length; i++) {
            console.log("Adding: " + definitions[i].definition);
            html += "<li>" + definitions[i].definition + "</li>";
        }
        document.getElementById("definition").innerHTML = "<ul>" + html + "</ul>";
    } catch {
        // Accounting for failed requests
        alert("404 (Not Found): no definition available.");
    }
}
