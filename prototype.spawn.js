function CreepBlueprint(role, group, status, parts, targetID = null, container = null) {
    this.role = role;

    this.group = group;

    this.status = status;

    this.targetID = targetID;

    this.parts = parts;

    this.container = container;
}

StructureSpawn.prototype.runSpawner = function() {
    this.setBuildQueue();

    if (this.memory.buildQueue.length > 0) {
        this.buildCreeps();
    }

    // this.queueBuilders();

    // this.spawnBuilders();
};

StructureSpawn.prototype.setBuildQueue = function() {
    if (this.memory.buildQueue == null) {
        this.memory.buildQueue = [];
    }

    let sources = this.room.find(FIND_SOURCES);

    this.queueGatherers(sources, 'collector', 'moving');

    this.queueGatherers(sources, 'harvester', 'harvesting');

    this.queueWorkers('upgrader');

    let constructionSites = _.filter(Game.constructionSites);

    if (constructionSites.length > 0) {
        this.queueWorkers('builder');
    }
};

StructureSpawn.prototype.queueGatherers = function(sources, role, status) {
    for (var i in sources) {
        let creepCount = _.filter(Game.creeps, (creep) =>
            creep.memory.role == role && creep.memory.targetID == sources[i].id).length;

        if (creepCount == 0) {
            let storedBlueprint = _.find(this.memory.storedBlueprints, (blueprint) =>
                blueprint.role == role && blueprint.targetID == sources[i].id);
            
            if (storedBlueprint == null) {
                let parts = this.setParts(role);

                let blueprint = new CreepBlueprint(role, 'basic', status, parts, sources[i].id);

                if (this.memory.storedBlueprints == null) {
                    this.memory.storedBlueprints = [];
                }

                this.memory.storedBlueprints.push(blueprint);

                this.memory.buildQueue.push(blueprint);
            }
            else {
                this.memory.buildQueue.push(storedBlueprint);
            }
        }
    }
};

StructureSpawn.prototype.queueWorkers = function(role) {
    let creepCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == role).length;

    if (creepCount < 2) {
        let storedBlueprint = _.find(this.memory.storedBlueprints, (blueprint) =>
            blueprint.role == role);
        
        if (storedBlueprint == null) {
            let parts = this.setParts(role);

            let blueprint = new CreepBlueprint(role, 'basic', 'stocking', parts);

            if (this.memory.storedBlueprints == null) {
                this.memory.storedBlueprints = [];
            }

            this.memory.storedBlueprints.push(blueprint);

            this.memory.buildQueue.push(blueprint);
        }
        else {
            this.memory.buildQueue.push(storedBlueprint);
        }
    }
};

StructureSpawn.prototype.buildCreeps = function() {
    
    let blueprint = this.memory.buildQueue.shift();

    let newName = blueprint.role + Game.time;

    console.log('Spawning: ' + newName);

    if (this.spawnCreep(blueprint.parts, newName) == OK) {
        let creep = Game.creeps[newName];

        creep.memory.role = blueprint.role;

        creep.memory.group = blueprint.group;

        creep.memory.status = blueprint.status;

        creep.memory.targetID = blueprint.targetID;

        creep.memory.container = blueprint.container;
    }
};

StructureSpawn.prototype.setParts = function(role) {
    let energyCapacityAvailable = this.room.energyCapacityAvailable;

    switch (role) {
        case "collector":
            let creepCount = _.filter(Game.creeps, (creep) =>
                creep.memory.role == 'collector').length;

            if (energyCapacityAvailable == 300 || creepCount == 0) {
                return this.setCreepParts(0,4,0,0,0,0,0,2);
            }

            if (energyCapacityAvailable >= 550 && energyCapacityAvailable <= 750) {
                return this.setCreepParts(0,7,0,0,0,0,0,4);
            }
    
            if (energyCapacityAvailable >= 800 && energyCapacityAvailable <= 1250) {
                return this.setCreepParts(0,10,0,0,0,0,0,5);
            }

            break;

        case "harvester":
            if (energyCapacityAvailable < 550) {
                return this.setCreepParts(2,0,0,0,0,0,0,2);
            }
        
            if (energyCapacityAvailable >= 550) {
                return this.setCreepParts(5,0,0,0,0,0,0,5);
            }
        break;

        case "upgrader":
            if (energyCapacityAvailable <= 300) {
                return this.setCreepParts(1,2,0,0,0,0,0,2);
            }
        
            if (energyCapacityAvailable >= 350 && energyCapacityAvailable <= 750) {
                return this.setCreepParts(2,4,0,0,0,0,0,3);
            }
        
            if (energyCapacityAvailable >= 800 && energyCapacityAvailable <= 1250) {
                return this.setCreepParts(3,5,0,0,0,0,0,4);
            }
        
            // if (extensionCount >= 20 && extensionCount <= 29) {
            //     return this.setCreepParts(6,7,0,0,0,0,0,7);
            // }
        
            // if (extensionCount >= 30 && extensionCount <= 99) {
            //     return this.setCreepParts(9,9,0,0,0,0,0,9);
            // }

        break;

        case "builder":
            if (energyCapacityAvailable <= 300 && energyCapacityAvailable <= 500) {
                return this.setCreepParts(1,2,0,0,0,0,0,2);
            }
        
            if (energyCapacityAvailable >= 550 && energyCapacityAvailable <= 750) {
                return this.setCreepParts(2,4,0,0,0,0,0,3);
            }
        
            if (energyCapacityAvailable >= 800 && energyCapacityAvailable <= 1250) {
                return this.setCreepParts(3,5,0,0,0,0,0,4);
            }
        
            // if (extensionCount >= 20 && extensionCount <= 29) {
            //     return this.setCreepParts(6,7,0,0,0,0,0,7);
            // }
        
            // if (extensionCount >= 30 && extensionCount <= 99) {
            //     return this.setCreepParts(9,9,0,0,0,0,0,9);
            // }
        
        break;
    }
};

StructureSpawn.prototype.setPartsOrig = function(newCreep) {
    let extensionCount = this.room.find(FIND_MY_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_EXTENSION
        }
    }).length;

    let energyCapacityAvailable = this.room.energyCapacityAvailable;

    switch (newCreep.role) {
        case "harvester":
            if (energyCapacityAvailable < 550) {
                return this.setCreepParts(2,0,0,0,0,0,0,2);
            }
        
            if (energyCapacityAvailable >= 550) {
                return this.setCreepParts(5,0,0,0,0,0,0,5);
            }

        break;

        case "collector":
            let creepCount = _.filter(Game.creeps, (creep) =>
                creep.memory.role == 'collector').length;

            if (energyCapacityAvailable == 300 || creepCount == 0) {
                return this.setCreepParts(0,4,0,0,0,0,0,2);
            }
    
            if (extensionCount >= 5 && extensionCount <= 9) {
                return this.setCreepParts(0,7,0,0,0,0,0,4);
            }
    
            if (extensionCount >= 10 && extensionCount <= 19) {
                return this.setCreepParts(0,10,0,0,0,0,0,5);
            }
    
            if (extensionCount >= 20 && extensionCount <= 29) {
                return this.setCreepParts(0,16,0,0,0,0,0,8);
            }
    
            if (extensionCount >= 30 && extensionCount <= 99) {
                return this.setCreepParts(0,24,0,0,0,0,0,12);
            }

        break;

        case "upgrader":
            if (energyCapacityAvailable <= 300) {
                return this.setCreepParts(1,2,0,0,0,0,0,2);
            }
        
            if (extensionCount >= 6 && extensionCount <= 9) {
                return this.setCreepParts(2,4,0,0,0,0,0,3);
            }
        
            if (extensionCount >= 10 && extensionCount <= 19) {
                return this.setCreepParts(3,5,0,0,0,0,0,4);
            }
        
            if (extensionCount >= 20 && extensionCount <= 29) {
                return this.setCreepParts(6,7,0,0,0,0,0,7);
            }
        
            if (extensionCount >= 30 && extensionCount <= 99) {
                return this.setCreepParts(9,9,0,0,0,0,0,9);
            }

        break;

        case "builder":
            if (extensionCount >= 0 && extensionCount <= 4) {
                return this.setCreepParts(1,2,0,0,0,0,0,2);
            }
        
            if (extensionCount >= 5 && extensionCount <= 9) {
                return this.setCreepParts(2,4,0,0,0,0,0,3);
            }
        
            if (extensionCount >= 10 && extensionCount <= 19) {
                return this.setCreepParts(3,5,0,0,0,0,0,4);
            }
        
            if (extensionCount >= 20 && extensionCount <= 29) {
                return this.setCreepParts(6,7,0,0,0,0,0,7);
            }
        
            if (extensionCount >= 30 && extensionCount <= 99) {
                return this.setCreepParts(9,9,0,0,0,0,0,9);
            }
        
        break;
    }
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

// StructureSpawn.prototype.countExtensions = function() {
//     var extensions = this.room.find(FIND_STRUCTURES, {
//         filter: (structure) => {
//             return structure.structureType == STRUCTURE_EXTENSION;
//         }
//     });

//     return extensions.length;
// };

// StructureSpawn.prototype.queueBuilders = function() {
//     let constructionSites = _.filter(Game.constructionSites);

//     let builderCount = _.filter(Game.creeps, (creep) =>
//         creep.memory.role == 'builder').length;

//     if (constructionSites.length > 0 && builderCount == 0) {
//         let builder = {role: "builder"};

//         Memory.buildersQueue.push(builder);
//     }
// };

// StructureSpawn.prototype.spawnBuilders = function() {
//     if (Memory.buildersQueue.length > 0) {
//         let newCreep = Memory.buildersQueue.shift();

//         let newName = newCreep.role + Game.time;

//         console.log('Spawning: ' + newName);

//         let parts = this.setParts(newCreep);

//         if (this.spawnCreep(parts, newName) == OK) {
//             let creep = Game.creeps[newName];

//             creep.memory.role = newCreep.role;

//             creep.memory.status = 'collecting';

//             creep.memory.targetID = 'none';
//         }
//     }
// };

// // Deprecated
// StructureSpawn.prototype.spawnHarvester = function(extensionCount, source, harvesterCount) {
//     let newName = 'harvester' + Game.time;

//     console.log('Spawning Here: ' + newName);

//     let parts;

//     if ((extensionCount >= 0 && extensionCount <= 4) || harvesterCount == 0) {
//         parts = this.setCreepParts(2,0,0,0,0,0,0,2);
//     }

//     if (extensionCount >= 5 && harvesterCount > 0) {
//         parts = this.setCreepParts(5,0,0,0,0,0,0,5);
//     }

//     if (this.spawnCreep(parts, newName) == OK) {
//         let creep = Game.creeps[newName];

//         creep.memory.role = 'harvester';

//         creep.memory.source = source;
//     }
// };

// StructureSpawn.prototype.spawnCollector = function(extensionCount, group, collectorCount) {
//     let newName = 'collector' + Game.time;

//     console.log('Spawning: ' + newName);

//     /**
//      * @type {BodyPartConstant[]}
//      */
//     let parts;
//     if ((extensionCount >= 0 && extensionCount <= 4) || collectorCount == 0) {
//         parts = this.setCreepParts(0,4,0,0,0,0,0,2);
//     }

//     if ((extensionCount >= 5 && extensionCount <= 9) && collectorCount > 0) {
//         parts = this.setCreepParts(0,7,0,0,0,0,0,4);
//     }

//     if ((extensionCount >= 10 && extensionCount <= 19) && collectorCount > 0) {
//         parts = this.setCreepParts(0,10,0,0,0,0,0,5);
//     }

//     if ((extensionCount >= 20 && extensionCount <= 29) && collectorCount > 0) {
//         if (group == 'A') {
//             parts = this.setCreepParts(0,16,0,0,0,0,0,8);
//         }
//         else {
//             parts = this.setCreepParts(0,12,0,0,0,0,0,6);
//         }
//     }

//     if ((extensionCount >= 30 && extensionCount <= 99) && collectorCount > 0) {
//             parts = this.setCreepParts(0,24,0,0,0,0,0,12);
//     }

//     if (this.spawnCreep(parts, newName) == OK) {
//         let creep = Game.creeps[newName];

//         creep.memory.role = 'collector';

//         creep.memory.status = 'collecting';

//         creep.memory.targetID = 'none';

//         creep.memory.group = group;

//         if (group != 'A' ) {
//             creep.memory.hitFlag = false;
//         }
//     }
// };

// StructureSpawn.prototype.spawnBuilder = function(extensionCount) {
//     let newName = 'builder' + Game.time;

//     console.log('Spawning: ' + newName);

//     /**
//      * @type {BodyPartConstant[]}
//      */
//     let parts;

    
// };

// StructureSpawn.prototype.spawnUpgrader = function(extensionCount, group) {
//     let newName = 'upgrader' + Game.time;

//     console.log('Spawning: ' + newName);

//     /**
//      * @type {BodyPartConstant[]}
//      */
//     let parts;

    

//     if (this.spawnCreep(parts, newName) == OK) {
//         let creep = Game.creeps[newName];

//         creep.memory.role = 'upgrader';

//         creep.memory.status = 'stocking';

//         creep.memory.targetID = 'none';

//         creep.memory.group = group;

//         if (group == 'C') {
//             creep.memory.hitFlag = true;
//         }
//     }
// };

// StructureSpawn.prototype.spawnTransfer = function() {
//     let newName = 'transfer' + Game.time;

//     console.log('Spawning: ' + newName);

//     let parts;

//     parts = this.setCreepParts(0,2,0,0,0,0,0,2);
    
//     if (this.spawnCreep(parts, newName) == OK) {
//         let creep = Game.creeps[newName];

//         creep.memory.role = 'transfer';
//     }
// };