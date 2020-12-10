# Enabling Hot Reload

Hot reloading is a feature that is opt-in at the moment. This is because this feature needs to know the url of the server being used for development.

Developers might setup their server in many different ways so this needs to be configured when installing Hozokit in order to take advantage of this feature.

> To setup and install Hozokit, please follow the setup section of the README before following this guide.

## Configure your proxy

Follow these steps if hot reloading is something you would like to enable.

1. Find the url of you local Wordpress instalation for your project. This will be `localhost:3000` in a lot of cases but it could also be something custom such as `hozokit.test`
2. Set `APP_URL` to the server url at the `.env` file, located at the theme folder directory. An `.env.example` is provided for reference. The `http://` or `https://` portion needs to be included.

Here's how a setup for hot reloading can look like in `.env`: 

```php
APP_ENVIRONMENT='development'

# Add your development URL here to make use of hot reloading.
APP_URL='https://hozokit.test'
```

3. Run `npm start` to start watching files. Every time a file is saved it should reload the page. 

The url to access the site will be `http://localhost:2077` even if it wasn't before hot reloading was enabled. This is correct, it means browser-sync is working correctly.

In some cases the browser might issue a warning suggesting that the connection is not secure. this happens due an invalid SSL certificates but it does not impact how the sites locally in any way.

To get past the warning screen browsers provide the option of adding an exception for the site or an *"enter site"* link.

## What happens when hot reloading is not configured

This is the default, and it won't break anything. When `browserSyncProxy` is set to `null`, the following message will be displayed in the terminal:

```bash
🛑 Hot reloading is not available. Add the address of your server to browserSyncProxy in gulpfile.js
Find examples of proxies at: https://www.browsersync.io/docs/options/#option-proxy
Files will still be watched and compiled.
```

This means hot reloading will be disabled but files will still be watched as changes are made.