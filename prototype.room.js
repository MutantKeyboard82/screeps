Room.prototype.findTowers = function() {
    let towers = this.find(FIND_MY_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_TOWER
        }
    });
    
    towers.forEach(tower => Memory.towers.push(tower));
};