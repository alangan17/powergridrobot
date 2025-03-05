// Info popup descriptions
function showInfo(inputId) {
    const descriptions = {
        "num-robots": "Select how many robot players (1 to 5) to simulate in the game.",
        "phase-1-card": "Defines the robot's first city placement rule (e.g., 'LAST CHOICE' builds last, 'RANDOM CHOICE' builds randomly). Not simulated in Auction Phase.",
        "phase-2-card": "Defines the robot's bidding behavior in the Auction Phase (e.g., 'USING CHEAPEST RESOURCES' bids on highest of cheapest, 'ALL POWER PLANTS' bids on all).",
        "phase-3-card": "Defines the robot's resource buying behavior (e.g., 'NORMAL PRODUCTION' buys for 2 plants, 'ALL RESOURCES' buys max possible).",
        "phase-4-card": "Defines the robot's building behavior in the Building Phase (e.g., 'ALL CITIES' builds max possible, 'ONLY SUPPLIED CITIES' limits to supply).",
        "special-card": "Special ability affecting the robot (e.g., 'GETS 100 ELEKTRO' starts with 100 Elektro, 'PAYS HALF BID' reduces auction costs).",
        "elektro": "The robot's current money (Elektro) used for bidding, buying, and building.",
        "plants": "List of power plant numbers the robot owns (e.g., '3, 7, 13'). Enter as comma-separated values.",
        "resources": "Resources the robot has (e.g., 'coal:2, oil:4'). Enter as type:amount pairs separated by commas.",
        "cities": "Number of cities the robot has connected, affecting turn order and powering capacity.",
        "market": "The four power plants in the actual market available for bidding (numbers between 3 and 50).",
        "player-order": "Your position in the turn order (1st to 6th), determining when robots bid relative to you."
    };
    const key = inputId.startsWith("a-card-") ? "phase-1-card" :
        inputId.startsWith("b-card-") ? "phase-2-card" :
            inputId.startsWith("c-card-") ? "phase-3-card" :
                inputId.startsWith("d-card-") ? "phase-4-card" :
                    inputId.startsWith("e-card-") ? "special-card" :
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
                <label>Phase 1: The First City:</label>
                <select name="a-card-${i}">
                    ${Object.keys(aOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('a-card-${i}')">(i)</button><br>
                <label>Phase 2: Auction Power Plants:</label>
                <select name="b-card-${i}">
                    ${Object.keys(bOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('b-card-${i}')">(i)</button><br>
                <label>Phase 3: Buying Resources:</label>
                <select name="c-card-${i}">
                    ${Object.keys(cOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('c-card-${i}')">(i)</button><br>
                <label>Phase 4: Building:</label>
                <select name="d-card-${i}">
                    ${Object.keys(dOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select>
                <button type="button" class="info-btn" onclick="showInfo('d-card-${i}')">(i)</button><br>
                <label>Special Abilities:</label>
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