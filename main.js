require('prototype.creep');
require('prototype.spawn');

Memory.requiredAHarvesters = 1;
Memory.requiredBHarvesters = 1;
Memory.requiredCollectors = 1;
Memory.sourceA = '5982fdbab097071b4adbfc45';
Memory.sourceB = '5982fdbab097071b4adbfc46';

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');

    let extensionCount = Game.spawns.Spawn1.countExtensions();
    
    let harvestersACount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'A').length;

    let harvestersBCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'B').length;

    let collectorCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector').length;

    if (harvestersACount < Memory.requiredAHarvesters) {
        Game.spawns['Spawn1'].spawnCreep( [WORK, WORK, MOVE],
        'harvester' + Game.time, {memory:{role:'harvester', source:'A'}} );
        console.log('Spawning A Harvester');
    }
    else {
        if (harvestersBCount < Memory.requiredBHarvesters) {
            Game.spawns['Spawn1'].spawnCreep( [WORK, WORK, MOVE], 
            'harvester' + Game.time, {memory:{role:'harvester', source:'B'}} );
            console.log('Spawning B Harvester');
        }
        else {
            if (collectorCount < Memory.requiredCollectors) {
                Game.spawns['Spawn1'].spawnCollector(extensionCount);
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            creep.runHarvester();
        }

        if (creep.memory.role == 'collector') {
            creep.runCollector();
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    console.log('********** End tick **********');
}