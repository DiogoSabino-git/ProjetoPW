/**
 * 1. ENTITY CLASS
 */
class Entity {
    #id;

    constructor(id) {
        // FIX: We check strictly for null or undefined, so '0' is allowed
        if (id === undefined || id === null) {
             throw new Error("ID is required for an Entity.");
        }
        this.#id = id;
    }

    // ... keep the rest of the class the same (getters/setters) ...
    get id() { return this.#id; }

    set id(newId) {
        if (this.#id !== 0 && this.#id !== null && this.#id !== undefined) {
             console.warn(`Warning: Overwriting ID ${this.#id} with ${newId}.`);
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

    /**
     * Adds a new Orchid.
     */
    addOrchid(newOrchid) {
        console.log("--> Manager: Attempting to add orchid...", newOrchid.name);

        // 1. Check uniqueness
        const exists = this.#orchids.some(o => o.name.toLowerCase() === newOrchid.name.toLowerCase());
        if (exists) {
            console.error("--> Manager: Duplicate found!");
            throw new Error("An orchid with this name already exists."); 
        }

        // 2. Generate ID
        const maxId = this.#orchids.reduce((max, orchid) => (orchid.id > max ? orchid.id : max), 0);
        const newId = maxId + 1;
        
        console.log("--> Manager: Generated new ID:", newId);
        
        // 3. Set ID on the object
        newOrchid.id = newId; 

        // 4. Push to collection (THIS IS THE CRITICAL STEP)
        this.#orchids.push(newOrchid);
        
        console.log("--> Manager: Pushed to list. New Count:", this.#orchids.length);
    }

    /**
     * Updates an existing Orchid.
     * @param {number} id - The ID of the orchid to update
     * @param {object} newDetails - Object containing the new raw values (from form)
     */
    updateOrchid(id, newDetails) {
        const orchid = this.#orchids.find(o => o.id === id);
        if (!orchid) throw new Error(`Orchid with ID ${id} not found.`);

        // Update simple properties
        orchid.name = newDetails.name;
        orchid.src = newDetails.src;

        // Update characteristics (We must find the objects again based on the new IDs)
        // Note: In a real app, we might helperize this lookup logic to avoid repetition
        if (newDetails.genus) orchid.genus = this.#genusList.find(x => x.id == newDetails.genus);
        if (newDetails.type) orchid.type = this.#typeList.find(x => x.id == newDetails.type);
        if (newDetails.luminosity) orchid.luminosity = this.#luminosityList.find(x => x.id == newDetails.luminosity);
        if (newDetails.temperature) orchid.temperature = this.#temperatureList.find(x => x.id == newDetails.temperature);
        if (newDetails.humidity) orchid.humidity = this.#humidityList.find(x => x.id == newDetails.humidity);
        if (newDetails.size) orchid.size = this.#sizeList.find(x => x.id == newDetails.size);
    }

    /**
     * Removes an Orchid by ID.
     */
    removeOrchid(id) {
        // Find the index of the orchid with this ID
        const index = this.#orchids.findIndex(o => o.id === id); 
        
        if (index !== -1) {
            // Remove 1 item at that index
            this.#orchids.splice(index, 1); 
            console.log(`Manager: Removed orchid with ID ${id}. Remaining: ${this.#orchids.length}`);
        } else {
            console.warn(`Manager: Orchid with ID ${id} not found.`);
        }
    }

    getByCategory(categoryName, characteristicId) {
        return this.#orchids.filter(orchid => {
            return orchid[categoryName].id === characteristicId;
        });
    }

}