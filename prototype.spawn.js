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

StructureSpawn.prototype.checkRepairs = function() {
    var targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits < structure.hitsMax &&
                structure.hits < Memory.damageThreshold);
        }
    });
    console.log('Repairing: ' + targets.length);
    if (targets.length > 100) {
        Memory.damageThreshold = Memory.damageThreshold - 100;
    }
    if (targets.length == 0) {
        Memory.damageThreshold = Memory.damageThreshold + 1000;
    }
}

// ********** Harvesters **********

StructureSpawn.prototype.spawnNewHarvester = function(extensionCount) {
    let newName = 'Harvester' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    let parts;
    let harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if (harvesterCount == 0 || extensionCount < 5) {
        parts = this.setCreepParts(2,0,0,0,0,0,0,2);
    }
    else {
        parts = this.setCreepParts(5,0,0,0,0,0,0,3);
    }
    if (this.spawnCreep(parts, newName) == OK) {
        var creep = Game.creeps[newName];
        creep.memory.role = 'harvester';
        let harvestersACount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'A').length;
        let harvestersBCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'B').length;
        let harvestersCCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'C').length;
        let harvestersDCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'D').length;  
        let harvestersECount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'E').length;  
        let harvestersFCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'F').length;
        let harvestersGCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' &&
            creep.memory.group == 'G').length;
        if (harvestersACount < Memory.requiredAHarvesters) {
            creep.memory.group = 'A';
            creep.memory.room = 'E37N53';
        }
        else if (harvestersBCount < Memory.requiredBHarvesters) {                
            creep.memory.group = 'B';
            creep.memory.room = 'E37N53';
        }
        else if (harvestersCCount < Memory.requiredCHarvesters) {
            creep.memory.group = 'C';
            creep.memory.room = 'E38N53';
        }
        else if (harvestersDCount < Memory.requiredDHarvesters) {
            creep.memory.group = 'D';
            creep.memory.room = 'E38N53';
        }
        else if (harvestersECount < Memory.requiredEHarvesters) {
            creep.memory.group = 'E';
            creep.memory.room = 'E37N53';
        }
        else if (harvestersFCount < Memory.requiredFHarvesters) {
            creep.memory.group = 'F';
            creep.memory.room = 'E37N54';
        }
        else if (harvestersGCount < Memory.requiredGHarvesters) {
            creep.memory.group = 'G';
            creep.memory.room = 'E37N54';
        }
        creep.memory.status = 'working';
    }
};

// ********** Upgraders **********

StructureSpawn.prototype.spawnNewUpgrader = function(extensionCount) {
    let newName = 'Upgrader' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    let parts;
    if (extensionCount < 5){
        parts = this.setCreepParts(1,2,0,0,0,0,0,2)
    }
    else if (extensionCount < 10) {
        parts = this.setCreepParts(3,2,0,0,0,0,0,3)
    }
    else if (extensionCount < 20) {
        parts = this.setCreepParts(4,4,0,0,0,0,0,4)
    }
    else if (extensionCount < 30) {
        parts = this.setCreepParts(6,7,0,0,0,0,0,7)
    }
    else if (extensionCount <= 40) {
        parts = this.setCreepParts(9,9,0,0,0,0,0,9)
    }
    /**else if (!this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            structure.structureType == STRUCTURE_LINK
        }
    })) {
        parts = this.setCreepParts(13,1,0,0,0,0,0,7);
    }**/
    else {
        parts = this.setCreepParts(9,9,0,0,0,0,0,9);
    }
    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];
        let upgradersACount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' &&
            creep.memory.room == Memory.mainRoom).length;
        let upgradersBCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' &&
            creep.memory.room == 'E38N53').length;
        if (upgradersACount < Memory.requiredAUpgraders) {
            creep.memory.room = Memory.mainRoom;
        }
        else if (upgradersBCount < Memory.requiredBUpgraders) {
            creep.memory.room = 'E38N53';
        }
        else {
            creep.memory.room = 'E37N54';
        }
        creep.memory.role = 'upgrader';
        creep.memory.status = 'refilling';
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
            creep.memory.status = 'working';
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
            creep.memory.status = 'working';
        }
    }
};

StructureSpawn.prototype.spawnNewMeleeSoldier = function () {
    let newName = 'Melee' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    let parts = this.setCreepParts(0,0,0,18,0,0,0,9);
    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];
        creep.memory.role = 'meleeSoldier';
        creep.memory.room = 'E37N54';
        creep.memory.status = 'working';
    }
};

// ********** Builders **********

StructureSpawn.prototype.spawnNewBuilder = function (extensionCount) {
    var newName = 'Builder' + Game.time;
    console.log('Spawning: ' + newName);
    /**
     * @type {BodyPartConstant[]}
     */
    let parts;
    if (extensionCount < 5) {
        parts = this.setCreepParts(1,2,0,0,0,0,0,2);
    }
    else if (extensionCount < 10) {
        parts = this.setCreepParts(3,2,0,0,0,0,0,3);
    }
    else if (extensionCount < 20) {
        parts = this.setCreepParts(4,4,0,0,0,0,0,4);
    }
    else if (extensionCount < 30) {
        parts = this.setCreepParts(6,7,0,0,0,0,0,7)
    }
    else if (extensionCount <= 40) {
        parts = this.setCreepParts(9,9,0,0,0,0,0,9)
    }
    else {
        parts = this.setCreepParts(9,9,0,0,0,0,0,9);
    }
    if (this.spawnCreep(parts, newName) == OK) {
        var creep = Game.creeps[newName];
        creep.memory.role = 'builder';
        creep.memory.status = 'working';
    }
};

// ********** Couriers **********

StructureSpawn.prototype.spawnNewCourier = function (extensionCount) {
    let newName = 'Courier' + Game.time;
    console.log('Spawning: ' + newName);
    let countA = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'A').length;
    let countB = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'B').length;
    let countC = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'C').length;
    let countD = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'D').length;
    let countE = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'E').length;
    let countF = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'F').length;
    let countG = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'G').length;
    let countH = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'H').length;
    let countI = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier' &&
        creep.memory.group == 'I').length;
    /**
     * @type {BodyPartConstant[]}
     */
    let parts;
    if (countA < Memory.requiredACouriers) {
        if (extensionCount >= 6) {
            parts = this.setCreepParts(0,3,0,0,0,0,0,2);
        }
        else {
            parts = this.setCreepParts(0,3,0,0,0,0,0,2);
        }
    }
    else if (countB < Memory.requiredBCouriers) {
        parts = this.setCreepParts(0,1,0,0,0,0,0,1);
    }
    else if (countC < Memory.requiredCCouriers) {
        parts = this.setCreepParts(0,3,0,0,0,0,0,2);
    }
    else if (countD < Memory.requiredDCouriers) {
        parts = this.setCreepParts(0,6,0,0,0,0,0,3);
    }
    else if (countE < Memory.requiredECouriers) {
        parts = this.setCreepParts(0,2,0,0,0,0,0,1);
    }
    else if (countF < Memory.requiredFCouriers) {
        parts = this.setCreepParts(0,8,0,0,0,0,0,4);
    }
    else if (countG < Memory.requiredGCouriers) {
        parts = this.setCreepParts(0,4,0,0,0,0,0,2)
    }
    else if (countH < Memory.requiredHCouriers) {
        parts = this.setCreepParts(0,7,0,0,0,0,0,4)
    }
    else if (countI < Memory.requiredICouriers) {
        parts = this.setCreepParts(0,13,0,0,0,0,0,7)
    }
    else {
        parts = this.setCreepParts(0,24,0,0,0,0,0,12);
    }
    if (this.spawnCreep(parts, newName) == OK) {
        var creep = Game.creeps[newName];
        creep.memory.role = 'courier';
        creep.memory.status = 'working';
        if (countA < Memory.requiredACouriers) {
            creep.memory.group = 'A';
            creep.memory.room = Memory.mainRoom;
        }
        else if (countB < Memory.requiredBCouriers) {
            creep.memory.group = 'B';
            creep.memory.room = Memory.mainRoom;
        }
        else if (countC < Memory.requiredCCouriers) {
            creep.memory.group = 'C';
            creep.memory.room = 'E38N53';
        }
        else if (countD < Memory.requiredDCouriers) {
            creep.memory.group = 'D';
            creep.memory.room = 'E38N53';
        }
        else if (countE < Memory.requiredECouriers) {
            creep.memory.group = 'E';
            creep.memory.room = 'E37N53';
        }
        else if (countF < Memory.requiredFCouriers) {
            creep.memory.group ='F';
            creep.memory.room = 'E38N53';
        }
        else if (countG < Memory.requiredGCouriers) {
            creep.memory.group ='G';
            creep.memory.room = 'E37N53';
        }
        else if (countH < Memory.requiredHCouriers) {
            creep.memory.group ='H';
            creep.memory.room = 'E37N54';
        }
        else if (countI < Memory.requiredICouriers) {
            creep.memory.group ='I';
            creep.memory.room = 'E37N54';
        }
    }
};

StructureSpawn.prototype.spawnNewSorter = function(targetRoom) {
    let newName = 'Sorter' + Game.time;
    console.log('Spawning: ' + newName);
    let parts = this.setCreepParts(0,4,0,0,0,0,0,2);
    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];
        creep.memory.role = 'sorter';
        creep.memory.status = 'working';
        creep.memory.room = targetRoom;
    }
};

StructureSpawn.prototype.spawnNewRover = function() {
    let newName = 'Rover' + Game.time;
    console.log('Spawning: ' + newName);
    let parts = this.setCreepParts(0,0,0,0,0,3,0,2);
    if (this.spawnCreep(parts, newName) == OK) {
        let creep = Game.creeps[newName];
        creep.memory.role = 'rover';
        let countA = _.filter(Game.creeps, (creep) => creep.memory.role == 'rover' &&
            creep.memory.room == Memory.nextRoom).length;
        let countB = _.filter(Game.creeps, (creep) => creep.memory.role == 'rover' &&
            creep.memory.room == Memory.followingRoom).length;
        if (countA < Memory.requiredARovers) {
            creep.memory.room = Memory.nextRoom;
        }
        else if (countB < Memory.requiredBRovers) {
            creep.memory.room = Memory.followingRoom;
        }
    }
};