<div class="plugin__mobile-header">
    { title }
</div>

<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={ () => bcast.emit('rqstOpen', 'menu') }
    >
    { title }
    </div>
<p> A plugin by <a href="https://github.com/YannKerherve">Yann Kerhervé</a></p>
<p> <center>🛳️</center></p>
<p> 1. Download and unzip the <a href="https://drive.google.com/file/d/1WQprHSiy15N97M6U9ybNfuVbMuzLSsL2/view?usp=sharing">plugin file</a> (click on ‘plugin file')</p>
<p> 2. Run server.exe and fill in the information from TCP</p>
<p> 3. Press start on the server and update Windy</p>
<p> <center>🛳️</center></p>
    {#if gpsData}
           <p> GPS Data:</p>
           <p> {gpsData}</p>
           <p>  Latitude: {latitude}° </p>
           <p>  Longitude: {longitude}° </p>
    {/if}
    {#if error}
        <div class="error">
            <p>Error: {error}</p>
        </div>
    {/if}
</section>

<script lang="ts">
    import bcast from "@windy/broadcast";
    import { onDestroy, onMount } from 'svelte';
    import { map } from "@windy/map";
    const title ='TCP GPS position plugin'
    let latitude: string | null=null;
    let longitude: string | null=null;
    let markerLayer = L.layerGroup().addTo(map);
    let gpsData = 'Aucune donnée reçue pour le moment...';
    let error = '';

    // Fonction pour récupérer les données de l'API locale
    async function fetchGPSData() {
        try {
            const response = await fetch("http://localhost:5000/gps-data");
            gpsData = await response.text();
            if (gpsData.startsWith('$') && gpsData.slice(3, 6) === 'GLL') {
                const parts = gpsData.split(',');
                const latitudesal = parseFloat(parts[1]);
                const latDirection = parts[2];
                const longitudesal = parseFloat(parts[3]);
                const lonDirection = parts[4];
                latitude = convertLatitude(latitudesal, latDirection);
                longitude = convertLongitude(longitudesal, lonDirection);
                function convertLatitude(latitudesal, latDirection) {
                    const degrees = Math.floor(latitudesal / 100);
                    const minutes = latitudesal - (degrees * 100);
                    let latitude = degrees + (minutes / 60);

                    if (latDirection === 'S') {
                        latitude = -latitude;
                    }
                    return latitude;
                }

                function convertLongitude(longitudesal, lonDirection) {
                    const degrees = Math.floor(longitudesal / 100);
                    const minutes = longitudesal - (degrees * 100);
                    let longitude = degrees + (minutes / 60);

                    if (lonDirection === 'W') {
                        longitude = -longitude;
                    }
                    return longitude;
                }



                   
                if (latitude && longitude) {
                   addMarkerOnMap(parseFloat(latitude), parseFloat(longitude));
                   }
            }
        } catch (err) {
            error = `Erreur lors de la récupération des données : ${err.message || err}`;
            console.error('Erreur de récupération des données:', err);
        }
    }
    function addMarkerOnMap(lat, lon) {
    if (map) {
markerLayer.clearLayers(); 
        // Crée le marqueur avec la popup contenant une icône qui tourne

                const customIcon = L.divIcon({
            className: 'custom-marker', // Classe CSS pour styliser
            html: `
                <div style="display: flex; align-items: center; flex-direction: column;">
                    <div style="font-size: 24px; animation: spin 2s linear infinite; color: black;">
                        <i class="fa-solid fa-location-crosshairs"></i>
                    </div>
                    </div>
            `,
            iconSize: [30, 42], // Taille approximative
            iconAnchor: [15, 42], // Ancre pour alignement (base du marqueur)
        });

        // Ajoute le marqueur à la carte
        //const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        const marker = L.marker([lat, lon]).addTo(markerLayer);   
} else {
        console.error("Carte Windy non disponible !");
    }
}

    // Rafraîchissement périodique
    let interval;
    onMount(() => {
        interval = setInterval(fetchGPSData, 500); // toutes les 2 secondes
        fetchGPSData(); // première récupération immédiate
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    export const onopen = () => {
        console.log('Plugin ouvert');
        fetchGPSData();
    };

    export const onclose = () => {
        console.log('Plugin fermé');
    };
</script>

<style lang="less">
    .gps-info {
        margin-top: 20px;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
    }

    .error {
        color: red;
        margin-top: 20px;
    }
    .plugin-container {
        padding: 10px;
        font-family: Arial, sans-serif;
        white-space: pre-wrap; /* Permet d'afficher les retours à la ligne */
        background: #f5f5f5;
        height: 100%;
        overflow-y: auto;
    }
</style>
<div class="plugin-container">
    <h3>GPS Data Stream</h3>
    {#if error}
        <div class="error">{error}</div>
    {/if}
    <pre>{gpsData}</pre>
</div>
