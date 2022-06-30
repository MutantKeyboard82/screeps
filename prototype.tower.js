StructureTower.prototype.defendRoom = function() {
    let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 3) {
        let username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${this.room.name}`);
        this.attack(hostiles[0]);
    }
    else {
        let creepsToRepair = this.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.hits < creep.hitsMax);
            }
        });
        if (creepsToRepair.length > 0) {
            this.heal(creepsToRepair[0]);
        }        
        else {
            let targets = _.filter(Memory.structuresToRepair, (structure) =>  structure.room == this.room);
            if (targets.length > 0) {
                if (this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {
                    this.repair(targets[0]);
                }
            }
            else {
                let targets = this.room.find(FIND_HOSTILE_STRUCTURES);
                if (targets.length > 0) {
                    this.attack(targets[0]);
                }
            }
        }
    }
};