require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');


const mainRoom = 'W5S13';
const targetRooms = ['W5S12'];

Memory.requiredHarvesters = 6;
Memory.requiredAHarvesters = 2;
Memory.requiredBHarvesters = 2;
Memory.requiredUpgraders = 1;
Memory.requiredMaintainers = 0;
Memory.requiredBuilders = 1;
Memory.scoutsPerRoom = 0;
Memory.rangedSoldiersPerRoom = 0;
Memory.meleeSoldiersPerRoom = 0;
Memory.damageThreshold = 2000;

module.exports.loop = function () {
    var extensionsCount = Game.spawns.Spawn1.countExtensions();
    var harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    if (harvestersCount < Memory.requiredHarvesters) {
        Game.spawns.Spawn1.spawnNewHarvester(extensionsCount);
    }
    else {
        var upgradersCount = _.filter (Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        if(upgradersCount < Memory.requiredUpgraders) {
            Game.spawns.Spawn1.spawnNewUpgrader(extensionsCount);
        }
        Memory.constructionSites = [];
        var spawnConstructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        for (var i in spawnConstructionSites) {
            Memory.constructionSites.push(spawnConstructionSites[i]);
        }
        for (var i in targetRooms) {
            var scoutsCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' &&
                creep.memory.targetRoom == targetRooms[i]).length;
            var rangedSoliderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedSoldier' &&
                creep.memory.targetRoom == targetRooms[i]).length;                
            var meleeSoliderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeSoldier' &&
                creep.memory.targetRoom == targetRooms[i]).length;
            var externalConstructionSites = Game
                .flags[targetRooms[i]+'Staging'].room.find(FIND_CONSTRUCTION_SITES);
            for (var i in externalConstructionSites) {
                Memory.constructionSites.push(externalConstructionSites[i]);    
            }
            if (scoutsCount < Memory.scoutsPerRoom) {
                Game.spawns.Spawn1.spawnNewScout(extensionsCount,targetRooms[i]);
            }
            else if (rangedSoliderCount < Memory.rangedSoldiersPerRoom) {
                Game.spawns.Spawn1.spawnNewRangedSoldier(extensionsCount,targetRooms[i]);
            }
            else if (meleeSoliderCount < Memory.meleeSoldiersPerRoom) {
                Game.spawns.Spawn1.spawnNewMeleeSoldier(extensionsCount,targetRooms[i]);
            }
        }
        var buildersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        if (Memory.constructionSites.length > 0 && buildersCount < Memory.requiredBuilders) {
            Game.spawns.Spawn1.spawnNewBuilder(extensionsCount);
        }
    }
     
    //TODO Check for Creeps needing repair.

    Game.spawns.Spawn1.checkRepairs();
    var mainRoomTowers = Game.rooms[mainRoom].find(FIND_MY_STRUCTURES,
        {filter: {structureType: STRUCTURE_TOWER}});
        mainRoomTowers.forEach(tower => tower.defendRoom(mainRoom));
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            creep.runHarvester();
        }
        if (creep.memory.role == 'upgrader') {
            creep.runUpgrader();
        }
        if (creep.memory.role == 'builder') {
            creep.runBuilder();
        }
        if (creep.memory.role == 'scout') {
            creep.runScout();
        }
        if (creep.memory.role == 'rangedSoldier') {
            creep.runRanged();
        }
        if (creep.memory.role == 'meleeSoldier') {
            creep.runMelee();
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}