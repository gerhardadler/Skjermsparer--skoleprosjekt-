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

    // The tick function updates the fish
    tick(delta) {
        let sumPosition = new Vector2D(0, 0);
        let sumDirection = new Vector2D(0, 0);
        let adjustCount = 0;
        let avoidanceSumPosition = new Vector2D(0, 0);
        let avoidCount = 0;

        // Goes through every other fish, and based on their positions,
        // It's own position is changed. The fishes try to go towards
        // nearby fishes, they try to align themselves to other fishes,
        // and they try to avoid crashing into other fishes. 
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
            
            if (fishDirectionRadian < averageDirectionRadian) {
                fishDirectionRadian += this.turnSpeed / 10;
            } else if (fishDirectionRadian > averageDirectionRadian) {
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

        this.position = this.position.add(this.direction.multiply(this.speed * delta))

        this.position.x = ((this.position.x % this.app.renderer.width) + this.app.renderer.width) % this.app.renderer.width;
        this.position.y = ((this.position.y % this.app.renderer.height) + this.app.renderer.height) % this.app.renderer.height;

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.rotation = Math.atan2(this.direction.y, this.direction.x);
    }
}

// Creates an array of fishes, and gives them random positions and colors
const fishes = [];
for (let i = 0; i < 50; i++) {
    const fish = new Fish(app, "images/pelle_nerd.png", new Vector2D(0, 0), 10, fishes);
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