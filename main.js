require('prototype.creep');

Memory.requiredAHarvesters = 1;
Memory.requiredBHarvesters = 1;
Memory.requiredACollectors = 1;
Memory.requiredBCollectors = 1;
Memory.requiredUpgraders = 1;
Memory.sourceA = 'e392d40b19ba2b5ebead1c24';
Memory.sourceB = '68f33270b899461ab1881603';

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');
    
    let harvestersACount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'A').length;

    let harvestersBCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'B').length;

    let upgradersCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'upgrader').length;

    let requiredACollectorsCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector').length;

    let requiredBCollectorsCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector').length;

    if (harvestersACount < Memory.requiredAHarvesters) {
        spawn.spawnCreep();
        
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
            if (upgradersCount < Memory.requiredUpgraders) {
                Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE],
                'Upgrader' + Game.time, {memory:{role:'upgrader', status:'refilling'}} );
                console.log('Spawning Upgrader');
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            creep.runHarvester();
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