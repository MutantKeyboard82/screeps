StructureSpawn.prototype.spawnCollector = function(extensionCount) {
    let newName = 'collector' + Game.time;

    console.log('Spawning: ' + newName);

    /**
     * @type {BodyPartConstant[]}
     */
    let parts;

    if (extensionCount < 5) {
        parts = this.setCreepParts(0,4,0,0,0,0,0,2);
    }
    
    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];

        creep.memory.role = 'collector';

        creep.memory.status = 'collecting';

        creep.memory.targetID = 'none';
    }
};

StructureSpawn.prototype.spawnBuilder = function(extensionCount) {
    let newName = 'builder' + Game.time;

    console.log('Spawning: ' + newName);

    /**
     * @type {BodyPartConstant[]}
     */
    let parts;

    if (extensionCount < 5) {
        parts = this.setCreepParts(1,2,0,0,0,0,0,2)
    }

    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];

        creep.memory.role = 'builder';

        creep.memory.status = 'stocking';

        creep.memory.targetID = 'none';
    }
};

StructureSpawn.prototype.spawnUpgrader = function(extensionCount) {
    let newName = 'upgrader' + Game.time;

    console.log('Spawning: ' + newName);

    /**
     * @type {BodyPartConstant[]}
     */
    let parts;

    if (extensionCount < 5) {
        parts = this.setCreepParts(1,2,0,0,0,0,0,2)
    }

    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];

        creep.memory.role = 'upgrader';

        creep.memory.status = 'stocking';

        creep.memory.targetID = 'none';
    }
};

StructureSpawn.prototype.countExtensions = function() {
    var extensions = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });

    return extensions.length;
};

StructureSpawn.prototype.setCreepParts = function(work,carry,ranged,attack,heal,claim,tough,move) {    
    var parts = [];

    for (var i = 1; i <= work; i++ ) {
        parts.push(WORK);
    }

    for (var i = 1; i <= carry; i++) {
        parts.push(CARRY);
    }

    for (var i = 1; i <= ranged; i++) {
        parts.push(RANGED_ATTACK);
    }

    for (var i = 1; i <= attack; i++) {
        parts.push(ATTACK);
    }

    for (var i = 1; i <= heal; i++) {
        parts.push(HEAL);
    }

    for (var i = 1; i <= claim; i++) {
        parts.push(CLAIM);
    }

    for (var i = 1; i <= tough; i++) {
        parts.push(TOUGH);
    }

    for (var i = 1; i <= move; i++) {
        parts.push(MOVE);
    }

    return parts;
};