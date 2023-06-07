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
            Memory.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);

            Memory.test = _.max( Memory.droppedResources, function( resources ){ return resources.amount; });

            this.memory.targetID = _.max( Memory.droppedResources, function( resources ){ return resources.amount; }).id;
        }
        else {
            let target = Game.getObjectById(this.memory.targetID);

            let result = this.pickup(target);

            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }

            if (result == OK || result == ERR_FULL) {
                this.memory.status = 'depositing';
                this.memory.targetID = 'none';
            }
        }
    }

    if (this.memory.status == 'depositing') {
        let target = Game.spawns['Spawn1'];

        let result = this.transfer(target, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }

        if (result == ERR_NOT_ENOUGH_RESOURCES || result == OK) {
            this.memory.status = 'collecting';
        }
    }
};

