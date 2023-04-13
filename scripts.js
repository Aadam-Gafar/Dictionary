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

        // Updating HTML
        var definition = parsedData[0].meanings[0].definitions[0].definition;
        document.getElementById("definition").innerHTML = definition;
    } catch {
        // Accounting for failed requests
        alert("404 (Not Found): no definition available.");
    }
}
