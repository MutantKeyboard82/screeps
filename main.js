require('prototype.creep');
require('prototype.spawn');

Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredCollectors = 1;
Memory.requiredBuilders = 5;
Memory.sourceA = 'b9f5e4a37b57eb73dbfd2ead';
Memory.sourceB = '3b5174f2367cae226285bdfc';

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');

    let extensionCount = Game.spawns.Spawn1.countExtensions();
    
    let harvestersACount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'A').length;

    let harvestersBCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'B').length;

    let collectorCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector').length;

    let builderCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'builder').length;

    let constructionSites = _.filter(Game.constructionSites);

    if (collectorCount < Memory.requiredCollectors) {
        Game.spawns['Spawn1'].spawnCollector(extensionCount);
    }
    else {
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
                if (constructionSites.length > 0 && builderCount < Memory.requiredBuilders) {
                    Game.spawns['Spawn1'].spawnBuilder(extensionCount);
                }
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

        if (creep.memory.role == 'builder') {
            creep.runBuilder();
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    console.log('********** End tick **********');
}