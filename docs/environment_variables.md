# Enabling Environment Variables

Environment variables is a feature that can be optionally enabled in Hozokit.

When enabled, Hozokit will make use of environment variables to configure certain features such as [hot reloading](./hot_reload.md) and change the way assets are bundled (e.g styles and scripts are not minified on a development environment).

Additionally, developers can take advantage of environment variables and access them in `.twig` templates or in their `.php` scripts.


## Setup Environment Variables

1. Create an `.env` file in the [theme folder directory](../wp-content/themes/hozokit). An [`.env.example`](../wp-content/themes/hozokit/.env.example) file is provided as a starting point.

2. Set the app environment. If the value is set to development Hozokit won't minify styles which can be helpful when debugging CSS and JavaScript:

```php
APP_ENVIRONMENT='development'
```

Each environment will have its own `.env`. For example, the production server will have its `APP_ENVIRONMENT` set to `'production'`, staging to `'staging'` and so on. Each version of the site can have its own configuration.

## Using environment variables

Developers can take advantage of environment variables by using them in `.twig` templates and `.php` scripts.

1. Add one or more variables to `.env`:

```php
APP_ENVIRONMENT='development'
API_KEY='m3dMf6XC9NQ^ao8H3csx'
UPDATES_ENABLED=true
```

2. Use a variable on a template. All variables become available to context by accessing `env`:

```twig
{% block example %}
  <section class="example">
    <h1>hozokit</h1>
    <p>An example component.</p>

    {# Makes use of environment variable to determine if markup should be rendered. #}
    {% if env.UPDATES_ENABLED %}
      <ul>
        <li>New shiny colors!</li>
        <li>Orders now get delivered right to your door for free.</li>
        <li>Accounts can be created so users can keep track or their orders.</li>
      </ul>
    {% endif %}
    
  </section>
{% endblock %}
```

3. Use a variable on `functions.php`. In this case a constant is used to get hold of the variable instead:

```php
$payments_key = $_ENV['API_KEY'];
setup_payments($payments_key);
```

## Additional Notes

Hozokit makes use of Vance Lucas' [phpdotenv](https://github.com/vlucas/phpdotenv) to environment variables on the `PHP` side and Scott Motte's [dotenv](https://github.com/motdotla/dotenv) package to make them available in internal Node scripts (`gulpfile.js`).  

