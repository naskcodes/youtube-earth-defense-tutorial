import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

export class GameScene extends Phaser.Scene {
    #player;
    #planet;
    #cursorKeys;
    #playerAngleInRadians;
    #bulletGroup;
    #lastBulletFireTime;
    
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

       this.#bulletGroup = this.physics.add.group([]);
       this.#lastBulletFireTime = 0;

       this.#cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update(time) {
        if (this.#cursorKeys.left.isDown) {
            this.#playerAngleInRadians -= 0.06;
        } else if (this.#cursorKeys.right.isDown) {
            this.#playerAngleInRadians +=0.06
        }

        this.#updatePlayerPosition();

        if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space) && time > this.#lastBulletFireTime + 200) {
            this.#fireBullet();
            this.#lastBulletFireTime = time;
        }

        this.#bulletGroup.getChildren().forEach((bullet) => {
            if (bullet.active && (bullet.x < 0 || bullet.x > this.scale.width || bullet.y < 0|| bullet.y > this.scale.height )) {
                bullet.setActive(false).setVisible(false);
            }
        });
    }

    #updatePlayerPosition() {
        const x = this.scale.width / 2 + (this.#planet.displayHeight / 2) * Math.cos(this.#playerAngleInRadians);
        const y = this.scale.height / 2 + (this.#planet.displayHeight / 2) * Math.sin(this.#playerAngleInRadians);
        this.#player.setPosition(x, y);
        this.#player.rotation = this.#playerAngleInRadians + Math.PI / 2;
    }

    #fireBullet() {
        const x = this.#player.x;
        const y = this.#player.y;
        const velocity = this.physics.velocityFromRotation(this.#playerAngleInRadians, 400);
        const bullet = this.#bulletGroup.getFirstDead(true, x, y, ASSET_KEYS.BULLET, 0, true);

        bullet.setActive(true).setVisible(true).setScale(1.5).play(ASSET_KEYS.BULLET).enableBody();
        bullet.setVelocity(velocity.x, velocity.y);
        bullet.setRotation(this.#player.rotation);

        //console.log("fireBullet: number of bullet game objects in group -", this.#bulletGroup.getChildren().length);
    }
}