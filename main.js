const targetRooms = ['W5S12'];

Memory.requiredHarvesters = 9;
Memory.requiredAHarvesters = 3;
Memory.requiredBHarvesters = 2;
Memory.requiredUpgraders = 3;
Memory.requiredMaintainers = 0;
Memory.requiredBuilders = 1;
Memory.requiredABuilders = 1;

Memory.damageThreshold = 2000;

var roleArmy = require('role.army');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintain = require('role.maintain');
var roleTower = require('role.tower');
require('prototype.creep');
require('prototype.spawn');

module.exports.loop = function () {
    var extensionsCount = Game.spawns.Spawn1.countExtensions();
    var harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    if (harvestersCount < Memory.requiredHarvesters) {
        Game.spawns.Spawn1.spawnNewHarvester(extensionsCount);
    }
    
    //roleHarvester.buildHarvesters(extensionsCount);
    /**if (roleHarvester.count() == Memory.requiredHarvesters) {
        roleUpgrader.buildUpgraders(extensionsCount);
        for (var i in targetRooms) {
            roleArmy.buildArmy(targetRooms[i], extensionsCount);
        }
        roleBuilder.buildBuilders(extensionsCount);
    }
    /**if (roleHarvester.count() == Memory.requiredHarvesters) {
        
    }
    if (roleHarvester.count() >= Memory.requiredHarvesters) {
        
    }**/
    
    roleMaintain.checkRepairs();
    roleTower.defendRoom('W5S13');
    
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