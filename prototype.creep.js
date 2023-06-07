Creep.prototype.runHarvester = function() {
    let source;
    if (this.memory.source == 'A') {
        source = Game.getObjectById(Memory.sourceA);
    }
    else {
        source = Game.getObjectById(Memory.sourceB);
    }
    if(this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source);
    }
}