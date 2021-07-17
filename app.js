const myMap = L.map('map').setView([22.9074872, 79.07306671], 5);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Made with ❤ by Hrushikesh Das';

L.tileLayer(tileUrl, { attribution }).addTo(myMap);

function generateList() {
    const ul = document.querySelector(".list");

    storeList.forEach((shop) => {
        const li = document.createElement("li");
        const div = document.createElement("div");
        const a = document.createElement("a");
        const p = document.createElement("p");

        a.addEventListener("click", function () {
            flyToStore(shop);
        });

        div.classList.add("shop-item");
        a.innerText = shop.properties.name;
        a.href = "#"
        p.innerText = shop.properties.address;

        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li);
    });
}

generateList();

function makePopupContent(feature) {
    return `
        <div>
            <h4>${feature.properties.name}</h4> 
            <p>${feature.properties.address}</p>
            <div class="phone-number">
                <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a>
            </div>
        </div>
    `;
}

function onEachFeature(feature, layer) {
    layer.bindPopup(
        makePopupContent(feature),
        { closeButton: false, offset: L.point(0, -8) }
    );
}

var myIcon = L.icon({
    iconUrl: './marker.png',
    iconSize: [30, 40],
});

const shopsLayer = L.geoJson(storeList, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    },
});

shopsLayer.addTo(myMap);

function flyToStore(store) {
    const lat = store.geometry.coordinates[1];
    const lng = store.geometry.coordinates[0];

    myMap.flyTo([lat, lng], 14, {
        duration: 3,
    });

    setTimeout(function () {
        L.popup({ closeButton: false, offset: L.point(0, -8) })
            .setLatLng([lat, lng])
            .setContent(makePopupContent(store))
            .openOn(myMap);
    }, 3000);
}