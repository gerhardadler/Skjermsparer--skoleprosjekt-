const app = new PIXI.Application({
    resizeTo: window 
});
document.body.appendChild(app.view);

function setRandomHue(colorMatrix) {
    colorMatrix.hue(Math.floor(Math.random() * 360));
}

const sprite = PIXI.Sprite.from("images/pelle_nerd.png");

const colorMatrix = new PIXI.ColorMatrixFilter();

sprite.filters = [colorMatrix];

app.stage.addChild(sprite);

let elapsed = 0.0;
const velocity = [1, 1];
app.ticker.add((delta) => {
    // The sprite will change velocity and color when hitting the corner
    if (sprite.x + sprite.width > app.renderer.width) {
        velocity[0] = -1;
        sprite.x = app.renderer.width - sprite.width;
        setRandomHue(colorMatrix);
    } else if (sprite.x < 0) {
        velocity[0] = 1;
        sprite.x = 0;
        setRandomHue(colorMatrix);
    }

    if (sprite.y + sprite.height > app.renderer.height) {
        velocity[1] = -1;
        sprite.y = app.renderer.height - sprite.height;
        setRandomHue(colorMatrix);
    } else if (sprite.y < 0) {
        velocity[1] = 1;
        sprite.y = 0;
        setRandomHue(colorMatrix);
    }

    sprite.x += velocity[0];
    sprite.y += velocity[1];
});