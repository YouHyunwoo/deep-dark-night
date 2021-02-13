import { Component } from './component.js';
import { Area } from '../math/geometry/area.js';



export class BoxCollider extends Component {
	constructor(name) {
		super(name);

		this.area = new Area(0, 0, 1, 1);
	}
}