// BUG
// HACK
// FIXME
// TODO
// XXX
// [ ]
// [x]

require('prototype.creep');
require('prototype.spawn');
require('prototype.tower');

Memory.requiredHarvesters = 6;
Memory.requiredAHarvesters = 1;
Memory.requiredBHarvesters = 1; 
Memory.requiredCHarvesters = 1; // E38N53
Memory.requiredDHarvesters = 1; // E38N53
Memory.requiredEHarvesters = 0; // Miner - E37N53
Memory.requiredFHarvesters = 1; // E37N54
Memory.requiredGHarvesters = 1; // E37N54
Memory.requiredUpgraders = 3;
Memory.requiredAUpgraders = 1;
Memory.requiredBUpgraders = 1; // E38N53
Memory.requiredCUpgraders = 1; // E37N54
Memory.requiredBuilders = 1;
Memory.requiredCouriers = 8;
Memory.requiredACouriers = 1;
Memory.requiredBCouriers = 1; // Source B Link Sorter.
Memory.requiredCCouriers = 1; // E38N53
Memory.requiredDCouriers = 1; // E38N53
Memory.requiredECouriers = 1; // Home link sorter.
Memory.requiredFCouriers = 1; // E38N53 to E37N53.
Memory.requiredHCouriers = 1; // E37N54 - Left.
Memory.requiredICouriers = 1; // E37N54 - Right.
Memory.requiredSorters = 2;
Memory.requiredRovers = 1;
Memory.requiredARovers = 1; // E37N54
Memory.nextRoom = 'E36N53';
Memory.requiredBRovers = 0; // E36N53
Memory.followingRoom = 'E36N53';
Memory.scoutsPerRoom = 0;
Memory.rangedSoldiersPerRoom = 0;
Memory.meleeSoldiersPerRoom = 0;
Memory.damageThreshold = 2000;
Memory.mainRoom = 'E37N53';
Memory.depositLinkAId = '62a884e74534e8471716d322';
Memory.storeLinkId = '62a8425c9d9375fa022b741a';

/**
 * ID of the harvesting Link in E37N53.
 */
const harvesterBLink = '62b498f68317ed423f1fc191';

module.exports.loop = function () {
console.log('********** Start tick ' + Game.time + ' **********');

    var extensionsCount = Game.spawns.Spawn1.countExtensions();
    let sortersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'sorter').length;
    if (sortersCount < Memory.requiredSorters) {
        Game.spawns.Spawn1.spawnNewSorter();
    }
    else {
        let couriersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'courier').length;
        if (couriersCount < Memory.requiredCouriers) {
            Game.spawns.Spawn1.spawnNewCourier(extensionsCount);
        }
        else {
            let harvestersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
            if (harvestersCount < Memory.requiredHarvesters) {
                Game.spawns.Spawn1.spawnNewHarvester(extensionsCount);
            }
            if (Game.spawns.Spawn1.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {   
                let upgradersCount = _.filter (Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
                if(upgradersCount < Memory.requiredUpgraders) {
                    Game.spawns.Spawn1.spawnNewUpgrader(extensionsCount);
                }
                let buildersCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
                let constructionSites = _.filter(Game.constructionSites);
                console.log('Construction Sites: ' + constructionSites.length);
                if (constructionSites.length > 0 && buildersCount < Memory.requiredBuilders) {
                    Game.spawns.Spawn1.spawnNewBuilder(extensionsCount);
                }
                let roversCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'rover').length;
                if (roversCount < Memory.requiredRovers) {
                    Game.spawns.Spawn1.spawnNewRover();
                }
                let meleeCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeSoldier').length;
                if (meleeCount < Memory.meleeSoldiersPerRoom) {
                    Game.spawns.Spawn1.spawnNewMeleeSoldier();
                }
            }
            else {
                Game.notify('Energy storage in Main Room has dropped below 10,000');
            }
        }
    }

    let myRooms = _.filter(Game.rooms);
    let myTowers = [];
    Memory.structuresToRepair = [];
    myRooms.forEach(room => CheckRepairs(room))
    if (Memory.structuresToRepair.length > 100) {
        console.log('Reducing Threshold');
        Memory.damageThreshold = Memory.damageThreshold - 100;
    }
    if (Memory.structuresToRepair.length == 0) {
        console.log('Increasing Threshold');
        if (Memory.damageThreshold < 300000000) {
            Memory.damageThreshold = Memory.damageThreshold + 1000;
        }
    }

    myRooms.forEach(room => FindMyTowers(room));
    myTowers.forEach(tower => tower.defendRoom())

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            creep.runHarvester();
        }
        if (creep.memory.role == 'upgrader') {
            creep.runUpgrader();
        }
        if (creep.memory.role == 'builder') {
            creep.runBuilder();
        }
        if (creep.memory.role == 'scout') {
            creep.runScout();
        }
        if (creep.memory.role == 'rangedSoldier') {
            creep.runRanged();
        }
        if (creep.memory.role == 'meleeSoldier') {
            creep.runMelee();
        }
        if (creep.memory.role == 'courier') {
            creep.runCourier();
        }
        if (creep.memory.role == 'sorter') {
            creep.workSorter();
        }
        if (creep.memory.role == 'rover') {
            creep.workRover();
        }
        if (creep.name == 'Voyager1') {
            if (creep.room.name != creep.memory.room) {
                let route = Game.map.findRoute(creep.room, creep.memory.room);
                if(route.length > 0) {
                    console.log('Now heading to room '+route[0].room);
                    let exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            }
            else {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                else {
                    creep.signController(creep.room.controller,
                        'This room is under the control of The Hidden Guild - https://discord.gg/WRDG6Sy');
                }
            }
        }
    }

    let depositLink = Game.getObjectById(Memory.depositLinkAId);
    /**
     * @type {StructureLink}
     */
    let storeLink = Game.getObjectById(Memory.storeLinkId);
    if (depositLink.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        depositLink.transferEnergy(storeLink);
    }

    /**
     * @type {StructureLink}
     */
    let harvestingLink = Game.getObjectById(harvesterBLink);
    if (harvestingLink.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        harvestingLink.transferEnergy(storeLink);
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    let amountToBuy = 50;
    let maxTransferEnergyCost = 50;
    let orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_HYDROGEN});

    for(let i=0; i<orders.length; i++) {
        const transferEnergyCost = Game.market.calcTransactionCost(
            amountToBuy, 'E37N53', orders[i].roomName);
        if(orders[i].price > 9) {
            Game.market.deal(orders[i].id, amountToBuy, 'E37N53');
            break;
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    /**
     * Finds the Towers in the given Room name.
     * @param {string} room 
     */
    function FindMyTowers(room) {
        let roomTowers = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });
        roomTowers.forEach(tower => myTowers.push(tower));
    }

    function CheckRepairs(room) {
        let targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax &&
                    structure.hits < Memory.damageThreshold);
            }
        });
        targets.forEach(target => Memory.structuresToRepair.push(target));
        console.log('Repairing: ' + Memory.structuresToRepair.length);
    }

    console.log('********** End tick **********');
}