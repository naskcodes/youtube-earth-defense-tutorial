import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
    #player
    #planet
    
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
       this.#player = this.add.image(200, 200, ASSET_KEYS.SHIP);
    }
}