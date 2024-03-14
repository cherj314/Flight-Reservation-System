class Destination {
    constructor() {
        this.table = 'destinations';
        this.destination_id = '';
    }

    setInfo({destination_id, destination_name}) {
        this.destination_id = destination_id;
        this.destination_name = destination_name;
        return this;
    }
}

module.exports = Destination;
