import { GameObject } from '../../../engine/game/object.js';
import { MapRenderer } from './mapRenderer.js';
import { ObjectGenerator } from './objectGenerator.js';
import { ObjectPointer } from './ObjectPointer.js';
import { ObjectSort } from './objectSort.js';



export class Map extends GameObject {
    constructor(name) {
        super(name);
        
        const componentObjectGenerator = new ObjectGenerator('ObjectGenerator');

        this.addComponents(componentObjectGenerator);

        const componentObjectPointer = new ObjectPointer('ObjectPointer');

        this.addComponents(componentObjectPointer);

        const componentObjectSort = new ObjectSort('ObjectSort');

        this.addComponents(componentObjectSort);

        const componentMapRenderer = new MapRenderer('MapRenderer');

        this.addComponents(componentMapRenderer);


        const layerGround = new GameObject('ground');

        this.addGameObjects(layerGround);

        const layerSky = new GameObject('sky');

        this.addGameObjects(layerSky);
    }
}