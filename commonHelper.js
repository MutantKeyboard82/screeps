export default class CommonHelper {
    /**
     * Creates a new Common Helper.
     * @class
     * @property {number} RequiredHarvesters Number of required Harvesters.
     * @property {number} RequiredAHarvesters Number of required Harvesters in Group A.
     * @property {number} RequiredBHarvesters Number of required Harvesters in Group B. 
     */
    constructor() {
        this.RequiredHarvesters = 10;
        this.RequiredAHarvesters = 3;
        this.RequiredBHarvesters = 2;
    }

    /**
     * Spawns a new Creep with the given properties from the given Spawn.
     * @param {string} spawnName The name of the Spawn to spawn from. 
     * @param {number} extensions The number of extensions currently available.
     * @param {number} work Number of Work parts the Creep should have. 
     * @param {number} carry Number of Carry parts the Creep should have. 
     * @param {number} move Number of Move parts the Creep should have.
     * @param {string} role The role of the new Creep. 
     */
    SpawnCreep(spawnName, extensions, work, carry, move, role) {
        var harvesterHelper = new HarvesterHelper();
        if (harvesterHelper.Count() < this.RequiredHarvesters) {
            var newName = role + Game.time;
            console.log('Spawning: ' + newName);
            var resourceHelper = new ResourceHelper();
            if (resourceHelper.IsEnergyFull(spawnName)) {
                /**
                 * @type {array}
                 */
                var parts;
                for (var i = 1; i <= work; i++ ) {
                    parts.push(WORK);
                }
                for (var i = 1; i <= carry; i++) {
                    parts.push(CARRY);
                }
                for (var i = 1; i <= move; i++) {
                    parts.push(MOVE);
                }
                Game.spawns[spawnName].spawnCreep(
                    parts,
                    newName,
                    { memory: 
                        { 
                            role: 'harvester'
                        }
                    }
            )};
        }
    }
}