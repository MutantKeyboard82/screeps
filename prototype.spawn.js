StructureSpawn.prototype.spawnNewHarvester = function(extensionCount) {
    let newName = 'Harvester' + Game.time;

    console.log('Spawning: ' + newName);

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