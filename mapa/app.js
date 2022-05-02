/* global config csv2geojson turf Assembly $ */
'use strict';

mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;

let geojsonData = {};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};

const map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.center,
  zoom: config.zoom,
  transformRequest: transformRequest,
});

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: config.flyzoom,
    speed: config.flyspeed,
    curve: config.flycurve,
    easing(t) {
      return t;
    }
  });
}

function loadCard(currentFeature) {
  var regiao = currentFeature.properties.Regiao;
  var prefixo = "rede_caipiratechlab_"
  
  if(regiao == "Serra da Mantiqueira"){
    prefixo += "ma_";
  }else if(regiao == "Vale do Rio Paraíba"){
    prefixo += "vp_";
  }else if(regiao == "Serra do Mar"){
    prefixo += "sm_";
  }else if(regiao == "Serra da Bocaina"){
    prefixo += "bo_";
  }else{
    prefixo = "";
  }
  
  var imagem = prefixo +  currentFeature.properties.Imagem;
  
  var description = "";
  
  if(currentFeature.properties.Imagem == "embreve"){
    description = '<img src="../media/images/embreve.jpg" class="w-100">';
  }else{
    description = '<a href="'+config.baseURL+'/redes/?img='+imagem+'.jpg"> <img src="../media/images/' + imagem + '.jpg" class="w-100"> </a>';
    
    //teste para exibir lista de produtos como texto abaixo da imagem
    // description = '<a href="'+config.baseURL+'/redes/?img='+imagem+'.jpg"> <img src="../media/images/' + imagem + '.jpg" class="w-100"> </a> <br /> Produtos:<br />' + e.features[0].properties.Produtos; 
    
    //teste para exibir Região como texto abaixo da imagem
    description += '<br /> Região:<br />' + regiao;
       
    //teste para exibir lista de produtos em formato de lista abaixo da imagem
    // description += '<br /> Produtos:<br /> <ul>';
    // var produtos = e.features[0].properties.Produtos;
    // var arrayprodutos = produtos.split(',');
    // $.each(arrayprodutos, function(index, value) {
      // description += "<li>" + value + "</li>";
    // });
    // description += '</ul>';
    
  }
  
  return description;  
}

function sellLinks(currentFeature){
  let retorno = "";
  var whatsapp = currentFeature.properties.Whatsapp;
  if (whatsapp != ""){
    retorno += '<br /> <a class="link-whats" href="http://wa.me/55' + whatsapp + '?text=Te%20encontrei%20no%20CaipiratechLAB%20e%20eu%20tenho%20interesse%20em%20comprar%20de%20você" target="_blank"> <i class="fa fa-whatsapp" aria-hidden="true"></i> Compre pelo Whatsapp!</a>';
  }
  
  var telegram = currentFeature.properties.Telegram;
  if (telegram != ""){
    retorno += '<br /> <a class="link-telegram" href="https://t.me/' + telegram + '" target="_blank"> <i class="fa fa-telegram" aria-hidden="true"></i> Compre pelo Telegram!</a>';
  }
  
  return retorno;  
}

function createPopup(currentFeature) {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popups[0]) popups[0].remove();
  let conteudoPopup = loadCard(currentFeature);
  let links = sellLinks(currentFeature);
  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties[config.popupInfo] + '</h3> <br />' + conteudoPopup + links)
    .addTo(map);
}

function buildLocationList(locationData) {
  /* Add a new listing section to the sidebar. */

  const listings = document.getElementById('listings');
  listings.innerHTML = '';
  locationData.features.forEach((location, i) => {
    const prop = location.properties;

    const listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = 'listing-' + prop.id;

    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('button'));
    link.className = 'title';
    link.id = 'link-' + prop.id;
    link.innerHTML =
      '<p style="line-height: 1.25">' + prop[columnHeaders[0]] + '</p>';

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement('div'));
    details.className = 'content';

    for (let i = 1; i < columnHeaders.length; i++) {
      const div = document.createElement('div');
      if(columnHeaders[i] != 'distance')
      {
        div.innerHTML += "<strong>" + columnHeaders[i] + ": </strong>";
        div.innerHTML += prop[columnHeaders[i]];
      }
      else if(prop[columnHeaders[i]] != undefined)
      {
        div.innerHTML += "<strong>Distância aprox.: </strong>";
        div.innerHTML += prop[columnHeaders[i]];
        div.innerHTML += " m";
      }
      div.className;
      details.appendChild(div);
      
    }

    link.addEventListener('click', function () {
      const clickedListing = location.geometry.coordinates;
      flyToLocation(clickedListing);
      createPopup(location);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

      const divList = document.querySelectorAll('.content');
      const divCount = divList.length;
      for (i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
      }

      for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

function filtroProdutos(){
    var filteredProductsGeojson = {
    type: 'FeatureCollection',
    features: [],
  };
  const value = document.getElementById('produtos').value.trim().toLowerCase();
  if(value){    
    
    let data;
    if (filteredGeojson.features.length > 0) {
      data = filteredGeojson;
    } else {
      data = geojsonData;
    }
    
    //const value = e.target.value.trim().toLowerCase();
    
    let dataCinthia = data;
    console.log(dataCinthia);
    
    const produtosCinthia = dataCinthia.features.map(feature => [feature.properties.Produtos, feature.properties.Nome, feature.properties.id]);

    console.dir(produtosCinthia); 
    
     
    
    let alerta = "Locais que possuem o texto '";
    alerta += value;
    alerta += "' dentro da lista de produtos: \n";
    for (let j = 0; j < produtosCinthia.length; j++) {
      //var produtos2 = produtosCinthia[j][0];
      var produtos2 = produtosCinthia[j][0].trim().toLowerCase();
      if (produtos2.includes(value))
      {
        console.log(produtos2);
        alerta += " - ";
        alerta += produtosCinthia[j][1];
        alerta += "\n";
      }
      else
      {
        delete produtosCinthia[j];
      }
    }
    if(value != "")
    {
      alert(alerta);
    }
    
   
    
    
    produtosCinthia.forEach((filter) => {
      dataCinthia.features.forEach((feature) => {      
        if (feature.properties.id == filter[2]) {
          if (
            filteredProductsGeojson.features.filter(
              (f) => f.properties.id === feature.properties.id,
            ).length === 0
          ) {
            filteredProductsGeojson.features.push(feature);
          }
        }
      });
    });
    
    map.getSource('locationData').setData(filteredProductsGeojson);
    buildLocationList(filteredProductsGeojson);
    
    console.log(filteredProductsGeojson);
          

      
  }

  
}


// Build dropdown list function
// title - the name or 'category' of the selection e.g. 'Languages: '
// defaultValue - the default option for the dropdown list
// listItems - the array of filter items

function buildDropDownList(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('h3');
  filterTitle.innerText = title;
  filterTitle.classList.add('py12', 'txt-bold');
  mainDiv.appendChild(filterTitle);

  const selectContainer = document.createElement('div');
  selectContainer.classList.add('select-container', 'center');

  const dropDown = document.createElement('select');
  dropDown.classList.add('select', 'filter-option');

  const selectArrow = document.createElement('div');
  selectArrow.classList.add('select-arrow');

  const firstOption = document.createElement('option');

  dropDown.appendChild(firstOption);
  selectContainer.appendChild(dropDown);
  selectContainer.appendChild(selectArrow);
  mainDiv.appendChild(selectContainer);

  for (let i = 0; i < listItems.length; i++) {
    const opt = listItems[i];
    const el1 = document.createElement('option');
    el1.textContent = opt;
    el1.value = opt;
    dropDown.appendChild(el1);
  }
  filtersDiv.appendChild(mainDiv);
}

// Build checkbox function
// title - the name or 'category' of the selection e.g. 'Languages: '
// listItems - the array of filter items
// To DO: Clean up code - for every third checkbox, create a div and append new checkboxes to it

function buildCheckbox(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('div');
  const formatcontainer = document.createElement('div');
  filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
  formatcontainer.classList.add(
    'center',
    'flex-parent',
    'flex-parent--column',
    'px3',
    'flex-parent--space-between-main',
  );
  const secondLine = document.createElement('div');
  secondLine.classList.add(
    'center',
    'flex-parent',
    'py12',
    'px3',
    'flex-parent--space-between-main',
  );
  filterTitle.innerText = title;
  mainDiv.appendChild(filterTitle);
  mainDiv.appendChild(formatcontainer);

  for (let i = 0; i < listItems.length; i++) {
    const container = document.createElement('label');

    container.classList.add('checkbox-container');

    const input = document.createElement('input');
    input.classList.add('px12', 'filter-option');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', listItems[i]);
    input.setAttribute('value', listItems[i]);

    const checkboxDiv = document.createElement('div');
    const inputValue = document.createElement('p');
    inputValue.innerText = listItems[i];
    checkboxDiv.classList.add('checkbox', 'mr6');
    checkboxDiv.appendChild(Assembly.createIcon('check'));

    container.appendChild(input);
    container.appendChild(checkboxDiv);
    container.appendChild(inputValue);

    formatcontainer.appendChild(container);
  }
  filtersDiv.appendChild(mainDiv);
}

// Build textInput function
// title - the name or 'category' of the selection e.g. 'Produtos: '
// listItems - the array of filter items

function buildTextInput(title, placeholder, id) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('div');
  const formatcontainer = document.createElement('div');
  filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
  formatcontainer.classList.add(
    'center',
    'flex-parent',
    'flex-parent--column',
    'px3',
    'flex-parent--space-between-main',
  );
  
  filterTitle.innerText = title;
  mainDiv.appendChild(filterTitle);
  mainDiv.appendChild(formatcontainer);


  const input = document.createElement('input');

  input.classList.add('px12', 'filter-option');
  input.setAttribute('type', 'text');
  input.setAttribute('id', id);
  input.setAttribute('placeholder', placeholder);


  formatcontainer.appendChild(input);

  filtersDiv.appendChild(mainDiv);
}

const selectFilters = [];
const checkboxFilters = [];
const textFilters = [];

function createFilterObject(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      checkboxFilters.push(keyValues);
    }
    if (filter.type === 'dropdown') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      selectFilters.push(keyValues);
    }
    if (filter.type === 'text') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      textFilters.push(keyValues);
    }
  });
}

function applyFilters() {
  const filterForm = document.getElementById('filters');

  filterForm.addEventListener('change', function () {
    const filterOptionHTML = this.getElementsByClassName('filter-option');
    const filterOption = [].slice.call(filterOptionHTML);

    const geojSelectFilters = [];
    const geojCheckboxFilters = [];
    const geojTextFilters = [];

    filteredGeojson.features = [];
    // const filteredFeatures = [];
    // filteredGeojson.features = [];

    filterOption.forEach((filter) => {
      if (filter.type === 'checkbox' && filter.checked) {
        checkboxFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojCheckboxFilters.push(geojFilter);
            }
          });
        });
      }
      if (filter.type === 'select-one' && filter.value) {
        selectFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojSelectFilters.push(geojFilter);
            }
          });
        });
      }
      // if (filter.type === 'text' && filter.value) {
        // textFilters.forEach((objs) => {
          // Object.entries(objs).forEach(([, value]) => {
            // if (value.includes(filter.value)) {
              // const geojFilter = [objs.header, filter.value];
              // geojTextFilters.push(geojFilter);
            // }
          // });
        // });
      // }
    });

    if (geojCheckboxFilters.length === 0 && geojSelectFilters.length === 0) {
      geojsonData.features.forEach((feature) => {
        filteredGeojson.features.push(feature);
      });
    } else if (geojCheckboxFilters.length > 0) {
      geojCheckboxFilters.forEach((filter) => {
        geojsonData.features.forEach((feature) => {
          if (feature.properties[filter[0]].includes(filter[1])) {
            if (
              filteredGeojson.features.filter(
                (f) => f.properties.id === feature.properties.id,
              ).length === 0
            ) {
              filteredGeojson.features.push(feature);
            }
          }
        });
      });
      if (geojSelectFilters.length > 0) {
        const removeIds = [];
        filteredGeojson.features.forEach((feature) => {
          let selected = true;
          geojSelectFilters.forEach((filter) => {
            if (
              feature.properties[filter[0]].indexOf(filter[1]) < 0 &&
              selected === true
            ) {
              selected = false;
              removeIds.push(feature.properties.id);
            } else if (selected === false) {
              removeIds.push(feature.properties.id);
            }
          });
        });
        let uniqueRemoveIds = [...new Set(removeIds)];
        uniqueRemoveIds.forEach(function (id) {
          const idx = filteredGeojson.features.findIndex(
            (f) => f.properties.id === id,
          );
          filteredGeojson.features.splice(idx, 1);
        });
      }
    } else {
      geojsonData.features.forEach((feature) => {
        let selected = true;
        geojSelectFilters.forEach((filter) => {
          if (
            !feature.properties[filter[0]].includes(filter[1]) &&
            selected === true
          ) {
            selected = false;
          }
        });
        if (
          selected === true &&
          filteredGeojson.features.filter(
            (f) => f.properties.id === feature.properties.id,
          ).length === 0
        ) {
          filteredGeojson.features.push(feature);
        }
      });
    }
    console.log(filteredGeojson);
    
    
    map.getSource('locationData').setData(filteredGeojson);
    buildLocationList(filteredGeojson);
    
    filtroProdutos();
    
  });
}

function filters(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      buildCheckbox(filter.title, filter.listItems);
    } else if (filter.type === 'dropdown') {
      buildDropDownList(filter.title, filter.listItems);
    } else if (filter.type === 'text') {
      buildTextInput(filter.title, filter.placeholder, filter.id);
    }
  });
}

function removeFilters() {
  const input = document.getElementsByTagName('input');
  const select = document.getElementsByTagName('select');
  const selectOption = [].slice.call(select);
  const checkboxOption = [].slice.call(input);
  filteredGeojson.features = [];
  checkboxOption.forEach((checkbox) => {
    if (checkbox.type === 'checkbox' && checkbox.checked === true) {
      checkbox.checked = false;
    }
  });

  selectOption.forEach((option) => {
    option.selectedIndex = 0;
  });

  map.getSource('locationData').setData(geojsonData);
  buildLocationList(geojsonData);
}

function removeFiltersButton() {
  const removeFilter = document.getElementById('removeFilters');
  removeFilter.addEventListener('click', () => {
    removeFilters();
  });
}

createFilterObject(config.filters);
applyFilters();
filters(config.filters);
removeFiltersButton();

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: true, // Use the geocoder's default marker style
  flyTo:
  {
    zoom: config.flyzoom,
    speed: config.flyspeed,
    curve: config.flycurve,
    easing(t) {
      return t;
    }
  },
  placeholder: 'Busque sua localização',
});

function sortByDistance(selectedPoint) {
  const options = { units: 'meters' };
  let data;
  if (filteredGeojson.features.length > 0) {
    data = filteredGeojson;
  } else {
    data = geojsonData;
  }
  data.features.forEach((data) => {
    Object.defineProperty(data.properties, 'distance', {
      value: turf.distance(selectedPoint, data.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  data.features.sort((a, b) => {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    return 0; // a must be equal to b
  });
  const listings = document.getElementById('listings');
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }
  buildLocationList(data);
}

geocoder.on('result', (ev) => {
  const searchResult = ev.result.geometry;
  //console.log(searchResult);
  sortByDistance(searchResult);
});

map.on('load', () => {
  map.addControl(geocoder, 'top-right');

  // csv2geojson - following the Sheet Mapper tutorial https://www.mapbox.com/impact-tools/sheet-mapper
  console.log('loaded');
  $(document).ready(() => {
    console.log('ready');
    $.ajax({
      type: 'GET',
      url: config.CSV,
      dataType: 'text',
      success: function (csvData) {
        makeGeoJSON(csvData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
      csvData,
      {
        latfield: 'Latitude',
        lonfield: 'Longitude',
        delimiter: ',',
      },
      (err, data) => {
        data.features.forEach((data, i) => {
          data.properties.id = i;
        });

        geojsonData = data;
        // Add the the layer to the map
        map.loadImage('../media/mapa/verde.png',
          function(error, image) {
          if (error) throw error;
          map.addImage('verde', image);
        });
        
        map.addLayer({
          id: 'locationData',
          type: 'circle',
          source: {
            type: 'geojson',
            data: geojsonData,
          },
          paint: {
            'circle-radius': 5, // size of circles
            'circle-color': '#386650', // color of circles
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.7,
          },
        });
      },
    );

    map.on('click', 'locationData', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['locationData'],
      });
      const clickedPoint = features[0].geometry.coordinates;
      flyToLocation(clickedPoint);
      sortByDistance(clickedPoint);
      createPopup(features[0]);
    });

    map.on('mouseenter', 'locationData', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', () => {
      map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
  }
});

// Modal - popup for filtering results
const filterResults = document.getElementById('filterResults');
const exitButton = document.getElementById('exitButton');
const modal = document.getElementById('modal');

filterResults.addEventListener('click', () => {
  modal.classList.remove('hide-visually');
  modal.classList.add('z5');
});

exitButton.addEventListener('click', () => {
  modal.classList.add('hide-visually');
});

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;

function transformRequest(url) {
  const isMapboxRequest =
    url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';
  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
  };
}

// filtroProdutos();
//listando os produtos filtrados em um alerta

// var filteredProductsGeojson = {
  // type: 'FeatureCollection',
  // features: [],
// };

// document.getElementById('produtos').addEventListener('change', (e) => {
  // let data;
  // if (filteredGeojson.features.length > 0) {
    // data = filteredGeojson;
  // } else {
    // data = geojsonData;
  // }
  
  // const value = e.target.value.trim().toLowerCase();
  
  // let dataCinthia = data;
  // console.log(dataCinthia);
  
  // const produtosCinthia = dataCinthia.features.map(feature => [feature.properties.Produtos, feature.properties.Nome, feature.properties.id]);

  // console.dir(produtosCinthia); 
  
   
  
  // let alerta = "Locais que possuem o texto '";
  // alerta += value;
  // alerta += "' dentro da lista de produtos: \n";
  // for (let j = 0; j < produtosCinthia.length; j++) {
    // var produtos2 = produtosCinthia[j][0];
    // if (produtos2.includes(value))
    // {
      // console.log(produtos2);
      // alerta += " - ";
      // alerta += produtosCinthia[j][1];
      // alerta += "\n";
    // }
    // else
    // {
      // delete produtosCinthia[j];
    // }
  // }
  // if(value != "")
  // {
    // alert(alerta);
  // }
  
 
  
  
  // produtosCinthia.forEach((filter) => {
    // dataCinthia.features.forEach((feature) => {      
      // if (feature.properties.id == filter[2]) {
        // if (
          // filteredProductsGeojson.features.filter(
            // (f) => f.properties.id === feature.properties.id,
          // ).length === 0
        // ) {
          // filteredProductsGeojson.features.push(feature);
        // }
      // }
    // });
  // });
  
  // // map.getSource('locationData').setData(filteredProductsGeojson);
  // // buildLocationList(filteredProductsGeojson);
  
  // console.log(filteredProductsGeojson);
        

    
// });

