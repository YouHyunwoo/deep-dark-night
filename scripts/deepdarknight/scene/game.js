import { GameObject } from '../../engine/game/object.js';
import { Area } from '../../engine/math/geometry/area.js';



export const sceneData = {
	objects: [
		{
			name: 'world',
			objects: [
				{
					name: 'map',
					objects: [
						{
							name: 'ground',
							objects: [
								{
									name: 'player',
									components: [
										{
											module: '/scripts/deepdarknight/asset/player/playerInput.js',
											type: 'PlayerInput',
										},
										{
											module: '/scripts/engine/graphic/components/spriteRenderer.js',
											type: 'SpriteRenderer',
										},
										{
											module: '/scripts/engine/graphic/components/animator.js',
											type: 'Animator',
										},
										{
											module: '/scripts/deepdarknight/asset/character/direction.js',
											type: 'Direction',
										},
										{
											module: '/scripts/deepdarknight/asset/character/movement.js',
											type: 'Movement',
										},
										{
											module: '/scripts/deepdarknight/asset/character/gathering.js',
											type: 'Gathering',
										},
										{
											module: '/scripts/deepdarknight/asset/character/inventory.js',
											type: 'Inventory',
										},
										{
											module: '/scripts/deepdarknight/asset/character/statistics.js',
											type: 'Statistics',
											hp: 10,
											maxhp: 10,
											strength: 3,
											movementSpeed: 200,
											gatheringRange: 20,
											gatheringSpeed: 1,
										},
										{
											module: '/scripts/deepdarknight/asset/character/equipment.js',
											type: 'Equipment',
										},
										{
											module: '/scripts/deepdarknight/asset/character/equipmentController.js',
											type: 'EquipmentController'
										}
									],
									objects: [
										{
											name: 'state',
											components: [
												{
													module: '/scripts/engine/util/components/state.js',
													type: 'StateContext',
												},
												{
													module: '/scripts/deepdarknight/asset/player/state/idle.js',
													type: 'IdleState',
												},
												{
													module: '/scripts/deepdarknight/asset/player/state/move.js',
													type: 'MoveState',
												},
												{
													module: '/scripts/deepdarknight/asset/player/state/gather.js',
													type: 'GatherState',
												}
											]
										}
									],
									tags: ['@ground'],
									area: new Area(100, 100, 20, 16),
								},
							]
						},
						{
							name: 'sky'
						}
					],
					components: [
						{
							module: '/scripts/deepdarknight/asset/map/objectGenerator.js',
							type: 'ObjectGenerator',
						},
						{
							module: '/scripts/deepdarknight/asset/map/objectSort.js',
							type: 'ObjectSort',
						},
						{
							module: '/scripts/deepdarknight/asset/map/objectPointer.js',
							type: 'ObjectPointer',
						},
						{
							module: '/scripts/deepdarknight/asset/map/mapRenderer.js',
							type: 'MapRenderer',
							backgroundColor: 'saddlebrown',
						},
					],
					tags: [],
					area: new Area(0, 0, 800, 800),
				},
			],
			components: [],
			tags: [],
		},
		{
			name: 'timeSystem',
			components: [
				{
					module: '/scripts/deepdarknight/asset/system/timeSystem.js',
					type: 'TimeSystem'
				}
			]
		},
		{
			module: '/scripts/engine/game/ui/system.js',
			type: 'UISystem',
			name: 'uiSystem',
			components: [],
			objects: [
				{
					module: '/scripts/deepdarknight/asset/ui/inventory.js',
					type: 'InventoryWindow',
					name: 'inventoryWindow',
					objects: [
						{
							module: '/scripts/engine/game/ui/label.js',
							type: 'UILabel',
							area: new Area(10, 10, null, 20),
							fitContentHorizontal: true,
							font: '20px 굴림체',
							text: '인벤토리',
							backgroundColor: null,
						}
					],
					area: new Area(500, 100, 250, 400),
					visible: false,
					backgroundColor: 'white',
				},
				{
					module: '/scripts/deepdarknight/asset/ui/mix.js',
					type: 'MixWindow',
					name: 'mixWindow',
					objects: [
						{
							module: '/scripts/engine/game/ui/label.js',
							type: 'UILabel',
							area: new Area(10, 10, null, 20),
							fitContentHorizontal: true,
							font: '20px 굴림체',
							text: '조합',
							backgroundColor: null,
						}
					],
					area: new Area(100, 100, 250, 300),
					visible: false,
					backgroundColor: 'white',
				},
				{
					module: '/scripts/deepdarknight/asset/ui/equipment.js',
					type: 'EquipmentWindow',
					name: 'equipmentWindow',
					objects: [
						{
							module: '/scripts/engine/game/ui/label.js',
							type: 'UILabel',
							area: new Area(10, 10, null, 20),
							fitContentHorizontal: true,
							font: '20px 굴림체',
							text: '장비',
							backgroundColor: null,
						}
					],
					area: new Area(100, 100, 250, 300),
					visible: false,
					backgroundColor: 'white',
				}
			]
		}
	]
};

// gameObject -> component: this.getComponent(Type)