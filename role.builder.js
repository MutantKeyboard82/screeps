var roleResources = require('role.resources');

var roleBuilder = {
    buildBuilders: function (extensions) {
        var constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0 && (roleBuilder.count() < Memory.requiredBuilders)) {
            Memory.spawning = true;
            var newName = 'Builder' + Game.time;
            console.log('Spawning: ' + newName);
            if (roleResources.isEnergyFull()) {
            //if (Game.spawns['Spawn1'].room.energyCapacityAvailable == Game.spawns['Spawn1'].room.energyAvailable) {
                if (extensions == 0) {
                    // 300
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                if (extensions == 1 || extensions == 2 || extensions == 3) {
                    // 350
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                if (extensions == 4 || extensions == 5) {
                    // 500
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                if (extensions == 6 || extensions == 7) {
                    // 600
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                if (extensions == 8 || extensions == 9) {
                    // 700
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                if (extensions >= 10 || extensions == 11) {
                    // 800
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'builder', building: 'false' } } );
                }
                /**if (extensions == 12 || extensions == 13) {
                    // 900
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'builder',
                                building: 'false'
                            }
                        }
                    );
                }
                if (extensions == 14 || extensions == 15) {
                    // 1000
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'builder',
                                building: 'false'
                            }
                        }
                    );
                }
                if (extensions == 16 || extensions == 17) {
                    // 1100
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'builder',
                                building: 'false'
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
                                role: 'builder',
                                building: 'false'
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
                                role: 'builder',
                                building: 'false'
                            }
                        }
                    );
                }**/
                if (roleBuilder.countA() < Memory.requiredABuilders) {
                    Game.creeps[newName].memory.group = 'A';
                }
                /**else {
                    Game.creeps[newName].memory.group = 'B';
                }**/
            }
            Memory.spawning = false;
        }
    },
    
    count: function () {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        return builders.length;
    },
    
    countA: function () {
        var buildersA = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        return buildersA.length;
    },
    
    /** Param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()
                    }
            });
            if (containers.length > 0) {
	            creep.moveTo(containers[0]);
	            //if (containers[0].room.energyAvailable == containers[0].room.energyCapacityAvailable &&
	            //    Memory.spawning == false) {
                        creep.withdraw(containers[0], RESOURCE_ENERGY);
	            //    }
	        }
	    }
    },
    
    runB: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }
        if (creep.memory.building) {
            if (creep.room.name != 'W5S12') {
                creep.moveTo(new RoomPosition(23, 48, 'W5S12'));
            }
            else {
                roleBuilder.build(creep);
            }
        }
        else {
            if (creep.room.name != 'W5S13') {
                creep.moveTo(new RoomPosition(23, 1, 'W5S13'));
            }
            else {
                roleBuilder.refill(creep);
            }
        }
    },
    
    build: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
    },
    
    refill: function (creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()
            }
        });
        if (containers.length > 0) {
            creep.moveTo(containers[0]);
            if (containers[0].room.energyAvailable == containers[0].room.energyCapacityAvailable &&
                Memory.spawning == false) {
                    creep.withdraw(containers[0], RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleBuilder;