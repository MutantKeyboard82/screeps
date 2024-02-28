StructureTower.prototype.defendRoom = function() {
const hitThreshold = 500000;

    let hostiles = this.room.find(FIND_HOSTILE_CREEPS);

    if(hostiles.length > 0) {
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
            let targets = this.checkRepairs(); 

            if (targets.length > 0) {
                    let sortedTarget = _.min(targets, function( target )
                    { return target.hits; });

                    if (sortedTarget.hits < hitThreshold) {
                        this.repair(sortedTarget);
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

StructureTower.prototype.checkRepairs = function() {
    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits < structure.hitsMax
            );
        }
    });

    let sortedTargets = targets.sort(function(a, b){return a.hits - b.hits});

    return sortedTargets;
};