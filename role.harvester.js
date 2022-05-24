var roleCommon = require('role.common');
var roleResources = require('role.resources');

var roleHarvester = {
    /**
     * Builds Harvesters
     * @deprecated - No longer in use.
     * @param {number} extensions 
     */
    buildHarvesters: function (extensions) {
        if (roleHarvester.count() < Memory.requiredHarvesters)
        {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning: ' + newName);
            Memory.spawning = true;
            if (roleResources.isEnergyFull()) {
            //if (Game.spawns['Spawn1'].room.energyCapacityAvailable == Game.spawns['Spawn1'].room.energyAvailable) {
                if (extensions == 0) {
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,CARRY,MOVE,MOVE],
                        newName,
                        { memory: 
                            { 
                                role: 'harvester'
                            }
                        }
                    );
                }
                // 1 to 10 need reworking to be WORK first.
                if (extensions == 1) {
                    // 350
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'harvester' } } );
                }
                if (extensions == 2 || extensions == 3) {
                    // 450
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'harvester' } } );
                }
                if (extensions == 4 || extensions == 5) {
                    // 550
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'harvester' } } );
                }
                if (extensions == 6 || extensions == 7) {
                    // 650
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'harvester' } } );
                }
                if (extensions == 8 || extensions == 9) {
                    // 700
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'harvester' } } );
                }
                if (extensions == 10 || extensions == 11 || extensions == 12) {
                    // 850
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'harvester'
                            } 
                        } 
                    );
                }
                if (extensions == 13 || extensions == 14) {
                    // 950
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        { 
                            memory:
                            {
                                role: 'harvester'
                            }
                        }
                    );
                }
                if (extensions == 15 || extensions == 16) {
                    // 1000
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        { 
                            memory:
                            {
                                role: 'harvester'
                            }
                        }
                    );
                }
                if (extensions == 17) {
                    // 1150
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'harvester'
                            }
                        }
                    );
                }
                if (extensions == 18 || extensions == 19) {
                    // 1200
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'harvester'
                            }
                        }
                    );
                }
                if (extensions >= 20) {
                    // 1300
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'harvester'
                            }
                        }
                    );
                }
                if (roleHarvester.countA() < Memory.requiredAHarvesters) {
                    Game.creeps[newName].memory.group = 'A';
                }
                else if (roleHarvester.countB() < Memory.requiredBHarvesters) {
                    Game.creeps[newName].memory.group = 'B';
                }
                else {
                    Game.creeps[newName].memory.group = 'C';
                }
                Game.creeps[newName].memory.status = 'working';
                Memory.spawning = false;
            }
        }
    },
    
    count: function () {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        return harvesters.length;
    },
    
    countA: function() {
        var harvestersA = _.filter(Game.creeps, (creep) => creep.memory.group == 'A');
        return harvestersA.length;
    },
    
    countB: function() {
        var harvestersB = _.filter(Game.creeps, (creep) => creep.memory.group == 'B');
        return harvestersB.length;
    },
    
    run: function(creep) {
        if (creep.memory.status == 'working') {
            roleHarvester.work(creep);
        }
        else if (creep.memory.status == 'depositing') {
            roleHarvester.deposit(creep);
        }
        else if (creep.memory.status == 'renewing') {
            roleCommon.renew(creep);
        }
    },

    work: function(creep) {
        if (creep.memory.group == 'C') {
            if (creep.store.getFreeCapacity() > 0) {
                if (creep.room.name != 'W5S12') {
                    creep.moveTo(new RoomPosition(23, 48, 'W5S12'));
                }
                else {
                    source = Game.getObjectById('5bbcac9b9099fc012e635d53');
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            else {
                creep.memory.status = 'depositing';
            }
        }
        else {
            if (creep.store.getFreeCapacity() > 0) {
                var source;
                if (creep.memory.group == 'A') {
                    source = Game.getObjectById('5bbcac9b9099fc012e635d57');
                }
                if (creep.memory.group == 'B') {
                    source = Game.getObjectById('5bbcac9b9099fc012e635d56');
                }
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                creep.memory.status = 'depositing';
            }
        }
	},

    /**workC: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
	        if (creep.room.name != 'W5S12') {
	            creep.moveTo(new RoomPosition(23, 48, 'W5S12'));
	        }
	        else {
	            source = Game.getObjectById('5bbcac9b9099fc012e635d53');
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
	        }
	    }
        else {
            roleHarvester.deposit(creep);
        }
    },**/
	
	/**runC: function(creep) {
	    if (creep.store.getFreeCapacity() > 0 && creep.memory.status == 'working') {
	        if (creep.room.name != 'W5S12') {
	            creep.moveTo(new RoomPosition(23, 48, 'W5S12'));
	        }
	        else {
	            source = Game.getObjectById('5bbcac9b9099fc012e635d53');
	            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
	        }
	    }
	    else {
	        creep.memory.status = 'depositing';
	        if (creep.room.name != 'W5S13') {
	            creep.moveTo(new RoomPosition(23, 1, 'W5S13'));
	        }
	        else {
	           roleHarvester.deposit(creep);
	        }
	    }
	},**/
	
	deposit: function(creep) {
        if (creep.memory.group == 'C') {
            if (creep.room.name != 'W5S13') {
	            creep.moveTo(new RoomPosition(23, 1, 'W5S13'));
	        }
        }
	    if (creep.memory.group != 'B') {
    	    var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_EXTENSION &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0])};
                }
                else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_SPAWN &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0])};
                    }
                    else {
                        var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });
                        if (targets.length > 0) {
                            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0])};
                        }
                    }
                }
	    }
	    else {
	        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0])
                };
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0])
                    };
                }
            }
	    }
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.status = 'renewing';
        }
	}
	
};

module.exports = roleHarvester;