StructureTower.prototype.defendRoom = function(roomName) {
    let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        let username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        this.attack(hostiles[0]);
    }
    else {
        let creepsToRepair = Game.rooms[roomName].find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.hits < creep.hitsMax);
            }
        });
        if (creepsToRepair.length > 0) {
            this.heal(creepsToRepair[0]);
        }        
        else {
            let targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax &&
                        structure.hits < Memory.damageThreshold);
                }
            });
            this.repair(targets[0]);
        }
    }
};