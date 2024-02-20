require('prototype.creep');
require('prototype.room');
require('prototype.spawn');
require('prototype.tower');

module.exports.loop = function () {
    // Build Queue
    console.log('********** Start tick ' + Game.time + ' **********');

    let spawn = Game.spawns['Spawn1'];

    spawn.runSpawner();

    for (var name in Game.creeps) {
        let creep = Game.creeps[name];

        creep.runCreep();
    }

    Memory.towers = [];

    let myRooms = _.filter(Game.rooms);

    myRooms.forEach(room => room.findTowers());

    if (Memory.towers != null) {
        Memory.towers.forEach(tower => tower.defendRoom());
    }

    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    console.log('********** End tick **********');
}