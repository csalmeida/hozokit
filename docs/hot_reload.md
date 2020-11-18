# Enabling Hot Reload

Hot reloading is a feature that is opt-in at the moment. This is because this feature needs to know the url of the server.
Developers might setup their server differently so this needs to be configured when installing Hozokit.

> Please follow the setup section of the README before following this guide.

## Configure your proxy

Follow these steps if hot reloading is something you would like to enable.

1. Find the url of you local Wordpress instalation for your project. This will be `localhost:3000` in a lot of cases but it could also be something custom such as `hozokit.test`
2. Set that url without the `http://` as a value of `browserSyncProxy`. This variable can be found in `gulpfile.js`.

Here's how a proxy value can look like in `gulpfile.js`: 

```javascript
const browserSyncProxy = 'localhost:3000'
```

3. Run `npm start` to start watching files. Every time a file is saved it should reload the page. 

> The url on the browser might be `http://localhost:2077` even if it wasn't before hot reloading was enabled. This is correct, it means browser-sync is working correctly.

## What happens when hot reloading is not configured

This is the default, and it won't break anything. When `browserSyncProxy` is set to `null`, the following message will be displayed in the terminal:

```bash
🛑 Hot reloading is not available. Add the address of your server to browserSyncProxy in gulpfile.js
Find examples of proxies at: https://www.browsersync.io/docs/options/#option-proxy
Files will still be watched and compiled.
```

This means hot reloading will be disabled but files will still be watched as changes are made.