import { Component } from '../../../engine/game/component.js';
import { Area } from '../../../engine/math/geometry/area.js';
import { Vector2 } from '../../../engine/math/geometry/vector.js';



export class Tile extends Component {
    constructor() {
        super();

        this.tileInfo = {
            types: ['dirt', 'grass'],
            backgroundColors: ['saddlebrown', 'green'],
        };

        this.sizeTile = Vector2.full(50);

        this.tiles = null;

        this.pointed = null;
        // this.pointedArea = null;
    }

    onInitialize() {
        this.scene = this.gameObject.scene;
        this.engine = this.gameObject.scene.game.engine;

        const map = this.gameObject.parent;

        const sizeArea = map.area.getSize();
        const tileCount = sizeArea.divideEach(this.sizeTile);

        const rowCount = Math.floor(tileCount.y);
        const columnCount = Math.floor(tileCount.x);

        this.tiles = [];

        for (let row = 0; row < rowCount; row++) {
            const rowTiles = [];

            for (let col = 0; col < columnCount; col++) {
                const index = Math.floor(Math.random() * this.tileInfo.types.length);

                const tile = {
                    type: this.tileInfo.types[index],
                    backgroundColor: this.tileInfo.backgroundColors[index],
                };

                rowTiles.push(tile);
            }

            this.tiles.push(rowTiles);
        }
    }

    // onUpdate(timeDelta) {
        // const mousePosition = this.engine.mouse;

        // this.pointed = this.findTileByMousePosition(mousePosition);
    // }

    onDraw(context) {
        context.save();

        // let positionPointed = null;

        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                const tile = this.tiles[row][col];

                const index = this.tileInfo.types.indexOf(tile.type);

                context.fillStyle = this.tileInfo.backgroundColors[index];

                const positionTile = this.sizeTile.multiplyEach(new Vector2(col, row));

                context.fillRect(...positionTile.toList(), ...this.sizeTile.toList());

                // if (this.pointed === tile) {
                //     positionPointed = positionTile;
                // }
            }
        }

        // if (positionPointed) {
        //     context.strokeStyle = 'orange';
        //     context.strokeRect(...positionPointed.toList(), ...this.sizeTile.toList());
        // }

        if (this.pointed) {
            const position = this.pointed.getPosition();
            const size = this.pointed.getSize();

            context.fillStyle = 'rgba(60, 179, 113, 0.5)';
            context.fillRect(...position.multiplyEach(this.sizeTile).toList(), ...size.multiplyEach(this.sizeTile).toList());

            context.strokeStyle = 'rgba(60, 179, 113)';
            context.fillRect(...position.multiplyEach(this.sizeTile).toList(), ...size.multiplyEach(this.sizeTile).toList());
        }

        context.restore();
    }

    findTileByMousePosition(mousePosition) {
        const camera = this.scene.camera;
        const mouseInWorld = camera.screenToWorld(mousePosition);

        const rowCount = this.tiles.length;

        for (let row = 0; row < rowCount; row++) {
            const columnCount = this.tiles[row].length;

            for (let col = 0; col < columnCount; col++) {
                const tile = this.tiles[row][col];

                const sizeTile = this.sizeTile;
                const positionTile = sizeTile.multiplyEach(new Vector2(col, row));

                const areaPositionInWorld = this.gameObject.localToGlobal(positionTile);

                const areaInWorld = Area.combine(areaPositionInWorld, sizeTile);
                
                if (areaInWorld.containsVector(mouseInWorld)) {
                    return tile;
                }
            }
        }

        return null;
    }

    pointTiles(areaTile) {
        this.pointed = areaTile;
    }
}