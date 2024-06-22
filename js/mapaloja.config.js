'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/mapbox/streets-v12',
  // style: 'mapbox://styles/lucaslago/clxqgg73103bw01qjf4dyfucw',
  accessToken:
    'pk.eyJ1IjoibHVjYXNsYWdvIiwiYSI6ImNseHFmMW92eDBhbHcya29qZTdnY2NjOXEifQ.kubyan0dGC6Gpff6NrhS1g',
  CSV: '../mapaloja/TesteConsolidada.csv',
  center: [-50.6243406053739, -30.7589831083562],
  zoom: 6.5,
  flyzoom: 7.5,
  geocoderzoom: 7.5,
  flyspeed: 1,
  flycurve: 1.3,
  title: 'Busca',
  description:
    '',
  sideBarInfo: ['Nome', 'Produtos', 'Regiao', 'distance', 'Contato', 'whats'],
  popupInfo: ['Nome',],
  popupTxt:{
    linkTelegram: 'Compre pelo Telegram!',
    linkWhatsapp: 'Compre pelo Whatsapp',
    msgWhats: 'Te encontrei no CaipiratechLAB e eu tenho interesse em comprar de você',
    inativo: 'INATIVO',
    //msgWhatsFormated: 'Te%20encontrei%20no%20CaipiratechLAB%20e%20eu%20tenho%20interesse%20em%20comprar%20de%20voc%C3%AA',
  },
  searchBarTxT:{
    notFound: 'Nenhum resultado encontrado.',
    distance: 'Distância aprox.',
    distanceLess20: ' menos de 20 metros',
    geocoderPlaceholder: 'Busca por localização',
    showFilters: "Mostrar Filtros", //igual está no layout lojaonline.html
    hideFilters: "Ocultar Filtros", //igual está no layout lojaonline.html

  },
  filters: [
    {
      type: 'dropdown',
      title: 'Exibir apenas ativos? ',
      columnHeader: 'AtivoTeste', // Case sensitive - must match spreadsheet entry
      listItems: ['Sim'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
    {
      type: 'checkbox',
      title: 'Região: ',
      columnHeader: 'Regiao', // Case sensitive - must match spreadsheet entry
      listItems: ['Serra da Mantiqueira', 'Vale do Paraíba', 'Serra do Mar', 'Serra da Bocaina', 'Vale do Café'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
    {
      type: 'text',
      title: 'Produtos/Produtor: ',
      columnHeader: 'Produtos',
      placeholder: 'Digite aqui',
      id: 'produtos',
    },
    
  ],
  baseURL: '../',
};
