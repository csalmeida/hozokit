# Creating Custom Blocks

**🚩 Important:** Advanced Custom Fields PRO [is required to develop custom blocks](https://www.advancedcustomfields.com/resources/blocks/) in Hozokit.  

Gutenberg has become the default editor for Wordpress in favour of it's previous iteration where markup and text would all go in a single text area element. Gutenberg relies on blocks and typically these would be written in React.

In this case ACF is used to register custom blocks using custom fields, removing the need to write them in React. ACF PRO is [required to develop custom custom blocks](https://www.advancedcustomfields.com/resources/blocks/).

## Creating a custom block in Hozokit

To create a custom block, there are a few steps that need to be followed:

1. [Verify if the ACF PRO plugin is active.](#verify-if-the-acf-pro-plugin-is-active)
1. [Register the block.](#register-the-block)
1. [Create markup files for the block.](#create-markup-files-for-the-block)
1. [Add block as an ACF field.](#add-block-as-an-acf-field)

We'll go through each step, along with example to create a custom block.

### Verify if the ACF PRO plugin is active

The first step is to make sure ACF PRO is one of your active plugins. Navigate to Wordpress' admin panel and select plugins on the left hand side menu.

Once plugins are listed, ACF PRO should be listed as well but if not [please install it](https://www.advancedcustomfields.com/resources/upgrade-guide-acf-pro/) before moving to the next steps.

If it is installed, activate the plugin. Once activated it's ready to go.

### Register the block

Each block must be registered in Hozokit in order to be made available in Gutenberg.

Open [`wp-content/themes/hozokit/plugins/blocks/blocks.php`](../wp-content/themes/hozokit/plugins/blocks/blocks.php) in your editor, this is the file where all custom blocks are described. In its current state, it should look similar to the following:

```php
// A Hozokit function to used to render a block.
$render_callback = 'hozokit_block_render';

// The description of a block.
$example_block = array(
  'name'            => 'example-block',
  'key'	            => 'example-block',
  'title'           => __('Example'),
  'description'     => __("Renders an example block with text."),
  'render_callback' => $render_callback,
  'category'        => 'hozokit',
  'icon'            => 'admin-comments',
  'keywords'        => array( 'example', 'content' ),
);

// An array where all custom blocks are added to.
$blocks = array(
  $example_block,
  // more blocks here.
);
```

Let's go through each part of the file. The first element is `$render_callback`, it makes of a hozokit function (`hozokit_block_render`) that makes sure the block is setup and it looks for a it's `.twig` template in the correct place. More on this later. This line does not need to be changed.

Next there is a description of a block, each custom block is defined in an array and takes a few parameters. The ones descripted in `$example-block` are enough to start with but [a list of accepted parameters is available in ACF's Documentation](https://www.advancedcustomfields.com/resources/acf_register_block_type/).

The `key` attribute is the one used to find the correct block `.twig` template to render its markup. For example, is a key is set as `example-block` the folder in [`templates/blocks`](../templates/blocks) needs to be named the same. e.g [`templates/blocks/example-block`](../wp-content/themes/hozokit/blocks/example-block)

Finally, there is a `$blocks` array, all blocks described in this file need to be added to it. Adding them here will make sure ACF is aware of them.

### Create markup files for the block

Part of the process of creating a custom block is writting the markup that will get rendered on the page where the block is included.

As mentioned [in the previous section](#register-the-block), the markup of a block will live inside `templates/blocks/you-custom-block`. To add markup to the registered `example-block`, a folder with the same name needs to be created in [`templates/blocks`](../wp-content/themes/hozokit/templates/blocks).

Hozokit will use the name of the `key` defined earlier for the block in `blocks.php` to find the correct template.

Inside the `templates/blocks/example-block` folder two files should be created, an `index.twig` and an `style.scss`. One will house the markup whilst the other will be used for styling.

> Styles get compiled into a single style.css file so it is reccommended that each block and component has its own class.

Let's have a look at each file, `index.twig` will include the html for the component, using Twig:

```twig
{% block example %}
  <section class="example">
    <h1>hozokit</h1>
    <p>An example component.</p>
  </section>
{% endblock %}
```

This markup could be moved into it's own component in [`components/example`](../wp-content/themes/hozokit/components/example), one or multiple components can be included in the file and be interpolated with other tags in `example-block`'s [`index.twig`](../wp-content/themes/hozokit/templates/blocks/example-block/index.twig):

```twig
{# This markup will be rendered in the block. #}
<div class="hozokit-example-block">
  {% include 'example/index.twig' %}

  <div>
      <p>A call to action message.</p>
      {% include 'button/index.twig' %}
  </div>
</div>
```

In the example above the block was developed further to make use of components. An optional Twig block is available to create add extra information when the component is previewed in Gutenberg.

Add the preview block with the desired markup to a `preview.twig` file (located at ) in the block. A preview file is specific to a block and is not available to components.

```twig
{% block preview %}
  {% if is_preview %}
    <section>
      <p>This is an example preview of a block.</p>
    </section>
  {% endif %}
{% endblock %}
```

Then include the preview file in the block template (`index.twig`):

```twig
{# An optional preview file can be included, this will show on Gutenberg only. #}
{% include 'blocks/example-block/preview.twig' %}

{# This markup will be rendered in the block. #}
<div class="hozokit-example-block">
  {% include 'example/index.twig' %}

  <div>
      <p>A call to action message.</p>
      {% include 'button/index.twig' %}
  </div>
</div>
```

Finally styles for the block itself can be added to `style.scss`:

```scss
.hozokit-example-block {
  color: red;
}
```

## Add block as an ACF field

The last step required for the block to be made available in Gutenberg is to create a custom field for the block.

In Wordpress' Dashboard, navigate to _Custom Fields_, and add a new field group. The group may or may not have fields in it. However the Location (show this field group if) must be set to:

```
Block is equal to Example
```

The block will be listed under the Hozokit section in Gutenberg once the field group is published.

If the field group as fields, these can be edited once a block is added in the Gutenberg editor.

The value can then be used in the block as needed with the `fields` associative array.

```twig
{{ fields.field_name }}
```

```twig
<div class="hozokit-example-block">
  {# Makes use of the text field part of the example block. #}
  <h2>{{ fields.text }}</h2>

  {% include 'example/index.twig' %}

  <div>
      <p>A call to action message.</p>
      {% include 'button/index.twig' %}
  </div>
</div>
```

## Conclusion

These are the fundamentals to create custom blocks with Hozokit. Please reach out if there are further questions. Additionally, please feel free to submit a PR to extend this documentation.