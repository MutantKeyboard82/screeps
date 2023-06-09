require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredCollectors = 1;
Memory.requiredBuilders = 1;
Memory.requiredUpgraders = 1;
Memory.sourceA = 'a0852f21014eef969de1a29e';
Memory.sourceB = 'f08845b29e943f54f0455752';
Memory.damageThreshold = 2000;
Memory.structuresToRepair = [];

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

    let myRooms = _.filter(Game.rooms);

    let myTowers = [];

    myRooms.forEach(room => CheckRepairs(room));

    myRooms.forEach(room => FindMyTowers(room));

    if (Memory.structuresToRepair.length > 100) {
        console.log('Reducing Threshold');

        Memory.damageThreshold = Memory.damageThreshold - 100;
    }

    if (Memory.structuresToRepair.length == 0) {
        console.log('Increasing Threshold');

        if (Memory.damageThreshold < 300000000) {
            Memory.damageThreshold = Memory.damageThreshold + 1000; 
        }
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

    myTowers.forEach(tower => tower.defendRoom())
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    console.log('********** End tick **********');

    function CheckRepairs(room) {
        let targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax &&
                    structure.hits < Memory.damageThreshold);
            }
        });
        targets.forEach(target => Memory.structuresToRepair.push(target));

        console.log('Repairing: ' + Memory.structuresToRepair.length);
    };

    function FindMyTowers(room) {
        let roomTowers = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });
        roomTowers.forEach(tower => myTowers.push(tower));
    };
}