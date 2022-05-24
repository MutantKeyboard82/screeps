require('prototype.creeps');

/**
 * Counts how many Extensions are in the Room with this Spawn.
 * @returns {number} The count of Extensions.
 */
StructureSpawn.prototype.countExtensions = function() {
    var extensions = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });
    return extensions.length;
};

StructureSpawn.prototype.spawnNewHarvester = function(extensionCount) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        if (extensionCount == 0) {
            parts = this.setCreepParts(1,1,2);
        };
        if (extensionCount == 1) {
            parts = this.setCreepParts(1,2,2);
        };
        if (extensionCount == 2 || extensionCount == 3) {
            parts = this.setCreepParts(2,2,2);
        };
        if (extensionCount == 4 || extensionCount == 5) {
            parts = this.setCreepParts(2,3,3);
        };
        if (extensionCount == 6 || extensionCount == 7) {
            parts = this.setCreepParts(3,3,3);
        };
        if (extensionCount == 8 || extensionCount == 9) {
            parts = this.setCreepParts(3,4,4);
        };
        if (extensionCount == 10 || extensionCount == 11 || extensionCount == 12) {
            parts = this.setCreepParts(4,4,4);
        };
        if (extensionCount == 13 || extensionCount == 14) {
            parts = this.setCreepParts(5,4,5);
        };
        if (extensionCount == 15 || extensionCount == 16) {
            parts = this.setCreepParts(5,5,5);
        };
        if (extensionCount == 17) {
            parts = this.setCreepParts(6,5,6);
        };
        if (extensionCount == 18 || extensionCount == 19) {
            parts = this.setCreepParts(6,6,6);
        };
        if (extensionCount >= 20) {
            parts = this.setCreepParts(6,7,7);
        };
        if (this.spawnCreep(parts, newName) == OK) {
            var creep = Game.creeps[newName];
            creep.memory.role = 'harvester';
            var harvestersACount = _.filter(Game.creeps, (creep) => creep.memory.group == 'A').length;
            var harvestersBCount = _.filter(Game.creeps, (creep) => creep.memory.group == 'B').length;
            if (harvestersACount < Memory.requiredAHarvesters) {
                creep.memory.group = 'A';
            }
            else if (harvestersBCount < Memory.requiredBHarvesters) {
                creep.memory.group = 'B';
            }
            else {
                creep.memory.group = 'C';
            }
            creep.memory.status = 'working';
        }
    }
};

StructureSpawn.prototype.isEnergyFull = function() {
    var targets = this.getSpawningStructures();
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
};

StructureSpawn.prototype.getSpawningStructures = function() {
    var targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN;
        }
    });
    return targets;
};

StructureSpawn.prototype.setCreepParts = function(work,carry,move) {    
    var parts = [];
    for (var i = 1; i <= work; i++ ) {
        parts.push(WORK);
    }
    for (var i = 1; i <= carry; i++) {
        parts.push(CARRY);
    }
    for (var i = 1; i <= move; i++) {
        parts.push(MOVE);
    }
    return parts;
};