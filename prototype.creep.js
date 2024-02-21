Creep.prototype.runCreep = function() {
    switch (this.memory.role) {
        case "harvester":
            switch (this.memory.group) {
                case "basic":
                    this.runHarvester();

                    break;
            }

        break;

        case "collector":
            switch (this.memory.group) {
                case "basic":
                    this.runCollector();
            }

        break;

        case "upgrader":
            switch (this.memory.group) {
                case "basic":
                    this.runUpgrader();
            }

        break;

        case "builder":
            this.runBuilder();
        
        break;
    }
};

Creep.prototype.runHarvester = function() {
    let source = Game.getObjectById(this.memory.targetID);

    if (this.memory.status == 'harvesting') {
        if (this.memory.container == null) {
            this.findContainer();

            if(this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
        else {
            let container = Game.getObjectById(this.memory.container);

            if (this.pos.isEqualTo(container)) {
                this.harvest(source);
            }
            else {
                this.moveTo(container);
            }
        }
    }
};

Creep.prototype.runCollector = function() {
    if (this.memory.status == 'moving') {        
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            let target = Game.getObjectById(this.memory.targetID);

            let serialPath = Room.serializePath(this.pos.findPathTo(target));

            let path2 = Room.deserializePath(serialPath);

            if (path2.length > 3) {
                this.moveTo(target);
            }
            else {
                this.findContainer();

                this.memory.status = 'collecting';
            }
        }
        else {
            this.memory.status = 'depositing';

            this.memory.target = 'extensions';
        }
    }

    if (this.memory.status == 'collecting') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.memory.container != null) {
                this.collectFromContainer();
            }
            else {
                this.CollectDroppedResources();
            }
        }
    }

    if (this.memory.status == 'depositing') {
        let target;

        if (this.memory.target == 'extensions') {
            this.DepositInExtensions();
        }

        if (this.memory.target == 'spawn') {
            this.DepositInSpawn();
        }

        if (this.memory.target == 'towers') {
            this.DepositInTowers();
        }

        if (this.memory.target == 'storage') {
            this.DepositInStorage();
        }
    }
};

Creep.prototype.CollectDroppedResources = function() {
    let droppedResources = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    let result = this.pickup(droppedResources);

    if (result == ERR_NOT_IN_RANGE) {
        this.moveTo(droppedResources);
    }

    if (result == ERR_FULL) {
        this.memory.status = 'depositing';

        this.memory.target = 'extensions';
    }

    if (result == OK) {
        this.memory.status = 'depositing';

        this.memory.target = 'extensions';

        this.checkForHalfLoads();
    }
};

Creep.prototype.DepositInExtensions = function() {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY > 0)) {
        let extensions = this.room.find(FIND_MY_STRUCTURES, {
            filter: {structureType: STRUCTURE_EXTENSION}
    });

        if (extensions != null) {
            let sortedExtensions = _.filter(extensions, (extension) =>
                extension.store.getFreeCapacity(RESOURCE_ENERGY) > 0);

            if (sortedExtensions.length != 0) {
                let extension = this.pos.findClosestByPath(sortedExtensions);

                if (this.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(extension);
                }

                if (this.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES) {
                    this.memory.status = 'collecting';
                }
            }
            else {
                this.memory.target = "spawn";    
            }
        }
        else {
            this.memory.target = "spawn";
        }
    }
    else {
        this.memory.status = 'moving';
    }
};

Creep.prototype.DepositInSpawn = function() {
    let spawn = Game.spawns['Spawn1'];

    if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }

            if (this.transfer(spawn, RESOURCE_ENERGY) == ERR_FULL) {
                this.memory.target = 'towers';
            }
        }
        else {
            this.memory.target = 'towers';
        }
    }
    else {
        this.memory.status = 'moving';
    }
};

Creep.prototype.DepositInTowers = function() {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        let towers = this.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });

        if (towers.length != 0) {
            let tower = towers[0];

            if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (this.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(tower);
                }

                if (this.transfer(tower, RESOURCE_ENERGY) == ERR_FULL) {
                    this.memory.target = 'storage'
                }
            }
            else {
                this.memory.target = 'storage';
            }
        }
        else {
            this.memory.target = 'storage';
        }
    }
    else {
        this.memory.status = 'moving';
    }
};

Creep.prototype.DepositInStorage = function() {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        let storage = this.room.storage;

        if (storage != null) {
            if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {

                let result = this.transfer(storage, RESOURCE_ENERGY);

                if (result == ERR_NOT_IN_RANGE) {
                    this.moveTo(storage);
                }

                if (result == ERR_NOT_ENOUGH_RESOURCES) {
                    this.memory.status = 'collecting';

                    this.target = 'none';
                }
            }
            else {
                this.memory.target = 'extensions';
            }
        }
        else {
            this.memory.target = 'extensions';
        }
    }
    else {
        this.memory.status = 'moving';
    }
};

Creep.prototype.runUpgrader = function() {
    if (this.memory.status == 'stocking') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.storage == null) {
                this.CollectDroppedResources();
            }
            else {
                this.collectFromStorage();
            }
        }
        else {
            this.memory.status = 'upgrading';
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

Creep.prototype.collectFromStorage = function() {
    let result = this.withdraw(this.room.storage, RESOURCE_ENERGY);

    if (result == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.storage);
    }

    if (result == OK) {
        this.memory.status = 'upgrading';
    }
};

Creep.prototype.collectFromContainer = function() {
    let container = Game.getObjectById(this.memory.container);

    let result = this.withdraw(container, RESOURCE_ENERGY);

    if (result == ERR_NOT_IN_RANGE) {
        this.moveTo(container);
    }

    if (result == OK) {
        this.memory.status = 'depositing';

        this.memory.target = 'extensions';

        this.checkForHalfLoads();
    }
};

Creep.prototype.checkForHalfLoads = function() {
    if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (this.memory.halfLoads == null) {
            this.memory.halfLoads = 1;
        }
        else {
            this.memory.halfLoads = this.memory.halfLoads + 1;
        }
    }
};

Creep.prototype.findContainer = function() {
    let container = this.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: { structureType: STRUCTURE_CONTAINER }
    });

    if (container[0] != null) {
        this.memory.container = container[0].id;
    }
};

Creep.prototype.runBuilder = function() {
    let constructionSites = _.filter(Game.constructionSites);

    if (constructionSites.length == 0) {
        this.suicide();
    }

    if (this.memory.status == 'stocking') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.storage == null) {
                this.CollectDroppedResources();
            }
            else {
                this.collectFromStorage();
            }
        }
        else {
            this.memory.status = 'building';
        }
    }
    else {
        if (this.memory.targetID == null) {
            let firstSite = constructionSites[0];

            if (this.room.name != firstSite.room.name) {
                this.moveTo(firstSite);
            }
            else {
                this.memory.targetID = this.pos.findClosestByPath(constructionSites).id;
            }
        }
        else {
            let target = Game.getObjectById(this.memory.targetID);

            let result = this.build(target);

            if (result == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }

            if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.memory.status = 'stocking';

                this.memory.targetID = null;
            }

            if (result == OK || result == ERR_INVALID_TARGET) {
                this.memory.targetID = null;
            }
        }
    }
};

// Creep.prototype.checkTTL = function() {
//     if (this.ticksToLive < 200) {
//         let creepCount = _.filter(Game.creeps, (creep) =>
//             creep.memory.role == this.memory.role).length;

//         if (this.memory.role == 'harvester') {
//             if (creepCount == 2) {
//                 let basicCreep = {role: this.memory.role, group: "basic"};

//                 Memory.basicWorkersQueue.push(basicCreep);
//             }
//         }
//         else {
//             if (creepCount == 1) {
//                 let basicCreep = {role: this.memory.role, group: "basic"};

//                 Memory.basicWorkersQueue.push(basicCreep);
//             }
//         }
//     }
// };

// Creep.prototype.runBuilder = function() {
//     let constructionSites = _.filter(Game.constructionSites);

//     if (constructionSites.length == 0) {
//         this.suicide();
//     }

//     if (this.memory.status == 'collecting') {
//         if (this.memory.targetID == 'none') {
//             this.findBestResources();
//         }
//         else {
//             let result = this.collectResources();

//             if (result == OK) {
//                 this.memory.status = 'building';
//             }
//         }
//     }
//     else {
//         if (this.memory.targetID == 'none') {
//             let firstSite = constructionSites[0];

//             if (this.room.name != firstSite.room.name) {
//                 this.moveTo(firstSite);
//             }
//             else {
//                 this.memory.targetID = this.pos.findClosestByPath(constructionSites).id;
//             }
//         }
//         else {
//             let target = Game.getObjectById(this.memory.targetID);

//             let result = this.build(target);

//             if (result == ERR_NOT_IN_RANGE) {
//                 this.moveTo(target);
//             }

//             if (result == ERR_NOT_ENOUGH_RESOURCES) {
//                 this.memory.status = 'collecting';

//                 this.memory.targetID = 'none';
//             }

//             if (result == OK || result == ERR_INVALID_TARGET) {
//                 this.memory.targetID ='none';
//             }
//         }
//     }
// };

// // Deprecated
// Creep.prototype.runHarvester = function() {
//     let source;
//     let container;
//     if (this.memory.source == 'A') {
//         source = Game.getObjectById(Memory.sourceA);

//         container = Game.getObjectById(Memory.containerA);
//     }
//     else {
//         if (this.memory.source == 'B') {
//             source = Game.getObjectById(Memory.sourceB);

//             container = Game.getObjectById(Memory.containerB);
//         }
//         else {
//             if (this.memory.source == 'C') {
//                 source = Game.getObjectById(Memory.sourceC);
    
//                 container = Game.getObjectById(Memory.containerC);
//             }
//             else {
//                 if (this.memory.source == 'D') {
//                     source = Game.getObjectById(Memory.sourceD);
        
//                     container = Game.getObjectById(Memory.containerD);
//                 }
//             }
//         }
//     }

//     if (container != null) {
//         if (this.pos.isEqualTo(container)) {
//             this.harvest(source);
//         }
//         else {
//             this.moveTo(container);
//         }
//     }
//     else {
//         if(this.harvest(source) == ERR_NOT_IN_RANGE) {
//             this.moveTo(source);
//         }
//     }
// };

// Creep.prototype.RunEHarvester = function() {
//     let source;

//     let container;

//     source = Game.getObjectById(Memory.sourceE);

//     container = Game.getObjectById(Memory.containerE);

//     if (container != null) {
//         if (this.pos.isEqualTo(container)) {
//             this.harvest(source);
//         }
//         else {
//             this.moveTo(container);
//         }
//     }
//     else {
//         if(this.harvest(source) == ERR_NOT_IN_RANGE) {
//             this.moveTo(source);
//         }
//     }
// };

// Creep.prototype.RunCCollector = function() {
//     if (this.memory.status == 'depositing') {
//         if (this.memory.target == null) {
//             this.memory.target = 'Room 2 Towers';
//         }

//         if (this.memory.target == 'Room 2 Towers') {
//             let towers = this.room.find(FIND_MY_STRUCTURES, {
//                 filter: {structureType: STRUCTURE_TOWER}
//                 });

//             let target = towers[0];

//             if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 30) {
//                 let result = this.transfer(target, RESOURCE_ENERGY);

//                 if (result == ERR_NOT_IN_RANGE) {
//                     this.moveTo(target);
//                 }

//                 if (result == ERR_NOT_ENOUGH_RESOURCES) {
//                     this.memory.status = 'collecting';

//                     this.memory.hitFlag = true;
//                 }

//                 if (result == ERR_FULL) {
//                     this.memory.target = 'link';
//                 }
//             }
//             else {
//                 this.memory.target = 'link';
//             }
//         }

//         if (this.memory.target == 'link') {
//             let target = Game.getObjectById(Memory.sourceLinkA);

//             let result = this.transfer(target, RESOURCE_ENERGY);

//             if (result == ERR_NOT_IN_RANGE) {
//                 this.moveTo(target);
//             }

//             if (result == ERR_NOT_ENOUGH_RESOURCES) {
//                 this.memory.status = 'collecting';

//                 this.memory.target = 'Room 2 Towers';

//                 this.memory.hitFlag = false;
//             }
//         }
//     }
    
//     if (this.memory.status == 'collecting') {
//         if (this.memory.hitFlag == false) {
//             let flag = Game.flags['Flag1'];

//             this.moveTo(flag);

//             if (this.pos.isEqualTo(flag)) {
//                 this.memory.hitFlag = true;
//             }
//         }

//         if (this.memory.hitFlag == true) {
//             if (this.memory.targetID == 'none') {
//                 this.findBestResources();
//             }
//             else {
//                 let result = this.collectResources();
        
//                 if (result == OK) {
//                     this.memory.status = 'depositing';

//                     this.memory.hitFlag = true;

//                     this.memory.target = 'Room 2 Towers';
//                 }
//             }
//         }
//     }
// };

// Creep.prototype.RunBCollector = function() {
//     Memory.collectorTTL = this.ticksToLive;

//     if (this.memory.status == 'collecting') {
//         this.CollectFromStorage();
//     }

//     if (this.memory.status == 'depositing') {
//         this.DepositInExtensions();
//     }
// };

// Creep.prototype.runCUpgrader = function() {
//     if (this.memory.status == 'stocking') {
//         let flag = Game.flags['Flag3'];

//         if (this.pos.isEqualTo(flag.pos)) {
//             this.memory.hitFlag = true;
//         }

//         if (this.memory.hitFlag == false) {
//             this.moveTo(flag);
//         }
//         else {
//             if (this.memory.targetID == 'none') {
//                 this.findBestResources();
//             }
//             else {
//                 let result = this.collectResources();

//                 if (result == OK) {
//                     this.memory.status = 'upgrading';

//                     this.memory.hitFlag = false;
//                 }
//             }
//         }
//     }
//     else {
//         let flag = Game.flags['Flag4'];

//         if (this.pos.isEqualTo(flag.pos)) {
//             this.memory.hitFlag = true;
//         }

//         if (this.memory.hitFlag == false) {
//             this.moveTo(flag);
//         }
//         else {
//             let controller = Game.getObjectById(Memory.thirdController);

//             let sign = controller.sign;

//             if (sign == null || sign.username != 'Mutantkeyboard') {
//                 let result = this.signController(controller,
//                     'This room is under the control of The Hidden Guild - https://discord.gg/WRDG6Sy');

//                 if (result == ERR_NOT_IN_RANGE) {
//                     this.moveTo(controller);
//                 }
//             }
//             else {
//                 if (controller.owner == null) {
//                     let result = this.claimController(controller);

//                     if (result == ERR_NOT_IN_RANGE) {
//                         this.moveTo(controller);
//                     }
//                 }
//                 else {
//                     let result = this.upgradeController(controller);

//                     if (result == ERR_NOT_IN_RANGE) {
//                         this.moveTo(controller);
//                     }

//                     if (result == ERR_NOT_ENOUGH_RESOURCES) {
//                         this.memory.status = 'stocking';

//                         this.memory.hitFlag = false;
//                     }
//                 }
//             }
//         }
//     }
// };

// Creep.prototype.findBestResources = function() {
//     if ((this.memory.role != 'collector' && this.room.storage != null) ||
//         (this.memory.role == 'collector' && this.room.energyAvailable != this.room.energyCapacityAvailable &&
//         this.room.storage != null && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0)) {
//             this.memory.target = 'storage';

//             this.memory.targetID = this.room.storage.id;
//     }
//     else {
//         let containers = this.room.find(FIND_STRUCTURES, {
//             filter: {structureType: STRUCTURE_CONTAINER }
//         });

//         if (containers.length > 0) {
//             this.memory.targetID = _.max( containers, function( container ) {
//                 return container.store.getUsedCapacity();
//             }).id;

//             this.memory.target = 'container';
//         }
//         else {
//             Memory.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);

//             this.memory.targetID = _.max( Memory.droppedResources, function( resources ){ return resources.amount; }).id;

//             this.memory.target = '';
//         }
//     }
// };

// Creep.prototype.collectResources = function() {
//     let target = Game.getObjectById(this.memory.targetID);

//     let result;

//     if (this.memory.target == 'container' || this.memory.target == 'storage') {
//         result = this.withdraw(target, RESOURCE_ENERGY);
//     }
//     else {
//         result = this.pickup(target);
//     }

//     if (result == ERR_NOT_IN_RANGE) {
//         this.moveTo(target);

//         return ERR_NOT_IN_RANGE
//     }

//     if (result == OK || result == ERR_FULL || ERR_INVALID_TARGET) {
//         this.memory.targetID = 'none';

//         return OK;
//     }
// };

// Creep.prototype.runTransfer = function() {
//     let position = new RoomPosition(22, 28, Memory.homeRoom);

//     if (!this.pos.isEqualTo(position)) {
//         this.moveTo(position);
//     }
//     else {
//         let link = Game.getObjectById(Memory.storageLink);

//         if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
//             this.transfer(this.room.storage, RESOURCE_ENERGY);
//         }
//         else {
//             if (link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
//                 this.withdraw(link, RESOURCE_ENERGY);
//             }
//         }
//     }
// };

// Creep.prototype.moveToTargetRoom = function(targetRoom) {
//     console.log('MoveToTargetRoom - DO NOT DELETE');

//     let route = Game.map.findRoute(this.room, targetRoom);
//         if(route.length > 0) {
//             let exit = this.pos.findClosestByRange(route[0].exit);
//             this.moveTo(exit);
//         }
//         //this.moveTo(new RoomPosition(25, 25, targetRoom, range: 23));
// };

// Creep.prototype.MoveToFlag = function(flagName) {
//     let flag = Game.flags[flagName];

//     this.moveTo(flag);

//     if (this.pos.isEqualTo(flag)) {
//         this.memory.hitFlag = true;
//     }
// };

// 

// Creep.prototype.CollectFromContainer = function() {
//     let containers = this.room.find(FIND_STRUCTURES, {
//         filter: {structureType: STRUCTURE_CONTAINER }
//     });

//     if (containers.length > 0) {
//         let container = _.max( containers, function( container ) {
//             return container.store.getUsedCapacity();
//         });
//     }
    
//     if(this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//         this.moveTo(container);
//     }

//     if (this.withdraw(container, RESOURCE_ENERGY) == ERR_FULL || this.withdraw(container, RESOURCE_ENERGY == OK)) {
//         this.memory.status = 'depositing';
//     }
// };

// Creep.prototype.CollectFromStorage = function() {
//     if (this.store.getFreeCapacity() > 0) {
//         let storage = this.room.storage;

//         if (this.withdraw(storage, RESOURCE_ENERGY == ERR_NOT_IN_RANGE)){
//             this.moveTo(storage);
//         }

//         if (this.withdraw(storage, RESOURCE_ENERGY == ERR_FULL)) {
//             this.memory.status = 'depositing';
//         }
//     }
//     else {
//         this.memory.status = 'depositing';
//     }
// };



// Creep.prototype.FindDroppedResources = function() {
//     return this.room.find(FIND_DROPPED_RESOURCES);
// };