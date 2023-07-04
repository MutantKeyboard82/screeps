require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredCollectors = 1;
Memory.requiredBuilders = 1;
Memory.requiredUpgraders = 1;
Memory.sourceA = '59830048b097071b4adc4070';
Memory.containerA = '291b5b24a0a1f16c9047718f';
Memory.sourceB = '59830048b097071b4adc406f';
Memory.containerB = 'b73c6100c9389349c577d5bf';
Memory.damageThreshold = 2000;
Memory.structuresToRepair = [];
Memory.collectorTTL = 201;

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');

    let extensionCount = Game.spawns.Spawn1.countExtensions();

    if (extensionCount < 5) {
        Memory.requiredAHarvesters = 2;

        Memory.requiredBHarvesters = 2;
    }
    else {
        Memory.requiredAHarvesters = 1;

        Memory.requiredBHarvesters = 1;
    }

    let myRooms = _.filter(Game.rooms);

    let myTowers = [];

    myRooms.forEach(room => CheckRepairs(room));

    myRooms.forEach(room => FindMyTowers(room));

    console.log('Damage Threshold Start: ' + Memory.damageThreshold);

    console.log('Structures to repair: ' + Memory.structuresToRepair.length);

    if (Memory.structuresToRepair.length > 100 && Memory.damageThreshold >= 0) {
        Memory.damageThreshold = Memory.damageThreshold - 100;
    }

    if (Memory.structuresToRepair.length == 0) {
        if (Memory.damageThreshold < 300000000) {
            Memory.damageThreshold = Memory.damageThreshold + 1000; 
        }
    }

    console.log('Damage Threshold End: ' + Memory.damageThreshold);
    
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

    if (collectorCount < Memory.requiredCollectors || Memory.collectorTTL < 200) {
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
        Memory.structuresToRepair = [];
        
        let targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax &&
                    structure.hits < Memory.damageThreshold);
            }
        });
        targets.forEach(target => Memory.structuresToRepair.push(target));
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