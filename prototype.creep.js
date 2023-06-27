Creep.prototype.runHarvester = function() {
    let source;
    let container;
    if (this.memory.source == 'A') {
        source = Game.getObjectById(Memory.sourceA);

        container = Game.getObjectById(Memory.containerA);
    }
    else {
        source = Game.getObjectById(Memory.sourceB);

        container = Game.getObjectById(Memory.containerB);
    }
    if (container != null) {
        if (this.pos.isEqualTo(container)) {
            this.harvest(source);
        }
        else {
            this.moveTo(container);
        }
    }
    else {
        if(this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
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

                this.memory.target = 'extensions';
            }
        }
    }

    if (this.memory.status == 'depositing') {
        let target;

        if (this.memory.target == 'extensions') {
            let extensions = this.room.find(FIND_MY_STRUCTURES, {
                filter: {structureType: STRUCTURE_EXTENSION}
                });

            if (extensions.length > 0) {    
                target = _.max(extensions, function( extension )
                    { return extension.store.getFreeCapacity(RESOURCE_ENERGY); });

                if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {                    
                    this.memory.target = 'spawn';
                }
                else {
                    let result = this.transfer(target, RESOURCE_ENERGY);                    

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }

                    if (result == ERR_NOT_ENOUGH_RESOURCES) {
                        this.memory.status = 'collecting';
                    }
                }
            }
            else {
                this.memory.target = 'spawn';
            }
        }

        if (this.memory.target == 'spawn') {
            if (Game.spawns['Spawn1'].store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            {
                this.memory.target = 'towers';
            }
            else {
                target = Game.spawns['Spawn1'];

                if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.memory.target = 'towers';
                }
                else {
                    let result = this.transfer(target, RESOURCE_ENERGY);

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }

                    if (result == ERR_NOT_ENOUGH_RESOURCES) {
                        this.memory.status = 'collecting';
                    }

                    if (result == ERR_FULL) {
                        this.memory.target = 'towers';
                    }
                }
            }
        }

        if (this.memory.target == 'towers') {
            let towers = this.room.find(FIND_MY_STRUCTURES, {
                filter: {structureType: STRUCTURE_TOWER}
            });

            if (towers.length > 0) {    
                target = _.max(towers, function( tower )
                    { return tower.store.getFreeCapacity(RESOURCE_ENERGY); });

                    if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        this.memory.target = 'storage';
                    }
                    else {
                        let result = this.transfer(target, RESOURCE_ENERGY);
        
                        if (result == ERR_NOT_IN_RANGE) {
                            this.moveTo(target);
                        }
                
                        if (result == ERR_NOT_ENOUGH_RESOURCES) {
                            this.memory.status = 'collecting';
                        }
                    }
            }
            else {
                this.memory.target = 'storage';
            }
        }

        if (this.memory.target == 'storage') {
            if (this.room.storage != null){
                let storage = this.room.storage;

                console.log('Storage: ' + storage);

                console.log(storage.store.getFreeCapacity());

                if (storage.store.getFreeCapacity() > 0) {
                    let result = this.transfer(storage, RESOURCE_ENERGY);

                    console.log('Result: ' + result);

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }
            
                    if (result == ERR_NOT_ENOUGH_RESOURCES) {
                        this.memory.status = 'collecting';
                    }
                }
            }
            else {
                this.memory.target = 'extensions';
            }
        }
    }
};

Creep.prototype.runBuilder = function(constructionSites) {
    if (constructionSites.length == 0)
    {
        this.suicide();
    }

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

            if (result == OK || result == ERR_INVALID_TARGET) {
                this.memory.targetID ='none';
            }
        }
    }
};

Creep.prototype.runUpgrader = function() {
    if (this.memory.status == 'stocking') {
        if (this.memory.targetID == 'none') {
            this.findBestResources();
        }
        else {
            let result = this.collectResources();

            if (result == OK) {
                this.memory.status = 'upgrading';
            }
        }
    }
    else {
        let controller = this.room.controller;

        let result = this.upgradeController(controller);
        
        if (result == ERR_NOT_IN_RANGE) {
            this.moveTo(controller);
        }

        if (result == ERR_NOT_ENOUGH_RESOURCES) {
            this.memory.status = 'stocking';

            this.memory.targetID = 'none';
        }
    }
};

Creep.prototype.findBestResources = function() {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: {structureType: STRUCTURE_CONTAINER }
    });

    if (containers.length > 0) {
        this.memory.targetID = _.max( containers, function( container ) {
            return container.store.getUsedCapacity();
        }).id;

        this.memory.target = 'container';
    }
    else {
        Memory.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);

        this.memory.targetID = _.max( Memory.droppedResources, function( resources ){ return resources.amount; }).id;
    }
};

Creep.prototype.collectResources = function() {
    let target = Game.getObjectById(this.memory.targetID);

    let result;

    if (this.memory.target == 'container') {
        result = this.withdraw(target, RESOURCE_ENERGY);
    }
    else {
        result = this.pickup(target);
    }

    if (result == ERR_NOT_IN_RANGE) {
        this.moveTo(target);

        return ERR_NOT_IN_RANGE
    }

    if (result == OK || result == ERR_FULL || ERR_INVALID_TARGET) {
        this.memory.targetID = 'none';

        return OK;
    }
};