let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let timer = 60;
let timerInicial = 60;
let tiempoRegresivoId = null;

let mostrarMovimientos = document.getElementById("movimientos");
let mostrarAciertos = document.getElementById("aciertos");
let mostrarTiempo = document.getElementById("t-restante");

let winAudio = new Audio('./sounds/win.mp3');
let loseAudio = new Audio('./sounds/lose.mp3');
let clickAudio = new Audio('./sounds/click.mp3');
let rightAudio = new Audio('./sounds/right.mp3');
let wrongAudio = new Audio('./sounds/wrong.mp3');

// Arrays de imágenes y textos correspondientes
const pares = [
    { id: 1, tipo: 'imagen', contenido: '1.png' },
    { id: 1, tipo: 'texto', contenido: '1.png', textoPersonalizado: 'Implica identificar fuentes relevantes y confiables. ' },
    { id: 2, tipo: 'imagen', contenido: '2.png' },
    { id: 2, tipo: 'texto', contenido: '2.png', textoPersonalizado: 'Puede incluir la clasificación de datos, la creación de resúmenes' },
    { id: 3, tipo: 'imagen', contenido: '3.png' },
    { id: 3, tipo: 'texto', contenido: '3.png', textoPersonalizado: 'Significa evaluar los datos en busca de patrones o tendencias.' },
    { id: 4, tipo: 'imagen', contenido: '4.png' },
    { id: 4, tipo: 'texto', contenido: '4.png', textoPersonalizado: 'Leer ampliamente para desafiar creencias actuales.' },
    { id: 5, tipo: 'imagen', contenido: '5.png' },
    { id: 5, tipo: 'texto', contenido: '5.png', textoPersonalizado: 'Realizar autoevaluaciones periódicas para medir el progreso.' },
    { id: 6, tipo: 'imagen', contenido: '6.png' },
    { id: 6, tipo: 'texto', contenido: '6.png', textoPersonalizado: 'No aceptar afirmaciones sin un análisis riguroso.' },
    { id: 7, tipo: 'imagen', contenido: '7.png' },
    { id: 7, tipo: 'texto', contenido: '7.png', textoPersonalizado: 'Analizar la coherencia interna de un argumento.' },
    { id: 8, tipo: 'imagen', contenido: '8.png' },
    { id: 8, tipo: 'texto', contenido: '8.png', textoPersonalizado: 'Estar abierto a recibir críticas constructivas ' }
];

// Mezclar aleatoriamente los pares
pares.sort(() => { return Math.random() - 0.5 });

function contarTiempo() {
    tiempoRegresivoId = setInterval(() => {
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
        if (timer <= 0) {
            clearInterval(tiempoRegresivoId);
            mostrarTiempo.innerHTML = "¡Tiempo agotado!";
            bloquearTarjetas(true); // Bloquea las tarjetas y muestra los textos
            loseAudio.play();
        }
    }, 1000);
}

function bloquearTarjetas(mostrarTextos = false) {
    for (let i = 0; i < pares.length; i++) {
        let tarjetaBloqueada = document.getElementById(i);
        if (mostrarTextos) {
            // Muestra el contenido correcto según el tipo
            if (pares[i].tipo === 'imagen') {
                tarjetaBloqueada.innerHTML = `<img src="./images/${pares[i].contenido}" class="img-mem">`; // Muestra la imagen
            } else {
                tarjetaBloqueada.innerHTML = `<span>${pares[i].textoPersonalizado}</span>`; // Muestra el texto personalizado
            }
        } else {
            tarjetaBloqueada.innerHTML = ''; // Oculta el contenido
        }
        tarjetaBloqueada.disabled = true; // Deshabilita la tarjeta
    }
}

function destapar(id) {
    if (temporizador === false) {
        contarTiempo();
        temporizador = true;
    }

    tarjetasDestapadas++;
    console.log(tarjetasDestapadas);

    if (tarjetasDestapadas === 1) {
        tarjeta1 = document.getElementById(id);
        primerResultado = pares[id]; // Obtiene el primer resultado
        if (primerResultado.tipo === 'imagen') {
            tarjeta1.innerHTML = `<img src="./images/${primerResultado.contenido}" class="img-mem">`; // Muestra la imagen
        } else {
            tarjeta1.innerHTML = `<span>${primerResultado.textoPersonalizado}</span>`; // Muestra el texto personalizado
        }
        clickAudio.play();
        tarjeta1.disabled = true;
    } else if (tarjetasDestapadas === 2) {
        tarjeta2 = document.getElementById(id);
        segundoResultado = pares[id]; // Obtiene el segundo resultado
        if (segundoResultado.tipo === 'imagen') {
            tarjeta2.innerHTML = `<img src="./images/${segundoResultado.contenido}" class="img-mem">`; // Muestra la imagen
        } else {
            tarjeta2.innerHTML = `<span>${segundoResultado.textoPersonalizado}</span>`; // Muestra el texto personalizado
        }
        tarjeta2.disabled = true;

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;
        
        // Comprobar si las tarjetas forman un par
        if (
            (primerResultado.id === segundoResultado.id) && 
            ((primerResultado.tipo === 'imagen' && segundoResultado.tipo === 'texto') || 
            (primerResultado.tipo === 'texto' && segundoResultado.tipo === 'imagen'))
        ) {
            // Aquí puedes agregar un log para ver qué se está comparando
            console.log(`Comparando: ${primerResultado.contenido} con ${segundoResultado.contenido}`);
            
            tarjetasDestapadas = 0;
            aciertos++;
            mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
            rightAudio.currentTime = 0; // Reinicia el audio
            rightAudio.play(); // Reproduce el sonido de acierto
            
            if (aciertos === pares.length / 2) {
                winAudio.play();
                clearInterval(tiempoRegresivoId);
                mostrarAciertos.innerHTML = `Aciertos: ${aciertos} 💯`;
                mostrarTiempo.innerHTML = `¡Fantástico! 🙌 Solo demoraste ${timerInicial - timer} segundos`;
                mostrarMovimientos.innerHTML = `Movimientos: ${movimientos} 🌟`;
                bloquearTarjetas(true); // Muestra el contenido de todas las tarjetas al final
            }
        } else {
            // Reproduce el sonido de "wrong" cada vez que hay un error
            wrongAudio.currentTime = 0; // Reinicia el audio
            wrongAudio.play(); // Reproduce el sonido de error

            // Deshabilitar las tarjetas y volver a mostrarlas después de un tiempo
            setTimeout(() => {
                tarjeta1.innerHTML = ''; // Oculta la tarjeta 1
                tarjeta2.innerHTML = ''; // Oculta la tarjeta 2
                tarjeta1.disabled = false; // Habilita la tarjeta 1
                tarjeta2.disabled = false; // Habilita la tarjeta 2
                tarjetasDestapadas = 0; // Reinicia el contador de tarjetas destapadas
            }, 800);
        }
    }
}
