class HarvesterHelper {
    /**
     * Creates a new Harvester helper.
     * @class
     */
    constructor() {
        
    }

    /**
     * Counts the number of spawned Harvesters.
     * @returns {number} Result.
     */
    Count() {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        return harvesters.length;
    }
}