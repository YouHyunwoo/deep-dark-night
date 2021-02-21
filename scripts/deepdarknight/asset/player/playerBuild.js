import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { items } from '../data/items.js';
import { Tile } from '../map/tile.js';



export class PlayerBuild extends Component {
    constructor() {
        super();

        this.isBuildMode = false;
    }

    onInitialize() {
        this.map = this.gameObject.parent.parent;

        this.camera = this.gameObject.scene.camera;
        
        this.engine = this.gameObject.scene.game.engine;

        this.tile = this.map.findGameObject('tile').findComponent(Tile);
        
        this.inventory = this.gameObject.scene.findGameObject('uiSystem').findGameObject('inventoryWindow');
        this.inventory.events.addListener('clickItemSlot', this.onClickInventoryItem.bind(this));
    }

    onUpdate(timeDelta) {
        if (this.isBuildMode) {
            for (const event of this.engine.events) {
                if (event.type === 'mousedown') {
                    const positionMouse = event.position;
                    const positionInWorld = this.camera.screenToWorld(positionMouse);
                    const positionIndex = positionInWorld.divide(50).floor();

                    const row = positionIndex.y;
                    const column = positionIndex.x;

                    const gameObject = new this.item.class(this.item.name);
                    gameObject.area.x = column * 50 + 25;
                    gameObject.area.y = row * 50 + 25;

                    this.map.findGameObject('ground').addGameObjects(gameObject);

                    this.tile.pointTiles(null);

                    this.isBuildMode = false;
                    
                    this.events.notify('mousedown', row, column);
                }
                else if (event.type === 'mousemove') {
                    const positionMouse = event.position;
                    const positionInWorld = this.camera.screenToWorld(positionMouse);
                    const positionIndex = positionInWorld.divide(50).floor();

                    const row = positionIndex.y;
                    const column = positionIndex.x;

                    this.tile.pointTiles(new Area(column, row, 1, 1));

                    this.events.notify('mousemove', row, column);
                }
            }
        }
    }

    onClickInventoryItem(event, inventory) {
        const slot = event.target;
        const item = items[slot.itemName];
        
        if (item && item.type === '설치') {
            this.isBuildMode = true;
            this.item = item;
        }
    }
}