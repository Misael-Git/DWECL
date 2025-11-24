            // Si es la primera vez, se inicializan lab, x, y y visitado
           // if (primeraVez) { // PRIMERA VEZ


let laberinto = lab;
            let posX = x;
            let posY = y;

            // Primero detecta si sabe donde está la s, y sino la busca
            if (sComprobada = false) { // S COMPROBADA
                if (laberinto[posX][posY] == " ") {
                    document.getElementById("pruebas").innerHTML = "Comprobando en x: " + posX + " y: " + posY;
                    posY++;
                    setTimeout(resolverLaberinto(lab, x, y, visitado), 500);

                } else if (lab[x][y] == "S") {
                    document.getElementById("pruebas").innerHTML = "Hola x: " + posX + " y: " + posY;
                    sComprobada = true;
                    sPosX = x;
                    sPosY = y;
                } else if (lab[x+1][y] == "S") {
                    document.getElementById("pruebas").innerHTML = "Hola x: " + x + " y: " + y;
                    sComprobada = true;
                    sPosX = x+1;
                    sPosY = y;
                } else if (lab[x+2][y] == "S") {
                    document.getElementById("pruebas").innerHTML = "Hola x: " + x + " y: " + y;
                    sComprobada = true;
                    sPosX = x+2;
                    sPosY = y;
                } else if (lab[x+3][y] == "S") {
                    document.getElementById("pruebas").innerHTML = "Hola x: " + x + " y: " + y;
                    sComprobada = true;
                    sPosX = x+3;
                    sPosY = y;
                } else { // Si no lo encontramos en ninguna de las 4 posiciones...
                     // ...Comprobamos luego la siguiente fila
                    document.getElementById("pruebas").innerHTML = "Hola x: " + x + " y: " + y;
                }

            } else { // RESOLUCIÓN DEL LABERINTO
