import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.TITLE_SCENE,
        });
    }

    create() {
        for (let i = 1; i < 4; i++) {
            this.add.sprite(0, 0, ASSET_KEYS[`BACKGROUND_${i}`], 0).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS[`BACKGROUND_${i}`]).setAlpha(0.4);
        };

        this.add.sprite(this.scale.width / 2, this.scale.height / 2, ASSET_KEYS.PLANET, 0).play(ASSET_KEYS.PLANET);

        this.add.text(this.scale.width/2, 100, 'Planet Defense', {
            fontSize: '32px'
        }).setOrigin(0.5);

        this.add.text(this.scale.width/2, 350, 'Click to play!', {
            fontSize: '22px'
        }).setOrigin(0.5);

        this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start(SCENE_KEYS.GAME_SCENE);
            });
        });

        this.cameras.main.fadeIn(500);
    }
}