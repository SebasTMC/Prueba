// 1. Inicializar el mapa y centrarlo en México
const mapa = L.map('mapa').setView([23.6345, -102.5528], 5);

// 2. Cargar la capa visual del mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// 3. Conectar con el archivo local JSON
fetch('./datos.json')
    .then(respuesta => {
        if (!respuesta.ok) throw new Error("Error en la carga del JSON");
        return respuesta.json();
    })
    .then(sismos => {
        const contenedorLista = document.getElementById('sismos-ul');

        // Iterar sobre cada sismo en el JSON
        sismos.forEach(sismo => {
            // A) Crear un marcador rojo en el mapa usando las coordenadas
            const marcador = L.marker([sismo.latitud, sismo.longitud]).addTo(mapa);
            
            // B) Añadir una ventana emergente (popup) al hacer clic en el marcador
            marcador.bindPopup(`
                <div style="font-family: Arial;">
                    <strong>${sismo.referencia}</strong><br>
                    Magnitud: <span style="color:red; font-weight:bold;">${sismo.magnitud}</span><br>
                    Profundidad: ${sismo.profundidad} km<br>
                    Fecha: ${sismo.fecha}
                </div>
            `);

            // C) Añadir el sismo como texto a la lista debajo del mapa
            const elementoLista = document.createElement('li');
            elementoLista.innerHTML = `<span class="magnitud">M ${sismo.magnitud}</span> ${sismo.referencia} - <em>${sismo.fecha}</em>`;
            contenedorLista.appendChild(elementoLista);
        });
    })
    .catch(error => {
        console.error("Error cargando los datos sísmicos:", error);
        document.getElementById('sismos-ul').innerHTML = "<li>Error al cargar los datos. Verifica que el archivo datos.json exista.</li>";
    });
