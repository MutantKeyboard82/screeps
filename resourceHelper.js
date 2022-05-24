class ResourceHelper {
    /**
     * Creates a new Resource helper.
     * @class
     */
    constructor() {

    }

    /**
     * Checks if all the Extensions and Spawn is full in the Room of the given Spawn.
     * @param {string} spawnName The name of the Spawn to check energy availability.
     * @returns {boolean} True or False.
     */
    IsEnergyFull(spawnName) {
        var targets = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN;
            }
        });
        var resourceCount = 0;
        var resourceCapacity = 0;
        for (var i in targets) {
            resourceCount = resourceCount + targets[i].store.getUsedCapacity(RESOURCE_ENERGY);
            resourceCapacity = resourceCapacity + targets[i].store.getCapacity(RESOURCE_ENERGY);
        }
        if (resourceCount == resourceCapacity) {
            return true;
        }
        else {
            return false;
        }
    }
}