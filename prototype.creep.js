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
            this.findBestResources();
        }
        else {
            let result = this.collectResources();

            if (result == OK) {
                this.memory.status = 'depositing';
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

Creep.prototype.runBuilder = function() {
    if (this.memory.status == 'stocking') {
        if (this.memory.targetID == 'none') {
            this.findBestResources();
        }
        else {
            let result = this.collectResources();

            if (result == OK) {
                this.memory.status = 'building';
            }
        }
    }
    else {
        if (this.memory.targetID == 'none') {
            this.memory.targetID = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES).id;
        }
        else {
            let target = Game.getObjectById(this.memory.targetID);

            let result = this.build(target);

            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }

            if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.memory.status = 'stocking';

                this.memory.targetID = 'none';
            }

            if (result == OK) {
                this.memory.targetID ='none';
            }
        }
    }
};

Creep.prototype.findBestResources = function() {
    Memory.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);

    this.memory.targetID = _.max( Memory.droppedResources, function( resources ){ return resources.amount; }).id;
};

Creep.prototype.collectResources = function() {
    let target = Game.getObjectById(this.memory.targetID);

            let result = this.pickup(target);

            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(target);

                return ERR_NOT_IN_RANGE
            }

            if (result == OK || result == ERR_FULL) {
                this.memory.targetID = 'none';

                return OK;
            }
};

