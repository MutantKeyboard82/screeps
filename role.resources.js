var roleResources = {
    isEnergyFull: function () {
        var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
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
};

module.exports = roleResources;