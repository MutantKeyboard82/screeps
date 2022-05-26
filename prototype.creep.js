const harvesterASource = '5bbcac9b9099fc012e635d57';
const harvesterBSource = '5bbcac9b9099fc012e635d56';
const harvesterCSource = '5bbcac9b9099fc012e635d53';
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
    var container = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity()
        }
    });
    if (container != null) {
        this.moveTo(container);
        this.withdraw(container, RESOURCE_ENERGY);
    }
    else {
        this.moveTo(Game.spawns.Spawn1);
    }
    if (this.store.getFreeCapacity() == 0) {
        this.memory.status = 'renewing';
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
};

Creep.prototype.workHarvester = function() {
    if (this.memory.group == 'C') {
        var source = Game.getObjectById(harvesterCSource);
        if (this.store.getFreeCapacity() > 0) {
            if (this.room.name != 'W5S12') {
                this.moveTo(source);
            }
            else {
                if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.moveTo(source);
                }
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
    else {
        if (this.store.getFreeCapacity() > 0) {
            var source;
            if (this.memory.group == 'A') {
                source = Game.getObjectById(harvesterASource);
            }
            if (this.memory.group == 'B') {
                source = Game.getObjectById(harvesterBSource);
            }
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
        else {
            this.memory.status = 'depositing';
        }
    }
};

Creep.prototype.depositHarvester = function() {
    if (this.memory.group == 'C') {
        if (this.room.name != 'W5S13') {
            this.moveTo(Game.spawns.Spawn1);
        }
    }
    if (this.memory.group != 'B') {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(target != null) {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target)
            };
        }
        else {
            var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_SPAWN &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(target != null) {
                if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target)};
            }
            else {
                var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (target != null) {
                    if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target)};
                }
            }
        }
    }
    else {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
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
            var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
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
    if (this.store.getUsedCapacity() == 0) {
        this.memory.status = 'renewing';
    }
};

// ********** Upgraders **********

Creep.prototype.runUpgrader = function() {
    if (this.memory.status == 'working') {
        this.workUpgrader();
    }
    if (this.memory.status == 'renewing') {
        this.renew();
    }
    if (this.memory.status == 'refilling') {
        this.refill();
    }
};

Creep.prototype.workUpgrader = function() {
    if (this.store[RESOURCE_ENERGY] > 0) {
        if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller);
        }
    }
    else {
        this.memory.status = 'refilling';
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
};

Creep.prototype.workBuilder = function() {
    if (this.store[RESOURCE_ENERGY] > 0) {
        var target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target != null) {
            if(this.build(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
        else {
            if (Memory.constructionSites.length > 0) {
                this.moveTo(Memory.constructionSites[0]);
            }
            else {
                this.suicide();
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
        if (this.ticksToLive > 500) {
            if (this.room.name != this.memory.targetRoom) {
                this.moveTo(new RoomPosition(23, 48, this.memory.targetRoom));
            }
            else {
                this.moveTo(Game.flags[this.memory.targetRoom+'Staging']);
            }
        }
        else {
            this.memory.status = 'renewing';
        }
    }
    else {
        this.renew();
    }
};

Creep.prototype.runRanged = function() {
    if (this.memory.status == 'working') {
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
        else {
            this.memory.status = 'renewing';
        }
    }
    else {
        this.renew();
    }
};

Creep.prototype.runMelee = function() {
    if (this.memory.status == 'working') {
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
                Game.notify(`User ${username} spotted in room ${creep.room.name}`);
                this.moveTo(hostiles[0]);
                this.attack(hostiles[0]);
            }
        }
        else {
            this.memory.status = 'renewing';
        }
    }
    else {
        this.renew();
    }
};