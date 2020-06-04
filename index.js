
var map;
var markers = [];
var infoWindow;
function initMap() {
    var london = {
        lat: 51.509865, 
        lng: -0.118092
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: london,
        zoom: 8
    });
    infoWindow = new google.maps.InfoWindow();
    searchClubs();
}


function searchClubs() {
    var foundClubs = [];
    var postCode = document.getElementById('postcode-code-input').value;
    if (postCode) {
        clubs.forEach(function (club) {
            var postal = club.address.postalCode;
            if (postal == postCode) {
                foundClubs.push(club);
            }
        });
    } else {
        foundClubs = clubs;
    }
    clearLocations()
    displayClubs(foundClubs);
    showClubsMarkers(foundClubs);
    setOnClickListener();
}


function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}


function setOnClickListener() {
    var clubElements = document.querySelectorAll('.store-container');
    clubElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function displayClubs(clubs) {
    var clubsHtml = "";
    clubs.forEach(function (club, index) {
        console.log("entered displaystores()")
        //var address = store.addressLines;
        
        //var address1 = store.address.streetAddressLine1;
        var name = club.name;
        var phone = club.phoneNumber;
        var stadium = club.stadium;
        clubsHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${name}</span>
                            <span>${stadium}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `
    });
    document.querySelector('.stores-list').innerHTML = clubsHtml;
}


function showClubsMarkers(clubs) {
    var bounds = new google.maps.LatLngBounds();
    clubs.forEach(function (club, index) {
        var latlng = new google.maps.LatLng(
            club.coordinates.latitude,
            club.coordinates.longitude);
        var name = club.name;
        var address = club.address.streetAddressLine1;
        var photo = club.photo;
       // var statusText = store.openStatusText;
        var phone = club.phoneNumber;
        bounds.extend(latlng);
        createMarker(latlng, name, address, phone, photo, index);
    })
    map.fitBounds(bounds);
}


function createMarker(latlng, name, address, phone, photo, index) {
    var html = `
        <div class="store-info-container">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phone}
            </div>
        </div>
        <div ><img class="club-stadium-photo" src="${photo}" alt="Italian Trulli"></div>
    `;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${index + 1}`
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}

