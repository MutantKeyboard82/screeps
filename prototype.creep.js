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
};

Creep.prototype.runCollector = function() {
    if (this.memory.status == 'collecting') {
        if (this.memory.targetID == 'none') {
            this.memory.targetID = _.max( Memory.droppedResources, function( resources ){ return resources.amount; }).id;
        }
        else {
            let target = Game.getObjectById(this.memory.targetID);

            if (this.pickup(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
    }
};

