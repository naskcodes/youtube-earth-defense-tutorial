import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { IMAGE_ASSETS, AUDIO_ASSETS, SPRITESHEET_ASSETS, ASSET_KEYS } from '../common/assets.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        IMAGE_ASSETS.forEach((asset) => {
            this.load.image(asset.assetKey, asset.path);
        });

        AUDIO_ASSETS.forEach((asset) => {
            this.load.audio(asset.assetKey, asset.path);
        });

        SPRITESHEET_ASSETS.forEach((asset) => {
            this.load.spritesheet(asset.assetKey, asset.path, {
                frameWidth: asset.frameWidth,
                frameHeight: asset.frameHeight,
            });
        });
    }

    create() {
        SPRITESHEET_ASSETS.forEach((asset) => {
            this.anims.create({
                key: asset.assetKey,
                frames: this.anims.generateFrameNumbers(asset.assetKey),
                frameRate: asset.frameRate,
                repeat: asset.repeat,
            });
        });

        this.sound.play(ASSET_KEYS.BACKGROUND_MUSIC, {
            loop: true,
            volume: 0.5
        });
        this.scene.start(SCENE_KEYS.TITLE_SCENE);
    }
}