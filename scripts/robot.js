// Robot tableau options from Power Grid: The Robots expansion rulebook
const aOptions = {
    "Normal": (plantNum, elektro) => plantNum + 1 <= elektro ? plantNum + 1 : null,
    "+2": (plantNum, elektro) => plantNum + 2 <= elektro ? plantNum + 2 : null,
    "×2": (plantNum, elektro) => plantNum * 2 <= elektro ? plantNum * 2 : null,
    "Pass": () => null,
    "Number": (plantNum, elektro, cities) => plantNum > cities && plantNum + 1 <= elektro ? plantNum + 1 : null,
    "Highest": (plantNum, elektro, market) => {
        const highest = Math.max(...market);
        return plantNum === highest && plantNum + 1 <= elektro ? plantNum + 1 : null;
    }
};

const bOptions = {
    "Normal": (plants, elektro) => ({ count: Math.min(2, plants.length), cost: plants.slice(0, 2).reduce((sum, p) => sum + p.num, 0) }),
    "Cheap": (plants, elektro) => ({ count: 1, cost: plants[0]?.num || 0 }),
    "Expensive": (plants, elektro) => ({ count: 1, cost: plants[0]?.num * 2 || 0 }),
    "Full": (plants, elektro) => ({ count: plants.length, cost: plants.reduce((sum, p) => sum + p.num, 0) }),
    "Half": (plants, elektro) => ({ count: 1, cost: Math.floor((plants[0]?.num || 0) / 2) }),
    "None": () => ({ count: 0, cost: 0 })
};

const dOptions = {
    "Normal": (plants, cities) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities + 10),
    "Expensive": (plants, cities) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities + 10),
    "Half": (plants, cities) => Math.floor(Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities + 10) / 2),
    "2 Cities": (plants, cities) => Math.min(2, cities + 10),
    "Minimum": (plants, cities) => Math.min(1, cities + 10),
    "None": () => 0
};

const cOptions = {
    "Normal": (plants, cities, resources) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities),
    "Half": (plants, cities, resources) => Math.floor(Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities) / 2),
    "Minimum": (plants, cities, resources) => Math.min(plants[0]?.cities || 0, cities),
    "Maximum": (plants, cities, resources) => Math.min(plants.reduce((sum, p) => sum + p.cities, 0), cities),
    "2 Cities": (plants, cities, resources) => Math.min(2, cities, plants.reduce((sum, p) => sum + p.cities, 0)),
    "None": () => 0
};

const eOptions = {
    "Normal": () => ({ elektro: 0, plants: [], resources: [], cities: 0 }),
    "+10": () => ({ elektro: 10, plants: [], resources: [], cities: 0 }),
    "Plant": () => ({ elektro: 0, plants: [{ num: 13, cities: 2 }], resources: [], cities: 0 }),
    "Resources": () => ({ elektro: 0, plants: [], resources: ["coal:3", "oil:3"], cities: 0 }),
    "Cities": () => ({ elektro: 0, plants: [], resources: [], cities: 2 }),
    "Discount": () => ({ elektro: 0, plants: [], resources: [], cities: 0 })
};

// Robot class
class Robot {
    constructor(id, aCard, bCard, dCard, cCard, eCard, elektro, plants, resources, cities) {
        this.id = id;
        this.aCard = aCard;
        this.bCard = bCard;
        this.dCard = dCard;
        this.cCard = cCard;
        this.eCard = eCard;
        const special = eOptions[eCard]();
        this.elektro = elektro + special.elektro;
        this.plants = [...plants.map(num => ({ num, cities: Math.floor(num / 3) + 1 })), ...special.plants];
        this.resources = resources + (special.resources.length ? "," + special.resources.join(",") : "");
        this.cities = cities + special.cities;
        this.discount = eCard === "Discount" ? 5 : 0;
    }

    bid(plantNum, market) {
        const bidFunc = aOptions[this.aCard];
        const bid = this.aCard === "Number" ? bidFunc(plantNum, this.elektro, this.cities) :
            this.aCard === "Highest" ? bidFunc(plantNum, this.elektro, market) :
                bidFunc(plantNum, this.elektro);
        return bid ? { bid, plantNum } : null;
    }

    buyResources() {
        const resourceFunc = bOptions[this.bCard];
        const { count, cost } = resourceFunc(this.plants, this.elektro);
        return { count, cost: cost <= this.elektro ? cost : 0 };
    }

    build() {
        const buildFunc = dOptions[this.dCard];
        const citiesToBuild = buildFunc(this.plants, this.cities);
        const cost = citiesToBuild * (10 - this.discount);
        return { cities: cost <= this.elektro ? citiesToBuild : 0, cost };
    }

    power() {
        const citiesPowered = cOptions[this.cCard](this.plants, this.cities, this.resources);
        const income = [0, 10, 22, 33, 44, 54, 65, 76, 87, 98, 109, 120][citiesPowered] || 120;
        return { citiesPowered, income: this.eCard === "+10" ? income + 10 : income };
    }
}