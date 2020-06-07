
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
    var postCode = document.getElementById('keyword-input').value; // Get value from search box
    postCode = postCode.toLowerCase();
    console.log("input is " + postCode);
    
    /*if (postCode) {
        clubs.forEach(function (club) {
            var postal = club.name;
            if (postal == postCode) {
                foundClubs.push(club);
            }
        });*/

    if (postCode) {
        clubs.forEach(function (club) {
            if ((postCode == club.name.toLowerCase()) || (postCode == club.stadium.toLowerCase()) ||
                (postCode == club.nickname) || (postCode == club.location)) {
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
    var clubElements = document.querySelectorAll('.club-container');
    clubElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function displayClubs(clubs) {
    var clubsHtml = "";
    clubs.forEach(function (club, index) {
        //console.log("entered displaystores()")
        var name = club.name;
        var badge = club.badge;
        var stadium = club.stadium;

        clubsHtml += `
            <div class="club-container">
                <div class="club-container-background">
                    <div class="club-badge">
                        <img src="${badge}" class="club-badge-image" alt="Badge">
                    </div>
                    <div class="club-info-container">            
                        <div class="club-name">${name}</div>   
                        <div class="club-stadium">${stadium}</div>
                    </div>
                    <div class="club-number-container">
                        <div class="club-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `
    });
    document.querySelector('.clubs-list').innerHTML = clubsHtml;
}


function showClubsMarkers(clubs) {
    var bounds = new google.maps.LatLngBounds();
    clubs.forEach(function (club, index) {
        var latlng = new google.maps.LatLng(
            club.coordinates.latitude,
            club.coordinates.longitude);
        var name = club.name;
        var stadium = club.stadium;
        var photo = club.photo;
        var website = club.website;
        bounds.extend(latlng);
        createMarker(latlng, name, stadium, website, photo, index);
    })
    if (clubs.length >= 2) {
        map.fitBounds(bounds);
    } else {
        //map.fitBounds(bounds);
        //map.setZoom(3);
        
        map.fitBounds(bounds);
        map.setZoom(7);
    }
}


function createMarker(latlng, name, stadium, website, photo, index) {
    var html = `
        <div class="club-info-container">
            <div class="club-info-name">
                ${name}
            </div>
            <div class="club-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${stadium}
            </div>
            <div class="club-info-website">
                <div class="circle">
                    <i class="fas fa-globe"></i>
                </div>
                <a href="${website}" target="_blank">Website</a>
            </div>
        </div>
        <div><img class="club-stadium-photo" src="${photo}" alt="Stadium Photo"></div>
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

