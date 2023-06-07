Creep.prototype.runHarvester = function() {
    console.log(this.store.getFreeCapacity());
    if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        var source = Game.getObjectById('5983007db097071b4adc4657');

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