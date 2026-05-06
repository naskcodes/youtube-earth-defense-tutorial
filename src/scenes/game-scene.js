import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
    #player;
    #planet;
    #cursorKeys;
    #playerAngleInRadians;
    
    constructor() {
        super({
            key: SCENE_KEYS.GAME_SCENE,
        });
    }

    create() {
        for (let i = 1; i < 4; i++) {
            this.add.sprite(0, 0, ASSET_KEYS[`BACKGROUND_${i}`], 0).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS[`BACKGROUND_${i}`]).setAlpha(0.4);
        }

       this.#planet = this.add.sprite(this.scale.width/2, this.scale.height/2, ASSET_KEYS.PLANET, 0).play(ASSET_KEYS.PLANET);
       this.#player = this.add.image(0, 0, ASSET_KEYS.SHIP);
       this.#playerAngleInRadians = 0;
       this.#updatePlayerPosition();

       this.#cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.#cursorKeys.left.isDown) {
            this.#playerAngleInRadians -= 0.06;
        } else if (this.#cursorKeys.right.isDown) {
            this.#playerAngleInRadians +=0.06
        }

        this.#updatePlayerPosition();
    }

    #updatePlayerPosition() {
        const x = this.scale.width / 2 + (this.#planet.displayHeight / 2) * Math.cos(this.#playerAngleInRadians);
        const y = this.scale.height / 2 + (this.#planet.displayHeight / 2) * Math.sin(this.#playerAngleInRadians);
        this.#player.setPosition(x, y);
        this.#player.rotation = this.#playerAngleInRadians + Math.PI / 2;
    }
}