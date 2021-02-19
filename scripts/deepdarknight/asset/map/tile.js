import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';



export class Tile extends Component {
    constructor() {
        super();

        this.sizeTile = Vector2.full(50);

        this.tiles = null;

        this.pointed = null;
        this.pointedArea = null;
    }

    onInitialize() {
        const object = this.gameObject;

        this.object = object;

        const world = object.owner;
        const scene = world.scene;
        const game = scene.game;

        this.game = game;

        const map = object.owner;

        const sizeArea = map.area.getSize();

        const tileCount = sizeArea.divideEach(this.sizeTile);

        const rowCount = Math.floor(tileCount.y);
        const columnCount = Math.floor(tileCount.x);

        this.tiles = [];

        for (let row = 0; row < rowCount; row++) {
            const rowTiles = [];

            for (let col = 0; col < columnCount; col++) {
                const types = ['dirt', 'grass'];
                const backgroundColors = ['saddlebrown', 'green'];

                const index = Math.floor(Math.random() * types.length);

                const tile = {
                    type: types[index],
                    backgroundColor: backgroundColors[index],
                };

                rowTiles.push(tile);
            }

            this.tiles.push(rowTiles);
        }
    }

    onUpdate(timeDelta) {
        const mousePosition = this.game.engine.mouse;

        this.pointed = this.findTileByMousePosition(mousePosition);
    }

    onDraw(context) {
        const types = ['dirt', 'grass'];
        const backgroundColors = ['saddlebrown', 'green'];

        context.save();

        let positionPointed = null;

        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                const tile = this.tiles[row][col];

                const index = types.indexOf(tile.type);

                context.fillStyle = backgroundColors[index];

                const positionTile = this.sizeTile.multiplyEach(new Vector2(col, row));

                context.fillRect(...positionTile.toList(), ...this.sizeTile.toList());

                if (this.pointed === tile) {
                    positionPointed = positionTile;
                }
            }
        }

        if (positionPointed) {
            context.strokeStyle = 'orange';
            context.strokeRect(...positionPointed.toList(), ...this.sizeTile.toList());
        }

        if (this.pointedArea) {
            const position = this.pointedArea.getPosition();
            const size = this.pointedArea.getSize();

            context.fillStyle = 'rgba(60, 179, 113, 0.5)';
            context.fillRect(...position.multiplyEach(this.sizeTile).toList(), ...size.multiplyEach(this.sizeTile).toList());

            context.strokeStyle = 'rgba(60, 179, 113)';
            context.fillRect(...position.multiplyEach(this.sizeTile).toList(), ...size.multiplyEach(this.sizeTile).toList());
        }

        context.restore();
    }

    findTileByMousePosition(mousePosition) {
        const camera = this.gameObject.scene.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                const tile = this.tiles[row][col];

                const sizeTile = this.sizeTile;
                const positionTile = sizeTile.multiplyEach(new Vector2(col, row));

                const areaPositionInWorld = this.object.localToGlobal(positionTile);

                const areaInWorld = Area.combine(areaPositionInWorld, sizeTile);
                
                if (areaInWorld.containsVector(mouseInWorld)) {
                    return tile;
                }
            }
        }
    }

    pointTiles(areaTile) {
        this.pointedArea = areaTile;
    }
}