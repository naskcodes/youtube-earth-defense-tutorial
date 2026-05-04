import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.GAME_SCENE,
        });
    }

    create() {
        console.log('game-scene create called');
    }
}