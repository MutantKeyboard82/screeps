var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

var roleMaintain = {
    checkRepairs: function() {
        var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax &&
                    structure.hits < Memory.damageThreshold);
            }
        });
        if (targets.length > 100) {
            Memory.damageThreshold = Memory.damageThreshold - 100;
        }
        
        if (targets.length == 0) {
            Memory.damageThreshold = Memory.damageThreshold + 1000;
        }
        
        if (targets.length > 0)
        {
            console.log('Need repair ' + targets.length);
            /**
            var maintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'maintain');
            if (maintainers.length < Memory.requiredMaintainers && roleBuilder.count() == Memory.requiredUpgraders) {
                var newName = 'Maintain' + Game.time;
                Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
                    { memory: { role: 'maintain', repairing: 'false' } } );
            }**/
        }
    },
    
    /** Param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }
        
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }
        
        if (creep.memory.repairing == true) {
            var targetRamparts = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_RAMPART &&
                        structure.hits < structure.hitsMax &&
                        structure.hits < Memory.damageThreshold);
                }
            });
            if (targetRamparts.length > 0) {
                creep.moveTo(targetRamparts[0]);
                creep.repair(targetRamparts[0]);
            }
            else {
                var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax &&
                        structure.hits < Memory.damageThreshold);
                }
            });
                creep.moveTo(targets[0]);
                creep.repair(targets[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity();
                }
            });
                    
            creep.moveTo(targets[0]);
            creep.withdraw(targets[0], RESOURCE_ENERGY);
        }
    }
}

module.exports = roleMaintain;