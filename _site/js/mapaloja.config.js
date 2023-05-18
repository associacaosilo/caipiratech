'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/saralgc/ckw22a9h70g4g14o4pum58wg3',
  accessToken:
    'pk.eyJ1Ijoic2FyYWxnYyIsImEiOiJja2NjbTAyczkwNXA3Mnlscm5nbjN5OHZiIn0.yNcJkPBSugRlIeGkXDRlZw',
  CSV: 'https://docs.google.com/spreadsheets/d/1rl6UdVfPrRPKdOUZxplgmhq1BQKK8chtAVL6pOQ_GFE/gviz/tq?tqx=out:csv&sheet=Loja',
  center: [-44.542976, -22.503782],
  zoom: 7.5,
  flyzoom: 7.5,
  geocoderzoom: 7.5,
  flyspeed: 0.3,
  flycurve: 1.3,
  title: 'Filtros e Resultados',
  description:
    '',
  sideBarInfo: ['Nome', 'Produtos', 'Regiao', 'distance',],
  popupInfo: ['Nome',],
  filters: [
    {
      type: 'checkbox',
      title: 'Região: ',
      columnHeader: 'Regiao', // Case sensitive - must match spreadsheet entry
      listItems: ['Serra da Mantiqueira', 'Vale do Paraíba', 'Serra do Mar', 'Serra da Bocaina', 'Vale do Café'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
    {
      type: 'text',
      title: 'Produtos: ',
      columnHeader: 'Produtos',
      placeholder: 'Digite aqui',
      id: 'produtos',
    },
  ],
  baseURL: '../',
};
