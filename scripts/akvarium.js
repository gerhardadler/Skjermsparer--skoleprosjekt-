import { Vector2D } from "./vector.js";

const app = new PIXI.Application({
    resizeTo: window
});
document.body.appendChild(app.view);

function generateRandomPos(app, sprite_bounds) {
    return new Vector2D(
        Math.floor(Math.random() * (app.renderer.width - sprite_bounds.width)),
        Math.floor(Math.random() * (app.renderer.height - sprite_bounds.height))
    );
}

class Fish {
    #goal = new Vector2D(0, 0);

    constructor(app, image, position, speed, fishes) {
        this.app = app;
        this.sprite = PIXI.Sprite.from(image);
        this.sprite.width = 40;
        this.sprite.height = 40;
        this.position = position;
        this.speed = speed;
        this.fishes = fishes;
        this.direction = new Vector2D(1, 0);
        this.distanceThreshold = 300;
        this.avoidanceThreshold = 80;
        this.turnSpeed = 0.05;
        this.#goal = generateRandomPos(this.app, this.sprite.getBounds());
        this.app.stage.addChild(this.sprite);
    }

    #getGoalDirectionNormalized() {
        const direction = this.#goal.subtract(this.position);
        const normalizedDirection = direction.normalize();
        return normalizedDirection;
    }

    #steerAwayFromWall() {
        // const distanceToLeftWall = this.sprite.x;
        // const distanceToRightWall = this.app.renderer.width - this.sprite.x - this.sprite.width;
        // const distanceToTopWall = this.sprite.y;
        // const distanceToBottomWall = this.app.renderer.height - this.sprite.y - this.sprite.height;

        // if (distanceToLeftWall < this.distanceThreshold || distanceToTopWall < this.distanceThreshold) {
        //     if (0 < this.direction.radian() < Math.PI) { // Facing forwards
        //         this.direction = this.direction.rotate(this.turnSpeed * this.speed);
        //     } else {
        //         this.direction = this.direction.rotate(-this.turnSpeed * this.speed);
        //     }
        // }
        // if (distanceToRightWall < this.distanceThreshold || distanceToBottomWall < this.distanceThreshold) {
        //     if (0 < this.direction.radian() < Math.PI) { // Facing forwards
        //         this.direction = this.direction.rotate(this.turnSpeed * this.speed);
        //     } else {
        //         this.direction = this.direction.rotate(-this.turnSpeed * this.speed);
        //     }
        // }
        // } else if (distanceToRightWall < this.distanceThreshold) {
        //     this.direction.x -= this.turnSpeed * this.speed;
        // }
          
        // if (distanceToTopWall < this.distanceThreshold) {
        //     this.direction.y += this.turnSpeed * this.speed;
        // } else if (distanceToBottomWall < this.distanceThreshold) {
        //     this.direction.y -= this.turnSpeed * this.speed;
        // }
    }

    tick(delta) {
        // this.direction = this.direction.add(new Vector2D(Math.random, Math.random)).normalize()
        // const distanceToLeftWall = this.sprite.x;
        // const distanceToRightWall = this.app.renderer.width - this.sprite.x - this.sprite.width;
        // const distanceToTopWall = this.sprite.y;
        // const distanceToBottomWall = this.app.renderer.height - this.sprite.y - this.sprite.height;
        // console.log(distanceToBottomWall)

        // if (distanceToLeftWall < this.distanceThreshold) {
        //     this.direction.x += this.turnSpeed * this.speed;
        // } else if (distanceToRightWall < this.distanceThreshold) {
        //     this.direction.x -= this.turnSpeed * this.speed;
        // }
          
        // if (distanceToTopWall < this.distanceThreshold) {
        //     this.direction.y += this.turnSpeed * this.speed;
        // } else if (distanceToBottomWall < this.distanceThreshold) {
        //     this.direction.y -= this.turnSpeed * this.speed;
        // }

        // this.#steerAwayFromWall();

        let sumPosition = new Vector2D(0, 0);
        let sumDirection = new Vector2D(0, 0);
        let adjustCount = 0;
        let avoidanceSumPosition = new Vector2D(0, 0);
        let avoidCount = 0;
        for (const otherFish of this.fishes) {
            if (otherFish === this) {
                continue;
            }

            const fishDistance = this.position.distance(otherFish.position);
            
            if (fishDistance < this.avoidanceThreshold) {
                avoidCount++;
                avoidanceSumPosition = avoidanceSumPosition.add(otherFish.position)
            } else if (fishDistance < this.distanceThreshold) {
                adjustCount++;
                sumPosition = sumPosition.add(otherFish.position);
                sumDirection = sumDirection.add(otherFish.direction);
            }
        }
        
        if (avoidCount !== 0) {
            const avoidanceAveragePosition = avoidanceSumPosition.divide(avoidCount);
            const avoidanceCenterRadian = avoidanceAveragePosition.subtract(this.position).radian();
                
            let fishDirectionRadian = this.direction.radian();
            
            if (fishDirectionRadian > avoidanceCenterRadian) {
                fishDirectionRadian += this.turnSpeed;
            } else if (fishDirectionRadian < avoidanceCenterRadian) {
                fishDirectionRadian -= this.turnSpeed;
            }
            
            this.direction = Vector2D.vectorFromRadian(fishDirectionRadian);
        }
        if (adjustCount !== 0) {
            let fishDirectionRadian = this.direction.radian();
            
            const averageDirection = sumDirection.divide(adjustCount);
            const averageDirectionRadian = averageDirection.radian();
            
            if (fishDirectionRadian < averageDirection) {
                fishDirectionRadian += this.turnSpeed / 10;
            } else if (fishDirectionRadian > averageDirection) {
                fishDirectionRadian -= this.turnSpeed / 10;
            }

            const averagePosition = sumPosition.divide(adjustCount);
            const flockCenterRadian = averagePosition.subtract(this.position).radian();
    
    
            if (fishDirectionRadian < flockCenterRadian) {
                fishDirectionRadian += this.turnSpeed;
            } else if (fishDirectionRadian > flockCenterRadian) {
                fishDirectionRadian -= this.turnSpeed;
            }
    
            this.direction = Vector2D.vectorFromRadian(fishDirectionRadian);
        }

        
        // this.direction = this.direction.normalize();
        this.position = this.position.add(this.direction.multiply(this.speed * delta))

        // if (this.pos)
        // const directionVector = this.#getGoalDirectionNormalized();
        // const move = directionVector.multiply(delta * this.speed);
        // const difference = this.#goal.subtract(this.position).abs();
        // const moveDifference = this.#goal.subtract(this.position.add(move)).abs();
        // if (moveDifference.x > difference.x || moveDifference.y > difference.y) {
        //     this.position = this.#goal;
        //     this.#goal = generateRandomPos(this.app, this.sprite.getBounds());
        // } else {
        //     this.position = this.position.add(move);
        // }

        this.position.x = ((this.position.x % this.app.renderer.width) + this.app.renderer.width) % this.app.renderer.width;
        this.position.y = ((this.position.y % this.app.renderer.height) + this.app.renderer.height) % this.app.renderer.height;

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.rotation = Math.atan2(this.direction.y, this.direction.x);
    }
}

const fishes = [];
for (let i = 0; i < 50; i++) {
    const fish = new Fish(app, "/images/pelle_nerd.png", new Vector2D(0, 0), 10, fishes);
    fish.position = generateRandomPos(app, fish.sprite.getBounds());
    const colorMatrix = new PIXI.ColorMatrixFilter();
    colorMatrix.hue(Math.floor(Math.random() * 360));
    fish.sprite.filters = [colorMatrix];
    
    fishes.push(fish);
}

let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    for (const fish of fishes) {
        fish.tick(delta);
    }
});