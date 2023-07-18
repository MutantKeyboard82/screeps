require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredCollectors = 1;
Memory.requiredBCollectors = 1;
Memory.requiredBuilders = 2;
Memory.requiredUpgraders = 1;
Memory.requiredBUpgraders = 1;
Memory.requiredCUpgraders = 0;
Memory.requiredStorageTransfer = 1;
Memory.sourceA = '59830048b097071b4adc4070';
Memory.containerA = '291b5b24a0a1f16c9047718f';
Memory.sourceB = '59830048b097071b4adc406f';
Memory.containerB = 'b73c6100c9389349c577d5bf';
Memory.sourceC = '59830048b097071b4adc406c';
Memory.containerC = '64ae995351a2bd26c9844a60';
Memory.sourceD = '59830048b097071b4adc406a';
Memory.containerD = '64ae987313dbb95045be71a0';
Memory.secondController = '59830048b097071b4adc406b';
Memory.thirdController = '59830056b097071b4adc41ac';
Memory.sourceLinkA = '64b524a199c1ff18019fc898';
Memory.storageLink = '64b515e25382d89c6d16f70e';
Memory.homeRoom = 'E41S36';
Memory.secondRoom = 'E41S35';
Memory.thirdRoom = 'E42S36';
Memory.damageThreshold = 2000;
Memory.structuresToRepair = [];
Memory.collectorTTL = 201;

module.exports.loop = function () {
    console.log('********** Start tick ' + Game.time + ' **********');

    let extensionCount = Game.spawns.Spawn1.countExtensions();

    if (extensionCount < 5) {
        Memory.requiredAHarvesters = 2;

        Memory.requiredBHarvesters = 2;

        Memory.requiredCHarvesters = 0;

        Memory.requiredDHarversters = 0;
    }
    else {
        Memory.requiredAHarvesters = 1;

        Memory.requiredBHarvesters = 1;

        Memory.requiredCHarvesters = 1;

        Memory.requiredDHarvesters = 1;
    }

    if (Game.spawns['Spawn1'].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) < 10000) {
        Memory.requiredUpgraders = 1;

        Memory.requiredBUpgraders = 1;

        Memory.requiredCUpgraders = 1;

        Memory.requiredBuilders = 1;
    }

    if (Game.spawns['Spawn1'].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 50000) {
        Memory.requiredUpgraders = 2;

        Memory.requiredBUpgraders = 2;

        Memory.requiredCUpgraders = 2;

        Memory.requiredBuilders = 2;
    }

    if (Game.spawns['Spawn1'].room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 100000) {
        Memory.requiredUpgraders = 3;

        Memory.requiredBUpgraders = 3;

        Memory.requiredCUpgraders = 3;

        Memory.requiredBuilders = 3;
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

    let harvestersCCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'C').length;

    let harvestersDCount = _.filter(Game.creeps, (creep) => 
        creep.memory.role == 'harvester' && creep.memory.source == 'D').length;

    let collectorCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector' && creep.memory.group =='A').length;

    let collectorBCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'collector' && creep.memory.group == 'B').length;

    let transferCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'transfer').length;

    let builderCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'builder').length;

    let constructionSites = _.filter(Game.constructionSites);

    let upgraderCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'upgrader' && creep.memory.group == 'A').length;

    let upgraderBCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'upgrader' && creep.memory.group == 'B').length;

    let upgraderCCount = _.filter(Game.creeps, (creep) =>
        creep.memory.role == 'upgrader' && creep.memory.group == 'C').length;

    if (collectorCount < Memory.requiredCollectors || Memory.collectorTTL < 200) {
            Game.spawns['Spawn1'].spawnCollector(extensionCount, 'A');
    }

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
            if (harvestersCCount < Memory.requiredCHarvesters) {
                Game.spawns['Spawn1'].spawnHarvester(extensionCount, 'C');
                console.log('Spawning C Harvester');
            }
            else {
                if (harvestersDCount < Memory.requiredDHarvesters) {
                    Game.spawns['Spawn1'].spawnHarvester(extensionCount, 'D');
                    console.log('Spawning D Harvester');
                }   
                else {
                    if (collectorBCount < Memory.requiredBCollectors) {
                        Game.spawns['Spawn1'].spawnCollector(extensionCount, 'B')
                    }
                    else {
                        if (transferCount < Memory.requiredStorageTransfer) {
                            Game.spawns['Spawn1'].spawnTransfer();
                        }
                        else {
                            if (constructionSites.length > 0 && builderCount < Memory.requiredBuilders) {
                                Game.spawns['Spawn1'].spawnBuilder(extensionCount);
                            }
                            else {
                                if (upgraderCount < Memory.requiredUpgraders) {
                                    Game.spawns['Spawn1'].spawnUpgrader(extensionCount, 'A');
                                }
                                else {
                                    if (upgraderBCount < Memory.requiredBUpgraders) {
                                        Game.spawns['Spawn1'].spawnUpgrader(extensionCount, 'B');
                                    }
                                    else {
                                        if (upgraderCCount < Memory.requiredCUpgraders) {
                                            Game.spawns['Spawn1'].spawnUpgrader(extensionCount, 'C');
                                        }
                                    }
                                }
                            }
                        }
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
            if (creep.memory.group == 'C') {
                creep.runCUpgrader();
            }
            else {
                creep.runUpgrader();
            }
        }

        if (creep.memory.role == 'transfer') {
            creep.runTransfer();
        }
    }

    myTowers.forEach(tower => tower.defendRoom())

    TransferEnergy();
    
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
    };

    function FindMyTowers(room) {
        let roomTowers = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });
        roomTowers.forEach(tower => myTowers.push(tower));
    };

    function TransferEnergy() {
        let link = Game.getObjectById(Memory.sourceLinkA);

        let targetLink = Game.getObjectById(Memory.storageLink);

        let availableCapacity = targetLink.store.getFreeCapacity(RESOURCE_ENERGY);

        let usedCapacity = link.store.getUsedCapacity(RESOURCE_ENERGY);

        if (availableCapacity > 0 && usedCapacity > 0) {
            link.transferEnergy(targetLink, usedCapacity);
        }
    };
}