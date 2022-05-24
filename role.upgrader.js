var roleCommon = require('role.common');
var roleResources = require('role.resources');

var roleUpgrader = {
    /** Param {Creep} creep **/
    buildUpgraders: function (extensions) {
        if(roleUpgrader.count() < Memory.requiredUpgraders) {
            Memory.spawning = true;
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning: ' + newName);
            if (roleResources.isEnergyFull()) {
            //if (Game.spawns['Spawn1'].room.energyCapacityAvailable == Game.spawns['Spawn1'].room.energyAvailable) {
                if (extensions == 0) {
                    // 300
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                if (extensions == 1 || extensions == 2 || extensions == 3) {
                    // 350
                    Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,CARRY,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                if (extensions == 4 || extensions == 5) {
                    // 500
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                if (extensions == 6 || extensions == 7) {
                    // 600
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                if (extensions == 8 || extensions == 9) {
                    // 700
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                if (extensions >= 10 || extensions == 11) {
                    // 800
                    Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'upgrader', upgrading: 'false' } } );
                }
                /**if (extensions == 12 || extensions == 13) {
                    // 900
                    Game.spawns['Spawn1'].spawnCreep(
                        [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                        newName,
                        {
                            memory:
                            {
                                role: 'upgrader',
                                upgrading: 'false'
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
                                role: 'upgrader',
                                upgrading: 'false'
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
                                role: 'upgrader',
                                upgrading: 'false'
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
                                role: 'upgrader',
                                upgrading: 'false'
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
                                role: 'upgrader',
                                upgrading: 'false'
                            }
                        }
                    );
                }**/
                Game.creeps[newName].memory.status = 'working';
                Memory.spawning = false;
            }
        }
    },
    
    count: function () {
        var upgraders = _.filter (Game.creeps, (creep) => creep.memory.role == 'upgrader');
        return upgraders.length;
    },
    
    run: function(creep) {
        if (creep.memory.status == 'working') {
            roleUpgrader.work(creep);
        }
        if (creep.memory.status == 'renewing') {
            roleCommon.renew(creep);
        }
        if (creep.memory.status == 'refilling') {
            roleUpgrader.refill(creep);
        }
    },

    work: function(creep) {
        if (creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            creep.memory.status = 'refilling';
        }
    },

    refill: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()
            }
        });
        if (containers.length > 0) {
            creep.moveTo(containers[0]);
            creep.withdraw(containers[0], RESOURCE_ENERGY);
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 'renewing';
        }

    }
}

module.exports = roleUpgrader;