require('prototype.creep');
require('prototype.spawn');

Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredCollectors = 1;
Memory.requiredBuilders = 1;
Memory.requiredUpgraders = 1;
Memory.sourceA = 'b9f5e4a37b57eb73dbfd2ead';
Memory.sourceB = '3b5174f2367cae226285bdfc';

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');

    let extensionCount = Game.spawns.Spawn1.countExtensions();

    if (extensionCount < 5) {
        Memory.requiredAHarvesters = 2;

        Memory.requiredBHarvesters = 2;
    }

    if (extensionCount < 10) {
        Memory.requiredAHarvesters = 1;

        Memory.requiredBHarvesters = 1;
    }
    
    let harvestersACount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'A').length;

    let harvestersBCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'B').length;

    let collectorCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector').length;

    let builderCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'builder').length;

    let constructionSites = _.filter(Game.constructionSites);

    let upgraderCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'upgrader').length;

    if (collectorCount < Memory.requiredCollectors) {
        Game.spawns['Spawn1'].spawnCollector(extensionCount);
    }
    else {
        if (harvestersACount < Memory.requiredAHarvesters) {
            Game.spawns['Spawn1'].spawnHarvester(extensionCount, 'A');
            console.log('Spawning A Harvester');
        }
        else {
            if (harvestersBCount < Memory.requiredBHarvesters) {
                Game.spawns['Spawn1'].spawnHarvester(extensionCount, 'B');
                console.log('Spawning B Harvester');
            }   
            else {
                if (constructionSites.length > 0 && builderCount < Memory.requiredBuilders) {
                    Game.spawns['Spawn1'].spawnBuilder(extensionCount);
                }
                else {
                    if (upgraderCount < Memory.requiredUpgraders) {
                        Game.spawns['Spawn1'].spawnUpgrader(extensionCount);
                    }
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
            creep.runBuilder(constructionSites);
        }

        if (creep.memory.role == 'upgrader') {
            creep.runUpgrader();
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    console.log('********** End tick **********');
}