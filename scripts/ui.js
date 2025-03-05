// Info popup descriptions
function showInfo(inputId) {
    const descriptions = {
        "num-robots": "Select how many robot players (1 to 5) to simulate in the game.",
        "a-card": "Defines the robot's bidding behavior in the Auction Phase (e.g., 'Normal' bids plant number + 1, 'Pass' skips bidding).",
        "b-card": "Defines the robot's resource buying behavior (e.g., 'Normal' buys for 2 plants, 'None' buys nothing).",
        "d-card": "Defines the robot's building behavior (e.g., 'Normal' builds to match plant capacity, 'None' builds nothing).",
        "c-card": "Defines how many cities the robot powers in the Power Generation Phase (e.g., 'Normal' powers all possible, 'None' powers none).",
        "e-card": "Special ability affecting the robot (e.g., 'GETS 100 ELEKTRO' starts with 100 Elektro, 'PAYS HALF BID' reduces auction costs).",
        "elektro": "The robot's current money (Elektro) used for bidding, buying, and building.",
        "plants": "List of power plant numbers the robot owns (e.g., '3, 7, 13'). Enter as comma-separated values.",
        "resources": "Resources the robot has (e.g., 'coal:2, oil:4'). Enter as type:amount pairs separated by commas.",
        "cities": "Number of cities the robot has connected, affecting turn order and powering capacity.",
        "market": "The four power plants in the actual market available for bidding (numbers between 3 and 50).",
        "player-order": "Your position in the turn order (1st to 6th), determining when robots bid relative to you."
    };
    const key = inputId.startsWith("a-card-") ? "a-card" :
        inputId.startsWith("b-card-") ? "b-card" :
            inputId.startsWith("d-card-") ? "d-card" :
                inputId.startsWith("c-card-") ? "c-card" :
                    inputId.startsWith("e-card-") ? "e-card" :
                        inputId.startsWith("elektro-") ? "elektro" :
                            inputId.startsWith("plants-") ? "plants" :
                                inputId.startsWith("resources-") ? "resources" :
                                    inputId.startsWith("cities-") ? "cities" :
                                        inputId.startsWith("market-") ? "market" : inputId;
    alert(descriptions[key] || "No description available.");
}

// Update robot input fields dynamically
function updateRobotInputs() {
    const num = parseInt(document.getElementById("num-robots").value);
    const container = document.getElementById("robot-inputs");
    container.innerHTML = "";
    for (let i = 1; i <= num; i++) {
        container.innerHTML += `
            <div class="robot-section">
                <h3>Robot ${i}</h3>
                <label>A Card (Auction):</label>
                <select name="a-card-${i}">
                    ${Object.keys(aOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('a-card-${i}')">(i)</button><br>
                <label>B Card (Resources):</label>
                <select name="b-card-${i}">
                    ${Object.keys(bOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('b-card-${i}')">(i)</button><br>
                <label>D Card (Building):</label>
                <select name="d-card-${i}">
                    ${Object.keys(dOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('d-card-${i}')">(i)</button><br>
                <label>C Card (Power):</label>
                <select name="c-card-${i}">
                    ${Object.keys(cOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('c-card-${i}')">(i)</button><br>
                <label>E Card (Special):</label>
                <select name="e-card-${i}">
                    ${Object.keys(eOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('e-card-${i}')">(i)</button><br>
                <label>Elektro:</label><input type="number" name="elektro-${i}" value="50">
                <button type="button" class="info-btn" onclick="showInfo('elektro-${i}')">(i)</button><br>
                <label>Plants (e.g., "3, 7, 13"):</label><input type="text" name="plants-${i}" value="">
                <button type="button" class="info-btn" onclick="showInfo('plants-${i}')">(i)</button><br>
                <label>Resources (e.g., "coal:2, oil:4"):</label><input type="text" name="resources-${i}" value="">
                <button type="button" class="info-btn" onclick="showInfo('resources-${i}')">(i)</button><br>
                <label>Cities Connected:</label><input type="number" name="cities-${i}" value="0">
                <button type="button" class="info-btn" onclick="showInfo('cities-${i}')">(i)</button><br>
            </div>
        `;
    }
}