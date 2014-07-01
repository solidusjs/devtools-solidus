A Google Chrome developer tools extension for use by [Solidus](https://github.com/solidusjs/solidus) developers. Provides real-time introspection of API data and access to Solidus server error logs for use in debugging preprocessors executed in the Node.js runtime environment.

**Note:** This is still a work in progress, use at your own risk.

#Build
* Clone the repo with
* Run `npm install` to install dependencies
* (Optional) Chrome will complain about `.pem` files in some of the dependencies, so you can manually delete `node_modules/socket.io-client/node_modules/engine.io-client/node_modules/ws/test/` to prevent Chrome from warning you when you install the extension.

#Installation
* Open chrome://extensions
* Enable 'Developer Mode' checkbox
* Click 'Load unpacked extensions...'
* Select the `devtools-solidus` folder
