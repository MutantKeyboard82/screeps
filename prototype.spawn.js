// ********** Common **********

StructureSpawn.prototype.countExtensions = function() {
    var extensions = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION;
        }
    });
    return extensions.length;
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

// ********** Harvesters **********

StructureSpawn.prototype.spawnNewHarvester = function(extensionCount) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        if (extensionCount == 0) {
            parts = this.setCreepParts(1,1,0,0,0,0,0,2);
        };
        if (extensionCount == 1) {
            parts = this.setCreepParts(1,2,0,0,0,0,0,2);
        };
        if (extensionCount == 2 || extensionCount == 3) {
            parts = this.setCreepParts(2,2,0,0,0,0,0,2);
        };
        if (extensionCount == 4 || extensionCount == 5) {
            parts = this.setCreepParts(2,3,0,0,0,0,0,3);
        };
        if (extensionCount == 6 || extensionCount == 7) {
            parts = this.setCreepParts(3,3,0,0,0,0,0,3);
        };
        if (extensionCount == 8 || extensionCount == 9) {
            parts = this.setCreepParts(3,4,0,0,0,0,0,4);
        };
        if (extensionCount == 10 || extensionCount == 11 || extensionCount == 12) {
            parts = this.setCreepParts(4,4,0,0,0,0,0,4);
        };
        if (extensionCount == 13 || extensionCount == 14) {
            parts = this.setCreepParts(5,4,0,0,0,0,0,5);
        };
        if (extensionCount == 15 || extensionCount == 16) {
            parts = this.setCreepParts(5,5,0,0,0,0,0,5);
        };
        if (extensionCount == 17) {
            parts = this.setCreepParts(6,5,0,0,0,0,0,6);
        };
        if (extensionCount == 18 || extensionCount == 19) {
            parts = this.setCreepParts(6,6,0,0,0,0,0,6);
        };
        if (extensionCount >= 20) {
            parts = this.setCreepParts(6,7,0,0,0,0,0,7);
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

// ********** Upgraders **********

StructureSpawn.prototype.spawnNewUpgrader = function(extensionCount) {
    var newName = 'Upgrader' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        // 300
        if (extensionCount == 0) {
            parts = this.setCreepParts(1,1,0,0,0,0,0,2);
        };
        // 350
        if (extensionCount == 1) {
            parts = this.setCreepParts(1,2,0,0,0,0,0,2);
        };
        // 400
        if (extensionCount == 2 || extensionCount == 3) {
            parts = this.setCreepParts(2,2,0,0,0,0,0,2);
        };
        // 500
        if (extensionCount == 4 || extensionCount == 5) {
            parts = this.setCreepParts(2,3,0,0,0,0,0,3);
        };
        // 600
        if (extensionCount == 6 || extensionCount == 7) {
            parts = this.setCreepParts(3,3,0,0,0,0,0,3);
        };
        // 700
        if (extensionCount == 8 || extensionCount == 9) {
            parts = this.setCreepParts(3,4,0,0,0,0,0,4);
        };
        // 800
        if (extensionCount == 10 || extensionCount == 11 || extensionCount == 12) {
            parts = this.setCreepParts(4,4,0,0,0,0,0,4);
        };
        // 950
        if (extensionCount == 13 || extensionCount == 14) {
            parts = this.setCreepParts(5,4,0,0,0,0,0,5);
        };
        // 1050
        if (extensionCount == 15 || extensionCount == 16) {
            parts = this.setCreepParts(5,5,0,0,0,0,0,5);
        };
        // 1150
        if (extensionCount == 17) {
            parts = this.setCreepParts(6,5,0,0,0,0,0,6);
        };
        // 1200
        if (extensionCount == 18 || extensionCount == 19) {
            parts = this.setCreepParts(6,6,0,0,0,0,0,6);
        };
        // 1300
        if (extensionCount >= 20) {
            parts = this.setCreepParts(6,7,0,0,0,0,0,7);
        };
        if (this.spawnCreep(parts, newName) == OK) {
            var creep = Game.creeps[newName];
            creep.memory.role = 'upgrader';
            creep.memory.status = 'working';
        }
    }
};

// ********** Army **********

StructureSpawn.prototype.spawnNewScout = function(extensionCount, targetRoomName) {
    var newName = 'Scout' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        // 500
        if (extensionCount >= 4) {
            parts = this.setCreepParts(0,0,0,0,0,0,0,10);
        }
        if (this.spawnCreep(parts, newName) == OK) {
            var creep = Game.creeps[newName];
            creep.memory.role = 'scout';
            creep.memory.targetRoom = targetRoomName;
        }
    }
};

StructureSpawn.prototype.spawnNewRangedSoldier = function(extensionCount, targetRoomName) {
    var newName = 'Ranged' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        // 300
        if (extensionCount == 0) {
            parts = this.setCreepParts(0,0,1,0,0,0,0,1);
        }
        // 350
        if (extensionCount == 1) {
            parts = this.setCreepParts(0,0,2,0,0,0,0,1);
        }
        // 400
        if (extensionCount == 2 || extensionCount == 3 || extensionCount == 4) {
            parts = this.setCreepParts(0,0,2,0,0,0,0,2);
        }
        // 550
        if (extensionCount == 5 || extensionCount == 6 || extensionCount == 7) {
            parts = this.setCreepParts(0,0,3,0,0,0,0,2);
        }
        // 700
        if (extensionCount == 8) {
            parts = this.setCreepParts(0,0,4,0,0,0,0,2);
        }
        // 750
        if (extensionCount == 9 || extensionCount == 10 || extensionCount == 11) {
            parts = this.setCreepParts(0,0,4,0,0,0,0,3);
        }
        // 900
        if (extensionCount == 12 || extensionCount == 13 || extensionCount == 14) {
            parts = this.setCreepParts(0,0,5,0,0,0,0,3);
        }
        // 1050
        if (extensionCount == 15) {
            parts = this.setCreepParts(0,0,6,0,0,0,0,3);
        }
        // 1100
        if (extensionCount == 16 || extensionCount == 17 || extensionCount == 18) {
            parts = this.setCreepParts(0,0,6,0,0,0,0,4);
        }
        // 1250
        if (extensionCount >= 19) {
            parts = this.setCreepParts(0,0,7,0,0,0,0,4);
        }
        if (this.spawnCreep(parts, newName) == OK) {
            var creep = Game.creeps[newName];
            creep.memory.role = 'rangedSoldier';
            creep.memory.targetRoom = targetRoomName;
        }
    }
};

StructureSpawn.prototype.spawnNewMeleeSoldier = function (extensionCount, targetRoomName) {
    var newName = 'Melee' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    var parts;
    if (this.isEnergyFull()) {
        // 300
        if (extensionCount == 0) {
            parts = this.setCreepParts(0,0,0,2,0,0,0,2);
        }
        // 350
        if (extensionCount == 1 || extensionCount == 2) {
            parts = this.setCreepParts(0,0,0,2,0,0,0,2);
        }
        // 450
        if (extensionCount == 3 || extensionCount == 4) {
            parts = this.setCreepParts(0,0,0,3,0,0,0,3);
        }
        // 550
        if (extensionCount == 5 || extensionCount == 6) {
            parts = this.setCreepParts(0,0,0,4,0,0,0,4);
        }
        // 650
        if (extensionCount == 7 || extensionCount == 8 || extensionCount == 9) {
            parts = this.setCreepParts(0,0,0,5,0,0,0,5);
        }
        // 800
        if (extensionCount == 10 || extensionCount == 11 || extensionCount == 12) {
            parts = this.setCreepParts(0,0,0,6,0,0,0,6);
        }
        // 950
        if (extensionCount == 13 || extensionCount == 14) {
            parts = this.setCreepParts(0,0,0,7,0,0,0,7);
        }
        // 1050
        if (extensionCount == 15 || extensionCount == 16 || extensionCount == 17) {
            parts = this.setCreepParts(0,0,0,8,0,0,0,8);
        }
        // 1200
        if (extensionCount == 18 || extensionCount == 19) {
            parts = this.setCreepParts(0,0,0,9,0,0,0,9);
        }
        // 1300
        if (extensionCount >= 20) {
            parts = this.setCreepParts(0,0,0,10,0,0,0,10);
        }
        if (this.spawnCreep(parts, newName) == OK) {
            var creep = Game.creeps[newName];
            creep.memory.role = 'meleeSoldier';
            creep.memory.targetRoom = targetRoomName;
        }
    }
};