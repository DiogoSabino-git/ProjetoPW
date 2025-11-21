/**
 * 1. ENTITY CLASS
 */
class Entity {

    #id;

    constructor(id) {
        if (!id) throw new Error("ID is required for an Entity."); //Ensure id is there
            this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set id(newId) {
        if (this.#id !== 0 && this.#id !== null && this.#id !== undefined) {
             console.warn("Warning: You are overwriting an existing ID.");
        }
        this.#id = newId;
    }
}

/**
 * 2. CARACTERISTIC CLASS
 */
class Characteristic extends Entity {

    #description;

    constructor(id, description) {
        super(id);
        this.#description = description;
    }

    get description() {
        return this.#description;
    }

    set description(newDescription) {
        if (newDescription && typeof newDescription === 'string') {
            this.#description = newDescription;
        } else {
            console.error("Invalid description");
        }
    }
}

/**
 * 3. ORCHID CLASS
 */
class Orchid extends Entity{
    #name;
    #src;
    #genus;
    #type;
    #luminosity;
    #temperature;
    #humidity;
    #size;

    constructor(id, name, src, genus, type, luminosity, temperature, humidity, size){
        super(id);
        this.#name = name;
        this.#src=src;

        this.#genus=genus;
        this.#type=type;
        this.#luminosity=luminosity;
        this.#temperature=temperature;
        this.#humidity=humidity;
        this.#size=size;
    }

    get name(){return this.#name;}
    set name(val){this.#name=val;}

    get src() { return this.#src; }
    set src(val) { this.#src = val; }

    get genus() { return this.#genus; }
    set genus(val) {this.#genus = val; }

    get type() { return this.#type; }
    set type(val) { this.#type = val; }

    get luminosity() { return this.#luminosity; }
    set luminosity(val) { this.#luminosity = val; }

    get temperature() { return this.#temperature; }
    set temperature(val) { this.#temperature = val; }

    get humidity() { return this.#humidity; }
    set humidity(val) { this.#humidity = val; }

    get size() { return this.#size; }
    set size(val) { this.#size = val; }
}

/**
 * 4. ORCHID MANAGER CLASS
 */
class OrchidManager {

    #genusList = [];
    #typeList = [];
    #luminosityList = [];
    #temperatureList = [];
    #humidityList = [];
    #sizeList = [];
    #orchids = [];

    constructor(data) {

        //Convert data characteristics
        this.#genusList = data.genus.map(item => new Characteristic(item.id, item.description));
        this.#typeList = data.type.map(item => new Characteristic(item.id, item.description));
        this.#luminosityList = data.luminosity.map(item => new Characteristic(item.id, item.description));
        this.#temperatureList = data.temperature.map(item => new Characteristic(item.id, item.description));
        this.#humidityList = data.humidity.map(item => new Characteristic(item.id, item.description));
        this.#sizeList = data.size.map(item => new Characteristic(item.id, item.description));

        //Convert orchids into Objects
        this.#orchids = data.orchid.map(o => {
            const genusObj = this.#genusList.find(x => x.id === o.genus);
            const typeObj = this.#typeList.find(x => x.id === o.type);
            const lumObj = this.#luminosityList.find(x => x.id === o.luminosity);
            const tempObj = this.#temperatureList.find(x => x.id === o.temperature);
            const humObj = this.#humidityList.find(x => x.id === o.humidity);
            const sizeObj = this.#sizeList.find(x => x.id === o.size);

            return new Orchid(
                o.id, 
                o.description,
                o.src, 
                genusObj, 
                typeObj, 
                lumObj, 
                tempObj, 
                humObj, 
                sizeObj
            );
        });
    }

    get orchids() { return this.#orchids; }
    
    get genusList() { return this.#genusList; }
    get typeList() { return this.#typeList; }
    get luminosityList() { return this.#luminosityList; }
    get temperatureList() { return this.#temperatureList; }
    get humidityList() { return this.#humidityList; }
    get sizeList() { return this.#sizeList; }

    addOrchid(newOrchid) {
        const exists = this.#orchids.some(o => o.name.toLowerCase() === newOrchid.name.toLowerCase());
        if (exists) {
            throw new Error("An orchid with this name already exists."); // [cite: 7280]
        }


    }

    removeOrchid(id) {
        const index = this.#orchids.findIndex(o => o.id === id);
        if (index !== -1) {
            this.#orchids.splice(index, 1);
        }

        const maxId = this.#orchids.reduce((max, orchid) => (orchid.id > max ? orchid.id : max), 0);
        const newId = maxId + 1;
        newOrchid.id = newId;

        this.#orchids.push(newOrchid);
    }

    getByCategory(categoryName, characteristicId) {
        return this.#orchids.filter(orchid => {
            return orchid[categoryName].id === characteristicId;
        });
    }

}