// Robot tableau options
const aOptions = { // Phase 1: The First City - city placement rules (not used in auction)
    "LAST CHOICE": () => null,
    "RANDOM CHOICE": () => null,
    "EARLY CHOICE FOR ALL": () => null,
    "PLAYERS CHOICE": () => null,
    "BIDDING CHOICE": () => null,
    "DECIDING CHOICE": () => null
};

const bOptions = { // Phase 2: Auction Power Plants
    "USING CHEAPEST RESOURCES": (plantNum, elektro, market) => {
        const sortedMarket = [...market].sort((a, b) => a - b);
        const cheapestTwo = sortedMarket.slice(0, 2);
        const target = Math.max(...cheapestTwo);
        if (plantNum === target) {
            const maxBid = plantNum + 5;
            return maxBid <= elektro ? maxBid : null;
        }
        return null;
    },
    "BUYS THE FIRST CHOICE FOR MINIMUM BID": (plantNum, elektro, market) => {
        const sortedMarket = [...market].sort((a, b) => a - b);
        if (plantNum === sortedMarket[0]) return plantNum <= elektro ? plantNum : null;
        return null;
    },
    "SUPPLYING MOST CITIES": (plantNum, elektro, market) => {
        const sortedMarket = [...market].sort((a, b) => b - a);
        const target = sortedMarket[0];
        if (plantNum === target) {
            const maxBid = plantNum + 10;
            return maxBid <= elektro ? maxBid : null;
        }
        return null;
    },
    "HIGHEST NUMBER": (plantNum, elektro, market, cities) => {
        const target = Math.max(...market);
        if (plantNum === target) {
            const maxBid = plantNum + cities;
            return maxBid <= elektro ? maxBid : null;
        }
        return null;
    },
    "SECOND SMALLEST": (plantNum, elektro, market) => {
        const sortedMarket = [...market].sort((a, b) => a - b);
        if (sortedMarket.length >= 2 && plantNum === sortedMarket[1]) return plantNum <= elektro ? plantNum : null;
        return null;
    },
    "ALL POWER PLANTS": (plantNum, elektro) => {
        const maxBid = plantNum + 1;
        return maxBid <= elektro ? maxBid : null;
    }
};

const cOptions = { // Phase 3: Buying Resources
    "NORMAL PRODUCTION AND LESS THAN 5 ELEKTRO": (plants, elektro) => {
        const normalCost = plants.slice(0, 2).reduce((sum, p) => sum + p.num, 0);
        const extraCost = Math.min(5, elektro - normalCost);
        return { count: Math.min(2, plants.length) + (extraCost > 0 ? 1 : 0), cost: normalCost + extraCost };
    },
    "ALL RESOURCES": (plants, elektro) => {
        const totalCost = plants.reduce((sum, p) => sum + p.num, 0);
        return { count: plants.length, cost: Math.min(totalCost, elektro) };
    },
    "LAST: ALL RESOURCES, OTHERWISE NORMAL PRODUCTION": (plants, elektro, isLast) => {
        if (isLast) {
            const totalCost = plants.reduce((sum, p) => sum + p.num, 0);
            return { count: plants.length, cost: Math.min(totalCost, elektro) };
        } else {
            const normalCost = plants.slice(0, 2).reduce((sum, p) => sum + p.num, 0);
            return { count: Math.min(2, plants.length), cost: normalCost };
        }
    },
    "NORMAL PRODUCTION": (plants, elektro) => {
        const normalCost = plants.slice(0, 2).reduce((sum, p) => sum + p.num, 0);
        return { count: Math.min(2, plants.length), cost: normalCost };
    },
    "NORMAL PRODUCTION AND LEAST AVAILABLE RESOURCES": (plants, elektro) => {
        const normalCost = plants.slice(0, 2).reduce((sum, p) => sum + p.num, 0);
        const extraCost = plants[0]?.num || 0;
        return { count: Math.min(2, plants.length) + 1, cost: normalCost + extraCost };
    },
    "ODD TURN: NORMAL PRODUCTION, EVEN TURN: ALL RESOURCES": (plants, elektro) => {
        const totalCost = plants.reduce((sum, p) => sum + p.num, 0);
        return { count: plants.length, cost: Math.min(totalCost, elektro) };
    }
};

const dOptions = { // Phase 4: Building
    "LAST PLAYER CHOOSES, CANNOT BUILD THROUGH POSSIBLE CITIES": (plants, cities, elektro) => Math.floor(elektro / 10),
    "ALL CITIES, NEVER MORE THAN FIRST PLAYER": (plants, cities, elektro) => Math.min(Math.floor(elektro / 10), 7),
    "ONLY SUPPLIED CITIES": (plants, cities, elektro) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), Math.floor(elektro / 10)),
    "STEP 1: ALL CITIES BUT LESS THAN 7, OTHERWISE ALL CITIES": (plants, cities, elektro) => {
        const maxAffordable = Math.floor(elektro / 10);
        return maxAffordable < 7 ? maxAffordable : Math.min(maxAffordable, 6);
    },
    "STEP 1: 1 CITY, STEP 2: 2 CITIES, STEP 3: 3 CITIES": (plants, cities, elektro) => Math.min(2, Math.floor(elektro / 10)),
    "ALL CITIES": (plants, cities, elektro) => Math.floor(elektro / 10)
};

const eOptions = { // Special Abilities
    "GAME START: GETS 100 ELEKTRO": () => ({ elektro: 50, plants: [], resources: [], cities: 0 }),
    "PHASE 1: ALWAYS LAST IN PLAYER ORDER": () => ({ elektro: 0, plants: [], resources: [], cities: 0 }),
    "PHASE 2: PAYS HALF BID FOR POWER PLANTS": () => ({ elektro: 0, plants: [], resources: [], cities: 0 }),
    "PHASE 4: ALL CITIES COST 10 ELEKTRO": () => ({ elektro: 0, plants: [], resources: [], cities: 0 }),
    "PHASE 4: ALWAYS BUILDS FIRST CITY FOR 0 ELEKTRO": () => ({ elektro: 0, plants: [], resources: [], cities: 0 }),
    "PHASE 5: GETS INCOME FOR +1 CITY": () => ({ elektro: 0, plants: [], resources: [], cities: 0 })
};

// Robot class
class Robot {
    constructor(id, aCard, bCard, dCard, cCard, eCard, elektro, plants, resources, cities) {
        this.id = id;
        this.phase1Card = aCard; // "Phase 1: The First City"
        this.phase2Card = bCard; // "Phase 2: Auction Power Plants"
        this.phase3Card = cCard; // "Phase 3: Buying Resources"
        this.phase4Card = dCard; // "Phase 4: Building"
        this.specialCard = eCard; // "Special Abilities"
        const special = eOptions[eCard]();
        this.elektro = elektro + special.elektro;
        this.plants = [...plants.map(num => ({ num, cities: Math.floor(num / 3) + 1 })), ...special.plants];
        this.resources = resources + (special.resources.length ? "," + special.resources.join(",") : "");
        this.cities = cities + special.cities;
        this.firstCityBuiltThisPhase = false;
    }

    bid(plantNum, market) { // Uses Phase 2 card
        const bidFunc = bOptions[this.phase2Card];
        const bid = this.phase2Card === "Number" ? bidFunc(plantNum, this.elektro, market, this.cities) :
            this.phase2Card === "Highest" ? bidFunc(plantNum, this.elektro, market, this.cities) :
                bidFunc(plantNum, this.elektro, market);
        if (bid) {
            const actualCost = this.specialCard === "PHASE 2: PAYS HALF BID FOR POWER PLANTS" ? Math.floor(bid / 2) : bid;
            return { bid, actualCost, plantNum };
        }
        return null;
    }

    buyResources(isLast) { // Uses Phase 3 card, with isLast parameter
        const resourceFunc = cOptions[this.phase3Card];
        const { count, cost } = this.phase3Card === "LAST: ALL RESOURCES, OTHERWISE NORMAL PRODUCTION" ?
            resourceFunc(this.plants, this.elektro, isLast) :
            resourceFunc(this.plants, this.elektro);
        return { count, cost: cost <= this.elektro ? cost : 0 };
    }

    build() { // Uses Phase 4 card
        const buildFunc = dOptions[this.phase4Card];
        const citiesToBuild = buildFunc(this.plants, this.cities, this.elektro);
        let cost;
        if (this.specialCard === "PHASE 4: ALL CITIES COST 10 ELEKTRO") {
            cost = citiesToBuild * 10;
        } else if (this.specialCard === "PHASE 4: ALWAYS BUILDS FIRST CITY FOR 0 ELEKTRO" && !this.firstCityBuiltThisPhase) {
            cost = (citiesToBuild - 1) * 10;
            this.firstCityBuiltThisPhase = true;
        } else {
            cost = citiesToBuild * 10;
        }
        return { cities: cost <= this.elektro ? citiesToBuild : 0, cost };
    }

    power() { // Uses Phase 3 card indirectly
        const citiesPowered = cOptions[this.phase3Card](this.plants, this.cities, this.resources);
        const adjustedCities = this.specialCard === "PHASE 5: GETS INCOME FOR +1 CITY" ? citiesPowered + 1 : citiesPowered;
        const income = [0, 10, 22, 33, 44, 54, 65, 76, 87, 98, 109, 120][adjustedCities] || 120;
        return { citiesPowered, income };
    }

    resetPhase() {
        this.firstCityBuiltThisPhase = false;
    }
}