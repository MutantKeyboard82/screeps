StructureSpawn.prototype.spawnHarvester = function(extensionCount, source) {
    let newName = 'harvester' + Game.time;

    console.log('Spawning: ' + newName);

    let parts;

    if (extensionCount >= 0 && extensionCount <= 4) {
        parts = this.setCreepParts(2,0,0,0,0,0,0,2);
    }

    if (extensionCount >= 5) {
        parts = this.setCreepParts(5,0,0,0,0,0,0,1);
    }

    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];

        creep.memory.role = 'harvester';

        creep.memory.source = source;
    }
};

StructureSpawn.prototype.spawnCollector = function(extensionCount) {
    let newName = 'collector' + Game.time;

    console.log('Spawning: ' + newName);

    /**
     * @type {BodyPartConstant[]}
     */
    let parts;

    if (extensionCount >= 0 && extensionCount <= 4) {
        parts = this.setCreepParts(0,4,0,0,0,0,0,2);
    }

    if (extensionCount >= 5 && extensionCount <= 9) {
        parts = this.setCreepParts(0,7,0,0,0,0,0,4);
    }

    if (extensionCount >= 10 && extensionCount <= 19) {
        parts = this.setCreepParts(0,10,0,0,0,0,0,5);
    }

    if (extensionCount >= 20 && extensionCount <= 99) {
        parts = this.setCreepParts(0,16,0,0,0,0,0,8);
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

    if (extensionCount >= 0 && extensionCount <= 4) {
        parts = this.setCreepParts(1,2,0,0,0,0,0,2);
    }

    if (extensionCount >= 5 && extensionCount <= 9) {
        parts = this.setCreepParts(2,4,0,0,0,0,0,3);
    }

    if (extensionCount >= 10 && extensionCount <= 19) {
        parts = this.setCreepParts(3,5,0,0,0,0,0,4);
    }

    if (extensionCount >= 20 && extensionCount <= 99) {
        parts = this.setCreepParts(6,7,0,0,0,0,0,7);
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

    if (extensionCount >= 0 && extensionCount <= 4) {
        parts = this.setCreepParts(1,2,0,0,0,0,0,2);
    }

    if (extensionCount >= 5 && extensionCount <= 9) {
        parts = this.setCreepParts(2,4,0,0,0,0,0,3);
    }

    if (extensionCount >= 10 && extensionCount <= 19) {
        parts = this.setCreepParts(3,5,0,0,0,0,0,4);
    }

    if (extensionCount >= 20 && extensionCount <= 99) {
        parts = this.setCreepParts(6,7,0,0,0,0,0,7);
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