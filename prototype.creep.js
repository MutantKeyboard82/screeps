const harvesterASource = '5bbcaf199099fc012e63a294';
const harvesterBSource = '5bbcaf199099fc012e63a292';
const harvesterCSource = '5bbcaf299099fc012e63a41a';
const harvesterDSource = '5bbcaf299099fc012e63a41b';
const harvesterESource = '5bbcb63dd867df5e5420765b';
/** Harvester F Source */
const harvesterFSource = '5bbcaf189099fc012e63a290'; // E37N54 - 18,33
const harvesterGSource = '5bbcaf189099fc012e63a28f'; // E37N54 - 46,25
const harvesterAContainer = '62b9a43366467dccb3ee8722';
const harvesterBContainer = '62b9d1f258235bc41955ba38';
const harvesterBLink = '62b498f68317ed423f1fc191';
const harvesterCContainer = '62ba3293374762de0aa64793';
const harvesterDContainer = '62ba3768aeb2d8ba67191910';
const harvesterEContainer = '62b04a632248f16ecf28f27a';
const harvesterFContainer = '62baf2a31937aa3eebef70f4';
const harvesterGContainer = '62bafccf95b762328ba8a67e';
const E38N53UpgraderContainer = '62a76f28184dec14e94c02c8';
const E38N53TowerA = '62a2f9fb2a437898bb812c69';
const storageLink = '6290a209ed2320547841a024';
const terminalId = '62b09387374762559ea35256';

// ********** Common **********

Creep.prototype.renew = function() {
    if (this.ticksToLive < 1500) {
        if (Game.spawns['Spawn1'].renewCreep(this) == ERR_NOT_IN_RANGE) {
            this.moveTo(Game.spawns['Spawn1']);
        }
        if (Game.spawns['Spawn1'].renewCreep(this) == ERR_BUSY ||
            Game.spawns['Spawn1'].renewCreep(this) == ERR_NOT_ENOUGH_ENERGY ||
            Game.spawns['Spawn1'].renewCreep(this) == ERR_FULL) {
                this.memory.status = 'working';
        }        
    }
    else {
        this.memory.status = 'working';
    }
};

Creep.prototype.refill = function() {
    if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_INVALID_TARGET) {
        let droppedResources = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (resources) =>
                resources.amount > this.store.getFreeCapacity(RESOURCE_ENERGY)
        });
        if (droppedResources != null) {
            if (this.pickup(droppedResources) == ERR_NOT_IN_RANGE) {
                this.moveTo(droppedResources);
            }
        }
        else {
            let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) =>
                    structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity(RESOURCE_ENERGY)
            });
            if (container != null) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
            else {
                this.moveToHomeRoom();
            }
        }
    }
    else {
        if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.storage);
        }
    }
    if (this.store.getFreeCapacity() == 0) {
        this.memory.status = 'working';
    }
};

Creep.prototype.recycle = function() {
    if (this.room.name == Memory.mainRoom) { 
        if (this.pos.isNearTo(Game.spawns.Spawn1)) {
            Game.spawns.Spawn1.recycleCreep(this);
        }
        else {
            this.moveTo(Game.spawns.Spawn1);
        }
    }
    else {
        this.moveToHomeRoom();
    }
};

Creep.prototype.moveToTargetRoom = function() {
    let route = Game.map.findRoute(this.room, this.memory.room);
        if(route.length > 0) {
            let exit = this.pos.findClosestByRange(route[0].exit);
            this.moveTo(exit);
        }
};

Creep.prototype.moveToHomeRoom = function() {
    let route = Game.map.findRoute(this.room, 'E37N53');
        if(route.length > 0) {
            let exit = this.pos.findClosestByRange(route[0].exit);
            this.moveTo(exit);
        }
};

// ********** Harvesters **********

Creep.prototype.runHarvester = function() {
    if (this.memory.status == 'working') {
        this.workHarvester();
    }
    else if (this.memory.status == 'depositing') {
        this.depositHarvester();
    }
    else if (this.memory.status == 'renewing') {
        this.renew();
    }
    else if (this.memory.status == 'recycle') {
        this.recycle();
    }
};

Creep.prototype.workHarvester = function() {
     /**
             * @type {Source}
             */
    let source;
    let container;
    if (this.room.name != this.memory.room) {
        this.moveToTargetRoom();
    }
    else {
        if (this.memory.group == 'A') {
            source = Game.getObjectById(harvesterASource);
            container = Game.getObjectById(harvesterAContainer);
        }
        else if (this.memory.group == 'B') {
            source = Game.getObjectById(harvesterBSource);
            container = Game.getObjectById(harvesterBContainer);
        }
        else if (this.memory.group == 'C') {
            source = Game.getObjectById(harvesterCSource);
            container = Game.getObjectById(harvesterCContainer);
        }
        else if (this.memory.group == 'D') {
            source = Game.getObjectById(harvesterDSource);
            container = Game.getObjectById(harvesterDContainer);
        }
        else if (this.memory.group == 'E') {
            source = Game.getObjectById(harvesterESource);
        }
        else if (this.memory.group == 'F') {
            source = Game.getObjectById(harvesterFSource);
            container = Game.getObjectById(harvesterFContainer);
        }
        else if (this.memory.group == 'G') {
            source = Game.getObjectById(harvesterGSource);
            container = Game.getObjectById(harvesterGContainer);
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
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    }
};

Creep.prototype.depositHarvester = function() {
    if (this.memory.group == 'C') {
        if (this.room.name != 'W5S13') {
            this.moveTo(Game.spawns.Spawn1);
        }
    }
    else {
        let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
        });
        if(target != null) {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target)
            };
        }
        else {
            let target = this.pos.findClosestByPath(FIND_STRUCTURES , {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_EXTENSION &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target != null) {
                if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target)
                };
            }
            else {
                let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (target != null) {
                    if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target)
                    };
                }
                else {
                    let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_STORAGE &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });
                    if(target != null) {
                        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.moveTo(target)
                        };
                    }
                }
            }
        }
    }
    if (this.store.getUsedCapacity() == 0) {
        this.memory.status = 'working';
    }
};

// ********** Upgraders **********

Creep.prototype.runUpgrader = function(link) {
    if (this.memory.status == 'working') {
        this.workUpgrader();
    }
    if (this.memory.status == 'renewing') {
        this.renew();
    }
    if (this.memory.status == 'refilling') {
        this.refill();
    }
    if (this.memory.status == 'recycle') {
        this.recycle();
    }
};

Creep.prototype.workUpgrader = function() {
    if (this.store.getUsedCapacity() == 0) {
        this.memory.status = 'refilling';
    }
    else {
        if (this.room.name != this.memory.room) {
            this.moveToTargetRoom();
        }
        else {
            if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
                this.moveTo(this.room.controller);
            }
        }
    }
};

Creep.prototype.refillUpgrader = function(link) {
    let droppedResources = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (droppedResources != null) {
        if (this.pickup(droppedResources) == ERR_NOT_IN_RANGE) {
            this.moveTo(droppedResources);
        }
    }
    else {
        if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_INVALID_TARGET &&
            this.room.name != Memory.mainRoom) {
                this.moveToHomeRoom();
        }
        else {
            if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(this.room.storage);
            }
        }
    }
    if (this.store.getFreeCapacity() == 0) {
       this.memory.status = 'working';  
    }
};

// ********** Builders **********

Creep.prototype.runBuilder = function() {
    if (this.memory.status == 'working') {
        this.workBuilder();
    }
    if (this.memory.status == 'renewing') {
        this.renew();
    }
    if (this.memory.status == 'refilling') {
        this.refill();
    }
    if (this.memory.status == 'recycle') {
        this.recycle();
    }
};

Creep.prototype.workBuilder = function() {
    if (this.store[RESOURCE_ENERGY] > 0) {
        let target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target != null) {
            if(this.build(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
        else {
            let constructionSites = _.filter(Game.constructionSites);
            if (constructionSites.length > 0) {
                let constructionTarget = Game.getObjectById(constructionSites[0].id);
                this.moveTo(constructionTarget);
            }
            else {
                Game.notify("All buildings have been constructed. Builders will now recycle.", 1);
                this.memory.status = 'recycle';
            }
        }
    }
    else {
        this.memory.status = 'refilling';
    }
};

// ********** Army **********
// ********** Scout **********

Creep.prototype.runScout = function() {
    if (this.memory.status == 'working') {
        if (this.room.name != this.memory.targetRoom) {
            this.moveTo(new RoomPosition(23, 48, this.memory.targetRoom));
        }
        else {
            this.moveTo(Game.flags[this.memory.targetRoom+'Staging']);
        }
    }
};

Creep.prototype.runRanged = function() {
    if (this.ticksToLive > 500) {
        if (this.room.name != this.memory.targetRoom) {
            this.moveTo(new RoomPosition(23, 48, this.memory.targetRoom));
        }
        else {
            this.moveTo(Game.flags[this.memory.targetRoom+'Staging']);
        }
        var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${this.room.name}`);
            this.moveTo(hostiles[0]);
            this.rangedAttack(hostiles[0]);
        }
    }
};

Creep.prototype.runMelee = function() {
    if (this.memory.status == 'working') {
        if (this.room.name != this.memory.room) {
            this.moveToTargetRoom();
        }
        else {
            this.moveTo(this.room.controller);
        }
        let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            let username = hostiles[0].owner.username;
            //Game.notify(`User ${username} spotted in room ${creep.room.name}`);
            this.moveTo(hostiles[0]);
            this.attack(hostiles[0]);
        }
    }
};

// ********** Couriers **********

Creep.prototype.runCourier = function() {
    if (this.memory.status == 'working') {
        this.workCourier();
    }
    if (this.memory.status == 'renewing') {
        this.renew();
    }
    if (this.memory.status == 'refilling') {
        this.refill();
    }
    if (this.memory.status == 'depositing') {
        this.depositCourier();
    }
    if (this.memory.status == 'recycle') {
        this.recycle();
    }
};

Creep.prototype.workCourier = function() {
    let container;
    
    if (this.memory.group == 'A') {
        if (this.memory.group == 'A') {
            container = Game.getObjectById(harvesterAContainer);
        }
        if (this.memory.group == 'B') {
            container = Game.getObjectById(harvesterBContainer);
        }
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (container != null) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
            else {
                let resources = this.room.find(FIND_DROPPED_RESOURCES);
                resources.forEach(resource => {
                    if (resource.amount > this.store.getFreeCapacity(RESOURCE_ENERGY)) {
                        if (this.pickup(resource) == ERR_NOT_IN_RANGE) {
                            this.moveTo(resource);
                        }
                    }
                })
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
    else if (this.memory.group == 'B') {
        container = Game.getObjectById(harvesterBContainer);
        let link = Game.getObjectById(harvesterBLink);
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (container != null) {
                if (this.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
            else {
                let target = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (this.pickup(target) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        }
        else {
            if (this.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(link);
            }
        }
    }
    else if (this.memory.group == 'C') {
        if (this.room.name != this.memory.room) {
            this.moveToTargetRoom();
        }
        else {
            let container = Game.getObjectById(harvesterCContainer);
            if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (container != null) {
                    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(container);
                    }
                }
                else {
                    let target = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (this.pickup(target) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }
                }
            }
            else {
                this.memory.status = 'depositing';
            }
        }
    }
    else if (this.memory.group == 'D') {
        if (this.room.name != this.memory.room) {
            this.moveToTargetRoom();
        }
        else {
            let container = Game.getObjectById(harvesterDContainer);
            if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                if (container != null) {
                    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(container);
                    }
                }
                else {
                    let target = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    if (this.pickup(target) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }
                }
            }
            else {
                this.memory.status = 'depositing';
            }
        }
    }
    else if (this.memory.group == 'E') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            let link = Game.getObjectById(Memory.storeLinkId);
            if (this.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(link);
            }
        }
        else {
            if (this.transfer(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(this.room.storage);
            }
        }
    }
    else if (this.memory.group == 'F') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.name != this.memory.room) {
                this.moveToTargetRoom();
            }
            else {
                if (this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {
                    if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(this.room.storage);
                    }
                }
            }
        }
        else {
            target = Game.getObjectById(Memory.depositLinkAId);
            if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
    }
    else if (this.memory.group == 'G') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.name != this.memory.room) {
                this.moveToTargetRoom();
            }
            else {
                let target = Game.getObjectById(harvesterFContainer);
                if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
    else if (this.memory.group == 'H') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.name != this.memory.room) {
                this.moveToTargetRoom();
            }
            else {
                let target = Game.getObjectById(harvesterFContainer);
                if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
    else if (this.memory.group == 'I') {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (this.room.name != this.memory.room) {
                this.moveToTargetRoom();
            }
            else {
                let target = Game.getObjectById(harvesterGContainer);
                if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
};

Creep.prototype.depositCourier = function() {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        if (this.memory.room != Memory.mainRoom) {
            let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target != null) {
                if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
            else {
                if (this.transfer(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(this.room.storage);
                }
            }
        }
        else {
            if (this.transfer(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(this.room.storage);
            }
        }
    }
    else {
        this.memory.status = 'working';
    }

    /**let target;
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        target = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
        });
        if (target != null) {
            if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
        else {
            target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            });
            if (target != null) {
                if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
            else {
                target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(target != null) {
                    if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target)
                    };
                }
                /**else {
                    target = Game.getObjectById(terminalId);
                    if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    }
                }
                else {
                    target = this.room.storage;
                    if (target != null) {
                        if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            this.moveTo(target);
                        }
                    }
                }
            }
        }
    }
    else {
        this.memory.status = 'working';
    }**/
};

Creep.prototype.workSorter = function() {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        if (this.withdraw(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.storage);
        }
    }
    else {
        let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (target != null) {
            if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
        else {
            let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_SPAWN &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target != null) {
                if (this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
            else {
                let target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                });
                if(target != null) {
                    if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    };
                }
                else {
                    if (this.transfer(this.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(this.room.storage);
                    }
                }
            }
        }
    }
};

Creep.prototype.workRover = function() {
    if (this.room.name != this.memory.room) {
        this.moveToTargetRoom()
    }
    else {
        if (this.reserveController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller);
        }
        else {
            this.signController(this.room.controller,
                'This room is under the control of The Hidden Guild - https://discord.gg/WRDG6Sy');
        }
    }
};