var roleCommon = {
    renew: function (creep) {
        if (creep.ticksToLive < 1500) {
            if (Game.spawns['Spawn1'].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
            if (Game.spawns['Spawn1'].renewCreep(creep) == ERR_BUSY ||
                Game.spawns['Spawn1'].renewCreep(creep) == ERR_NOT_ENOUGH_ENERGY ||
                Game.spawns['Spawn1'].renewCreep(creep) == ERR_FULL) {
                    creep.memory.status = 'working';
            }        
        }
        else {
            creep.memory.status = 'working';
        }
    }
};

module.exports = roleCommon;