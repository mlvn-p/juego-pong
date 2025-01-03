let x = 400; //posición inicial en x de la pelota
let y = 200; //posición inicial en y de la pelota
const diametro = 50; //diámetro de la pelota

//crea variables para la velocidad en x y en y de la pelota
let velocidadX = 5;
let velocidadY = 5;

let imagenPelota;
let imagenRaqueta;
let imagenComputadora;
let imagenFondo;
let sonidoRaqueta;
let sonidoGol;

let puntosJugador = 0;
let puntosComputadora = 0;

//función setup del p5.js
function setup() {
    createCanvas(800, 400);
}

//función draw del p5.js
function draw() {
    background(0);
    //dibuja la pelota del juego usando la función circle de p5.js
    fill(255);
    circle(x, y, diametro);
    //mueve la pelota en la dirección de las velocidades
    x = x + velocidadX;
    y = y + velocidadY;
    console.log(x, y);

    //lógica cuando colisiona con los bordes laterales, resetea la posición porque fue gol
    if (x > width - diametro / 2 || x < diametro / 2) {
        x = 400;
        y = 200;
    }
    //si la pelota llega al borde superior o inferior de la pantalla, cambia la dirección
    if (y > height - diametro / 2 || y < diametro / 2) {
        velocidadY = velocidadY * -1;
    }
}
class Pelota {
    constructor(x, y, diametro, velocidadX, velocidadY) {
        this.x = x;
        this.y = y;
        this.diametro = diametro;
        //sentido inicial de la pelota sea un valor aleatorio, utiliza la función math.random
        this.velocidadX = velocidadX;
        this.velocidadY = velocidadY;
        this.reset();
    }

    update() {
        this.x += this.velocidadX;
        this.y += this.velocidadY;
        //aumenta la rotación de la pelota con la velocidad en el eje x y la velocidad en el eje y
        this.rotation += this.velocidadX + this.velocidadY;

        if (this.x > width - this.diametro / 2 || this.x < this.diametro / 2) {
            sonidoGol.play();
            if (this.x > width / 2) {
                puntosJugador++;
            } else {
                puntosComputadora++;
            }
            
            narrarPuntos();
            this.reset();
        }

        if (this.y > height - this.diametro / 2 || this.y < this.diametro / 2) {
            this.velocidadY *= -1;
        }

        //si colisiona con la raqueta del jugador o la computadora, invierte el sentido y aumenta la velocidad en 10%
        if (colision(this.x, this.y, this.diametro, raqueta.x, raqueta.y, raqueta.ancho, raqueta.alto) ||
            colision(this.x, this.y, this.diametro, computadora.x, computadora.y, computadora.ancho, computadora.alto)) {
            sonidoRaqueta.play(); 
            this.velocidadX *= 1.1;
            this.velocidadY *= 1.1;
            this.velocidadX *= -1;
        }

    }

    reset() {
        this.x = 400;
        this.y = 200;
        this.velocidadX = velocidadX * (Math.random() < 0.5 ? -1 : 1);
        this.velocidadY = velocidadY * (Math.random() < 0.5 ? -1 : 1);
        //rotación actual de la pelota
        this.rotation = 0;
    }

    draw() {
        //dibuja la pelota como una imagen en lugar de un círculo   
        //rota la pelota antes de dibujarla
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        image(imagenPelota, -this.diametro / 2, -this.diametro / 2, this.diametro, this.diametro);
        pop();

        //image(imagenPelota, this.x - this.diametro / 2, this.y - this.diametro / 2, this.diametro, this.diametro);
        //circle(this.x, this.y, this.diametro);
    }
}

class Raqueta {
    constructor(x, y, ancho, alto, speed) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.speed = speed;
    }

    update() {
        //la raqueta del jugador se debe mover con el mouse

        //identifica si la raqueta es la del jugador, raqueta jugador es la de la izquierda 
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            //la raqueta de la computadora se mueve automáticamente
            if (pelota.y > this.y) {
                this.y += this.speed;
            } else {
                this.y -= this.speed;
            }
        }
    



    //limitar el movimiento de la raqueta para que no se salga de la pantalla
        this.y = constrain(this.y, 0, height - this.alto);
        }

    draw() {
        //si es la raqueta del jugador, dibuja la raqueta con la imagen de la raqueta del jugador
        if (this.x < width / 2) {
            image(imagenRaqueta, this.x, this.y, this.ancho, this.alto);
        } else {
            //si es la raqueta de la computadora, dibuja la raqueta con la imagen de la raqueta de la computadora
            image(imagenComputadora, this.x, this.y, this.ancho, this.alto);
        }
        //rect(this.x, this.y, this.ancho, this.alto);
    }
}

let pelota;
let raqueta;
let computadora;

//verifica si la colisión entre una circunferencia y un rectángulo
//circunferencia cx, cy, diametro
//rectángulo rx, ry, ancho, alto
function colision(cx, cy, diametro, rx, ry, ancho, alto) {
    //si el círculo está a la izquierda del rectándulo
    if (cx + diametro / 2 < rx) {
        return false;
    }
    //si el círculo está arriba del rectángulo
    if (cy + diametro / 2 < ry) {
        return false;
    }
    //si el círculo está a la derecha del rectángulo
    if (cx - diametro / 2 > rx + ancho) {
        return false;
    }
    //si el círculo está abajo del rectángulo
    if (cy - diametro / 2 > ry + alto) {
        return false;
    }
    return true;

}

function preload() {
    imagenPelota = loadImage('pelota.png');
    imagenRaqueta = loadImage('raqueta1.png');
    imagenComputadora = loadImage('raqueta2.png');
    imagenFondo = loadImage('fondo.png');
    sonidoRaqueta = loadSound('bounce.wav');
    sonidoGol = loadSound('Jingle_Win_Synth_02.wav');
}

function setup() {
    createCanvas(800, 400);
    pelota = new Pelota(400, 200, 50, 5, 5);
    raqueta = new Raqueta(20, 150, 20, 100, 5);
    computadora = new Raqueta(760, 150, 20, 100, 5);
}

function narrarPuntos() {
    //Narra los puntos utilizando la API speechapi
    //Narra utilizando español de Argentina
    let puntos = puntosJugador + " a " + puntosComputadora;
    let mensaje = new SpeechSynthesisUtterance(puntos);
    mensaje.lang = 'es-AR';
    speechSynthesis.speak(mensaje);
    
}

function draw() {
    //background(0);
    //dibujar el fondo del juego
    image(imagenFondo, 0, 0, width, height);
    pelota.update();
    pelota.draw();
    raqueta.update();
    raqueta.draw();
    computadora.update();
    computadora.draw(); 
}