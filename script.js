// Robot tableau options (simplified from expansion)
const aOptions = {
    "Bid + 2": (plantNum, elektro) => plantNum + 2 <= elektro ? plantNum + 2 : null,
    "Bid × 2": (plantNum, elektro) => plantNum * 2 <= elektro ? plantNum * 2 : null,
    "Pass": () => null
};
const cOptions = {
    "Power Max": (plants, cities, resources) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities),
    "Power Min": (plants, cities) => Math.min(plants[0]?.cities || 0, cities),
    "Power 2": (plants, cities) => Math.min(2, cities)
};

// Robot class
class Robot {
    constructor(id, aCard, cCard, elektro, plants, resources, cities) {
        this.id = id;
        this.aCard = aCard;
        this.cCard = cCard;
        this.elektro = elektro;
        this.plants = plants.map(num => ({ num, cities: Math.floor(num / 3) + 1 })); // Simplified capacity
        this.resources = resources;
        this.cities = cities;
    }

    bid(plantNum) {
        const bid = aOptions[this.aCard](plantNum, this.elektro);
        return bid ? { bid, plantNum } : null;
    }

    power() {
        const citiesPowered = cOptions[this.cCard](this.plants, this.cities, this.resources);
        const income = [0, 10, 22, 33, 44, 54, 65, 76, 87, 98, 109, 120][citiesPowered] || 120;
        return { citiesPowered, income };
    }
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
                </select><br>
                <label>C Card (Power):</label>
                <select name="c-card-${i}">
                    ${Object.keys(cOptions).map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                </select><br>
                <label>Elektro:</label><input type="number" name="elektro-${i}" value="50"><br>
                <label>Plants (e.g., "3, 7, 13"):</label><input type="text" name="plants-${i}" value=""><br>
                <label>Resources (e.g., "coal:2, oil:4"):</label><input type="text" name="resources-${i}" value=""><br>
                <label>Cities Connected:</label><input type="number" name="cities-${i}" value="0"><br>
            </div>
        `;
    }
}

// Simulate auction and power generation
function simulate() {
    const form = document.getElementById("sim-form");
    const formData = new FormData(form);
    const numRobots = parseInt(formData.get("num-robots"));
    const market = formData.get("market").split(",").map(Number);
    const playerOrder = parseInt(formData.get("player-order"));

    const robots = [];
    for (let i = 1; i <= numRobots; i++) {
        const aCard = formData.get(`a-card-${i}`);
        const cCard = formData.get(`c-card-${i}`);
        const elektro = parseInt(formData.get(`elektro-${i}`));
        const plants = formData.get(`plants-${i}`).split(",").map(Number).filter(n => !isNaN(n));
        const resources = formData.get(`resources-${i}`); // Simplified, not fully parsed
        const cities = parseInt(formData.get(`cities-${i}`));
        robots.push(new Robot(i, aCard, cCard, elektro, plants, resources, cities));
    }

    let results = "<h2>Simulation Results</h2>";
    const bidders = robots.sort((a, b) => b.cities - a.cities || b.plants[0]?.num - a.plants[0]?.num);
    const bidderOrder = bidders.map(r => r.id - 1);
    bidderOrder.splice(playerOrder - 1, 0, -1); // -1 represents player

    // Auction Phase
    results += "<h3>Auction Phase</h3>";
    let available = [...market];
    for (let i = 0; i < bidderOrder.length && available.length > 0; i++) {
        if (bidderOrder[i] === -1) continue; // Skip player
        const robot = robots[bidderOrder[i]];
        if (robot.plants.length >= 3) {
            results += `Robot ${robot.id}: Passes (owns 3 plants)<br>`;
            continue;
        }
        const bid = robot.bid(available[0]);
        if (bid) {
            robot.elektro -= bid.bid;
            robot.plants.push({ num: bid.plantNum, cities: Math.floor(bid.plantNum / 3) + 1 });
            if (robot.plants.length > 3) robot.plants.shift(); // Discard lowest
            results += `Robot ${robot.id}: Bids ${bid.bid} on plant ${bid.plantNum}<br>`;
            available.shift();
        } else {
            results += `Robot ${robot.id}: Passes<br>`;
        }
    }

    // Power Generation Phase
    results += "<h3>Power Generation Phase</h3>";
    robots.forEach(robot => {
        const power = robot.power();
        robot.elektro += power.income;
        results += `Robot ${robot.id}: Powers ${power.citiesPowered} cities, earns ${power.income} Elektro<br>`;
    });

    document.getElementById("results").innerHTML = results;
}

// Initial setup
window.onload = updateRobotInputs;