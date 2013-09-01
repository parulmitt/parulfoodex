require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    Sockets: '/socket.io/socket.io',
    models: 'models',
    text: '/js/libs/text',
    templates: '../templates',

    ParulFoodexView: '/js/ParulFoodexView'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'ParulFoodex': ['Backbone']
  }
});

require(['ParulFoodex'], function(ParulFoodex) {
  ParulFoodex.initialize();
});
