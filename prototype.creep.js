Creep.prototype.runHarvester = function() {
    if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        var source = Game.getObjectById('32817ae98699dab055b5a10d');

        if(this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    }
    else {
        if (this.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(Game.spawns['Spawn1']);
        }
    }
}