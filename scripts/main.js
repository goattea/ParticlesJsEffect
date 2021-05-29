const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function mouseRadiusScaler() {
    return (canvas.height / 80) * (canvas.width / 80);
};

// get mouse position
let mouse = {
    x: null,
    y: null,
    // set the radius around the mouse to be dynamic
    // based on the size of the canvas
    radius: mouseRadiusScaler()
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', (event) => {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = mouseRadiusScaler();
    init();
});

// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8c5523';
        ctx.fill();
    }

    // check particle position, check mouse position, move particle, draw particle
    update() {
        // ensure particle is within the canvas, if not reverse its direction
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // collision detection using a circle
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            // we are colliding so move the particle in an appropriate
            // direction based on how the mouse is colliding with it,
            // but make sure not to push it off screen
            let screenBuffer = 10;
            let moveDistance = 10;

            if (mouse.x < this.x && this.x < canvas.width - this.size * screenBuffer) {
                this.x += moveDistance;
            }

            if (mouse.x > this.x && this.x > this.size * screenBuffer) {
                this.x -= moveDistance;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size * screenBuffer) {
                this.y += moveDistance;
            }

            if (mouse.y > this.y && this.y > this.size * screenBuffer) {
                this.y -= moveDistance;
            }
        }

        // move particles in the direction they are going
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// create and populate partcles array
let particles;
function init() {
    particles = [];
    // create particles based on the size of the canvas
    const particleCountMultiplier = 3;
    let numberOfParticles = ((canvas.width * canvas.height) / 9000) * particleCountMultiplier;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8c5523';

        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// check if particles are close enough to each other to draw a line between them
function connect() {
    const opacityScaler = 10000;
    for (let a = 0; a < particles.length; a++) {
        for (let b = 0; b < particles.length; b++) {
            if(a === b) continue;

            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy;
            
            const distanceScaler = 7;
            if(distance < (canvas.width / distanceScaler) * (canvas.height / distanceScaler)) {
                let opacityValue = 1 - (distance / opacityScaler);
                ctx.strokeStyle = `rgba(140, 85, 31, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();
}



init();
animate();