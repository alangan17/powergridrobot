// Simulate all phases
function simulate() {
    const form = document.getElementById("sim-form");
    const formData = new FormData(form);
    const numRobots = parseInt(formData.get("num-robots"));
    const market = [
        parseInt(formData.get("market-1")),
        parseInt(formData.get("market-2")),
        parseInt(formData.get("market-3")),
        parseInt(formData.get("market-4"))
    ].filter(n => !isNaN(n));
    const playerOrder = parseInt(formData.get("player-order"));

    const robots = [];
    for (let i = 1; i <= numRobots; i++) {
        const aCard = formData.get(`a-card-${i}`); // Phase 1
        const bCard = formData.get(`b-card-${i}`); // Phase 2
        const dCard = formData.get(`d-card-${i}`); // Phase 4
        const cCard = formData.get(`c-card-${i}`); // Phase 3
        const eCard = formData.get(`e-card-${i}`); // Special
        const elektro = parseInt(formData.get(`elektro-${i}`));
        const plants = formData.get(`plants-${i}`).split(",").map(Number).filter(n => !isNaN(n));
        const resources = formData.get(`resources-${i}`);
        const cities = parseInt(formData.get(`cities-${i}`));
        robots.push(new Robot(i, aCard, bCard, dCard, cCard, eCard, elektro, plants, resources, cities));
    }

    let results = "<h2>Simulation Results</h2>";

    // Adjust turn order for "PHASE 1: ALWAYS LAST IN PLAYER ORDER"
    const lastInOrderRobots = robots.filter(r => r.specialCard === "PHASE 1: ALWAYS LAST IN PLAYER ORDER");
    const otherRobots = robots.filter(r => r.specialCard !== "PHASE 1: ALWAYS LAST IN PLAYER ORDER");
    const bidders = [
        ...otherRobots.sort((a, b) => b.cities - a.cities || b.plants[0]?.num - a.plants[0]?.num),
        ...lastInOrderRobots
    ];
    const bidderOrder = bidders.map(r => r.id - 1);
    bidderOrder.splice(playerOrder - 1, 0, -1);

    // Auction Phase (uses Phase 2: Auction Power Plants)
    results += "<h3>Auction Phase</h3>";
    let available = [...market];
    for (let i = 0; i < bidderOrder.length && available.length > 0; i++) {
        if (bidderOrder[i] === -1) continue;
        const robot = robots[bidderOrder[i]];
        if (robot.plants.length >= 3) {
            results += `Robot ${robot.id}: Passes (owns 3 plants)<br>`;
            continue;
        }
        const bid = robot.bid(available[0], available);
        if (bid) {
            robot.elektro -= bid.actualCost;
            robot.plants.push({ num: bid.plantNum, cities: Math.floor(bid.plantNum / 3) + 1 });
            if (robot.plants.length > 3) robot.plants.shift();
            results += `Robot ${robot.id}: Bids ${bid.bid} (pays ${bid.actualCost}) on plant ${bid.plantNum}<br>`;
            available.shift();
        } else {
            results += `Robot ${robot.id}: Passes<br>`;
        }
    }

    // Resource Purchase Phase (uses Phase 3: Buying Resources)
    results += "<h3>Resource Purchase Phase</h3>";
    const resourceOrder = [...bidders];
    for (let i = 0; i < resourceOrder.length; i++) {
        const robot = resourceOrder[i];
        const isLast = i === resourceOrder.length - 1;
        const resources = robot.buyResources(isLast);
        if (resources.cost > 0) {
            robot.elektro -= resources.cost;
            results += `Robot ${robot.id}: Buys resources for ${resources.count} plant(s) costing ${resources.cost} Elektro<br>`;
        } else {
            results += `Robot ${robot.id}: Buys no resources<br>`;
        }
    }

    // Building Phase (uses Phase 4: Building)
    results += "<h3>Building Phase</h3>";
    robots.forEach(robot => {
        const build = robot.build();
        if (build.cities > 0) {
            robot.cities += build.cities;
            robot.elektro -= build.cost;
            results += `Robot ${robot.id}: Builds ${build.cities} cities costing ${build.cost} Elektro<br>`;
        } else {
            results += `Robot ${robot.id}: Builds no cities<br>`;
        }
    });

    // Power Generation Phase (uses Phase 3 indirectly for powering logic)
    results += "<h3>Power Generation Phase</h3>";
    robots.forEach(robot => {
        const power = robot.power();
        robot.elektro += power.income;
        results += `Robot ${robot.id}: Powers ${power.citiesPowered} cities, earns ${power.income} Elektro<br>`;
    });

    // Reset phase-specific flags
    robots.forEach(robot => robot.resetPhase());

    document.getElementById("results").innerHTML = results;
}