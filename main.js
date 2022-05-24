const mainRoom = 'W5S13';
const targetRooms = ['W5S12'];

Memory.requiredHarvesters = 8;
Memory.requiredAHarvesters = 3;
Memory.requiredBHarvesters = 2;
Memory.requiredUpgraders = 4;
Memory.requiredMaintainers = 0;
Memory.requiredBuilders = 1;
Memory.scoutsPerRoom = 1;
Memory.rangedSoldiersPerRoom = 2;
Memory.meleeSoldiersPerRoom = 2;

Memory.damageThreshold = 2000;

var roleArmy = require('role.army');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintain = require('role.maintain');
var roleTower = require('role.tower');
require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

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
        var constructionSitesMainRoomCount = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length;
        var constructionsSitesExternalCount = 0;
        for (var i in targetRooms) {
            var scoutsCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' &&
                creep.memory.targetRoom == targetRooms[i]).length;
            var rangedSoliderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedSoldier' &&
                creep.memory.targetRoom == targetRooms[i]).length;                
            var meleeSoliderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeSoldier' &&
                creep.memory.targetRoom == targetRooms[i]).length;
            constructionsSitesExternalCount = constructionsSitesExternalCount + Game
                .flags[targetRooms[i]+'Staging'].room.find(FIND_CONSTRUCTION_SITES).length;
            if (scoutsCount < Memory.scoutsPerRoom) {
                Game.spawns.Spawn1.spawnNewScout(extensionsCount,targetRooms[i]);
            }
            if (rangedSoliderCount < Memory.rangedSoldiersPerRoom) {
                Game.spawns.Spawn1.spawnNewRangedSoldier(extensionsCount,targetRooms[i]);
            }
            if (meleeSoliderCount < Memory.meleeSoldiersPerRoom) {
                Game.spawns.Spawn1.spawnNewMeleeSoldier(extensionsCount,targetRooms[i]);
            }
        }
        var buildersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        if ((constructionSitesMainRoomCount > 0 || constructionsSitesExternalCount > 0) &&
            buildersCount < Memory.requiredBuilders) {
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
            roleHarvester.run(creep);
        }
        /**if (creep.memory.role == 'harvester' && creep.memory.group != 'C') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'harvester' && creep.memory.group == 'C') {
            roleHarvester.runC(creep);
        }**/
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'scout') {
            roleArmy.runScout(creep);
        }
        if (creep.memory.role == 'rangedSoldier') {
            roleArmy.runRanged(creep);
        }
        if (creep.memory.role == 'meleeSoldier') {
            roleArmy.runMelee(creep);
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

    Creep.prototype.sayHello = function() { 
        // In prototype functions, 'this' usually has the value of the object calling 
        // the function. In this case that is whatever creep you are 
        // calling '.sayHello()' on.
        this.say("Hello!"); 
    };
}