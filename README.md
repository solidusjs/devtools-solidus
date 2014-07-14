A Google Chrome developer tools extension for use by [Solidus](https://github.com/solidusjs/solidus) developers. Provides real-time introspection of API data and access to Solidus server error logs for use in debugging preprocessors executed in the Node.js runtime environment.

#Clone
* Clone the repo with `git clone https://github.com/solidusjs/devtools-solidus.git devtools-solidus`

#Installation
* Find the `.crx` file you want in the `dist/` directory. We recommend using the latest version, or you can manually build your own (see below).
* Open <chrome://extensions> in Chrome
* Drag and drop the `.crx` file onto the page and click "Add" to install.

#Manually Build
* Run `npm install` to install dependencies (npm will automatically run a script to install front-end dependencies using bower).
* Run `grunt build` to generate an installable `.crx` file in the `dist/` directory.

#Usage
* Once the extension is installed, you can open Chrome's Developer Tools and you should see a "Solidus" tab.