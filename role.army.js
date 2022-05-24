var roleResources = require('role.resources');

var roleArmy = {
    buildArmy: function(targetRoom, extensions) {
        if (roleArmy.countScouts(targetRoom) < 1) {
            roleArmy.buildScouts(targetRoom, extensions);
        }
        if (roleArmy.countRanged(targetRoom) < 2) {
            roleArmy.buildRanged(targetRoom, extensions);
        }
        if (roleArmy.countMelee(targetRoom) < 2) {
            roleArmy.buildMelee(targetRoom, extensions);
        }
    },
    
    countScouts: function(targetRoom) {
        var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout' &&
            creep.memory.targetRoom == targetRoom);
        return scouts.length;
    },

    countRanged: function(targetRoom) {
        var ranged = _.filter(Game.creeps, (creep) => creep.memory.role == 'rangedSoldier' &&
            creep.memory.targetRoom == targetRoom);
        return ranged.length;
    },

    countMelee: function(targetRoom) {
        var ranged = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeSoldier' &&
            creep.memory.targetRoom == targetRoom);
        return ranged.length;
    },
    
    buildScouts: function (targetRoom, extensions) {
        var newName = 'Scout' + Game.time;
        console.log('Spawning: ' + newName);
        Memory.spawning = true;
        if (roleResources.isEnergyFull()) {
            Game.spawns['Spawn1'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
                        { memory: { role: 'scout', targetRoom: targetRoom } } );
        }
        Memory.spawning = false;
    },

    buildRanged: function(targetRoom, extensions) {
        var newName = 'RangedSoldier' + Game.time;
        console.log('Spawning: ' + newName);
        Memory.spawning = true;
        if (roleResources.isEnergyFull()) {
            Game.spawns['Spawn1'].spawnCreep([RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,TOUGH,TOUGH,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'rangedSoldier', targetRoom: targetRoom } } );
        }
        Memory.spawning = false;
    },

    buildMelee: function(targetRoom, extensions) {
        var newName = 'MeleeSoldier' + Game.time;
        console.log('Spawning: ' + newName);
        Memory.spawning = true;
        if (roleResources.isEnergyFull()) {
            Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,TOUGH,MOVE,MOVE,MOVE,MOVE], newName,
                {memory: {role: 'meleeSoldier', targetRoom: targetRoom } } );
        }
        Memory.spawning = false;
    },
    
    runScout: function (creep) {
        if (creep.room.name != creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(23, 48, creep.memory.targetRoom));
        }
        else {
            creep.moveTo(Game.flags[creep.memory.targetRoom+'Staging']);
        }
    },

    runRanged: function(creep) {
        if (creep.room.name != creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(23, 48, creep.memory.targetRoom));
        }
        else {
            creep.moveTo(Game.flags[creep.memory.targetRoom+'Staging']);
        }
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${creep.room.name}`);
            creep.moveTo(hostiles[0]);
            creep.rangedAttack(hostiles[0]);
        }
    },

    runMelee: function(creep) {
        if (creep.room.name != creep.memory.targetRoom) {
            creep.moveTo(new RoomPosition(23, 48, creep.memory.targetRoom));
        }
        else {
            creep.moveTo(Game.flags[creep.memory.targetRoom+'Staging']);
        }
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${creep.room.name}`);
            creep.moveTo(hostiles[0]);
            creep.attack(hostiles[0]);
        }
    }
};

module.exports = roleArmy;