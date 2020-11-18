# Enabling Hot Reloading

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

> The url on the browser might be `http://localhost:3000` even if it wasn't before hot reloading was enabled. This is correct, as it is browser-sync establishing the proxy.