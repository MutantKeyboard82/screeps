require('prototype.creep');

Memory.requiredHarvesters = 8;

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');
    
    let harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;

    if (harvestersCount < Memory.requiredHarvesters) {
        Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'harvester' + Game.time, {memory:{role:'harvester'}} );
        console.log('Spawning Harvester');
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            creep.runHarvester();
        }
    }
    
    console.log('********** End tick **********');
}