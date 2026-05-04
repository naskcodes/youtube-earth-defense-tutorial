import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    create() {
        console.log('preload-scene create called');
        this.scene.start(SCENE_KEYS.GAME_SCENE);
    }
}