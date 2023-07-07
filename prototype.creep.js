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
    Memory.collectorTTL = this.ticksToLive;

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

                if (target.store.getFreeCapacity(RESOURCE_ENERGY) < 20) {
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
            if (this.room.storage != null) {
                target = this.room.storage;

                if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.memory.target = 'extensions';
                }
                else {
                    let result = this.transfer(target, RESOURCE_ENERGY);

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }

                    if (result == ERR_NOT_ENOUGH_RESOURCES) {
                        this.memory.status = 'collecting';
                    }

                    if (result == OK) {
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
        if (this.memory.group == 'A') {
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

        if (this.memory.group == 'B') {
            let controller = Game.getObjectById(Memory.controllerB);

            console.log(Memory.controllerB);
            
            console.log(controller);

            let result = this.upgradeController(controller);

            console.log(result);
            
            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(controller);
            }

            if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.memory.status = 'stocking';

                this.memory.targetID = 'none';
            }

            if (result == ERR_NOT_OWNER) {
                this.claimController(controller);

                this.signController(controller, 'This room is under the control of The Hidden Guild - https://discord.gg/WRDG6Sy');
            }
        }
    }
};

Creep.prototype.findBestResources = function() {
    if ((this.memory.role != 'collector' && this.room.storage != null) ||
        (this.memory.role == 'collector' && this.room.energyAvailable != this.room.energyCapacityAvailable &&
        this.room.storage != null && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0)) {
            this.memory.target = 'storage';

            this.memory.targetID = this.room.storage.id;
    }
    else {
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
    }
};

Creep.prototype.collectResources = function() {
    let target = Game.getObjectById(this.memory.targetID);

    let result;

    if (this.memory.target == 'container' || this.memory.target == 'storage') {
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