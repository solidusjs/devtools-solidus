// mocking the Chrome API

chrome = {
  runtime: {
    onConnect: {
      addListener: function(){}
    }
  },
  devtools: {
    panels: {
      create: function(){}
    }
  },
  tabs: {
    onUpdated: {
      addListener: function(){}
    }
  }
};
