import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from '../common/scene-keys.js';
import { ASSET_KEYS } from '../common/assets.js';

const DATA_KEYS = Object.freeze({
    ROTATION_SPEED: 'ROTATION_SPEED'
});

export class GameScene extends Phaser.Scene {
    #planet;
    #planetHealth;
    #cursorKeys;
    #player;
    #playerAngleInRadians;
    #bulletGroup;
    #lastBulletFireTime;
    #enemyGroup;
    #enemySpeed;
    #spawnDelay;
    #spawnTimer;
    #destroyedEnemyGroup;
    #score;
    #lockInput;
    
    constructor() {
        super({
            key: SCENE_KEYS.GAME_SCENE,
        });
    }

    create() {
        for (let i = 1; i < 4; i++) {
            this.add.sprite(0, 0, ASSET_KEYS[`BACKGROUND_${i}`], 0).setOrigin(0).setScale(1, 1.25).play(ASSET_KEYS[`BACKGROUND_${i}`]).setAlpha(0.4);
        }

       this.#planet = this.physics.add.sprite(this.scale.width/2, this.scale.height/2, ASSET_KEYS.PLANET, 0).play(ASSET_KEYS.PLANET);
       this.#planet.body.setCircle(30, 18, 18);
       this.#planetHealth = 3;

       this.#player = this.add.image(0, 0, ASSET_KEYS.SHIP);
       this.#playerAngleInRadians = 0;
       this.#updatePlayerPosition();

       this.#bulletGroup = this.physics.add.group([]);
       this.#lastBulletFireTime = 0;
       
       this.#enemyGroup = this.physics.add.group([]);
       this.#destroyedEnemyGroup = this.add.group([]);
       this.#spawnDelay = 1250;
       this.#enemySpeed = 50;
       this.#spawnTimer = this.time.addEvent({
        delay: this.#spawnDelay,
        callback: this.#spawnEnemy,
        callbackScope: this,
        loop: true
       });
       this.time.addEvent({
        delay: 10000,
        callback: this.#increaseDifficulty,
        callbackScope: this,
        loop: true
       });
       
       this.physics.add.overlap(this.#enemyGroup, this.#bulletGroup, this.#handleBulletEnemyCollison, undefined, this);
       
       this.physics.add.overlap(this.#planet, this.#enemyGroup, this.#handlePlanetEnemyCollison, undefined, this);
       
       this.#score = 0;
       
       this.#cursorKeys = this.input.keyboard.createCursorKeys();

       this.#lockInput = false;
    }

    update(time) {
        if (this.#lockInput) {
            return;
        }

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

        this.#enemyGroup.getChildren().forEach((enemy) => {
            if (enemy.active && (enemy.x < -50 || enemy.x > this.scale.width + 50 || enemy.y < -50|| enemy.y > this.scale.height + 50 )) {
                enemy.setActive(false).setVisible(false);
                return;
            }
            enemy.rotation += enemy.getData(DATA_KEYS.ROTATION_SPEED);
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
    }

    #spawnEnemy() {
        let x = 0;
        let y = 0;
        const edge = Phaser.Math.Between(0, 3);
        
        if (edge === 0) {
            x = 0;
            y = Phaser.Math.Between(0, this.scale.height);
        } else if (edge === 1) {
            x = this.scale.width;
            y = Phaser.Math.Between(0, this.scale.height);
        } else if (edge === 2) {
            x = Phaser.Math.Between(0, this.scale.width);
            y = 0;
        } else {
            x = Phaser.Math.Between(0, this.scale.width);
            y = this.scale.height;
        }

        const enemy = this.#enemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID, 0, true);

        enemy.setActive(true).setVisible(true).enableBody().setScale(Phaser.Math.FloatBetween(0.75, 1.25)).setData(DATA_KEYS.ROTATION_SPEED, Phaser.Math.FloatBetween(-0.02, 0.02));
        this.physics.moveTo(enemy, this.scale.width/2, this.scale.height/2, this.#enemySpeed);
        enemy.body.setSize(enemy.displayWidth * 0.3, enemy.displayHeight * 0.3);
    }

    #increaseDifficulty() {
        if (this.#spawnDelay > 500) {
            this.#spawnDelay -= 50;
            this.#spawnTimer.destroy();
            this.#spawnTimer = this.time.addEvent({
                delay: this.#spawnDelay,
                callback: this.#spawnEnemy,
                callbackScope: this,
                loop: true
            });
        }

        if (this.#enemySpeed < 200) {
            this.#enemySpeed += 10;
        }
    }

    #handleBulletEnemyCollison(enemy, bullet) {
        bullet.disableBody();
        bullet.setActive(false).setVisible(false);
        enemy.disableBody();
        enemy.setActive(false).setVisible(false);
        this.#score += 1;
        console.log("Score: " + this.#score);
        this.#spawnDestroyedEnemy(enemy.x, enemy.y);
    }

    #spawnDestroyedEnemy(x, y) {
        const explosion = this.#destroyedEnemyGroup.getFirstDead(true, x, y, ASSET_KEYS.ASTEROID_EXPLODE, 0, true);
        explosion.setActive(true).setVisible(true).play(ASSET_KEYS.ASTEROID_EXPLODE);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.setActive(false).setVisible(false);
        });
    }

    #handlePlanetEnemyCollison(planet, enemy) {
        enemy.disableBody();
        enemy.setActive(false).setVisible(false);
        this.#spawnDestroyedEnemy(enemy.x, enemy.y);
        this.#damagePlanet();
    }

    #damagePlanet() {
        if (this.#planetHealth <= 0) {
            return;
        }

        this.#planetHealth -= 1;
        console.log("Planet hit! HP left: ", this.#planetHealth);

        this.cameras.main.shake(150, 0.02);
        this.tweens.add({
            targets: this.#planet,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 100,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            yoyo: true
        });

        if (this.#planetHealth <= 0) {
            this.#lockInput = true;
            this.#player.setVisible(false);
            this.#planet.disableBody();
            this.#planet.setActive(false).setVisible(false);
            this.#spawnDestroyedEnemy(this.#planet.x, this.#planet.y);
            this.scene.start(SCENE_KEYS.GAME_OVER_SCENE, {score: this.#score});
        }
    }
}