Spinner
=======

Because there aren't enough 3d carousels already.

---

This plugin was built to fulfill a very specific design requirement, but it may still be flexible enough to accommodate your needs. It takes a list of image links and turns it into a 3d carousel that can either be rotated using navigation controls (optional) or by clicking on any item in the carousel. Clicking on the central item will open the link on that item.

The plugin is also responsive, including an option to simply disable itself below a specified screen size.

See the example file included for a demo. Styles and image sizes may need to be adjusted to fit your needs.

## Getting started

```html
<div class="spinnerwrapper">
    <ul class="spinner">
        <li>
            <a href="http://somewhere">
                <img src="img/image.png" alt=""/>
                <span class="title">Title</span>
                <span class="btn">View</span>
            </a>
        </li>
        
        (repeat for required number of items)
    </ul>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="jquery.spinner.min.js"></script>
<script>
    window.onload = function() {
        $('.spinnerwrapper').spinner();
    }
</script>
```

## Options

**spinnerheight**: number, the height of the carousel, defaults to 0, which calculates the height automatically

**animspeed**: number, speed of animation, defaults to 500 milliseconds

**disableat**: number, window size below which to turn off the plugin and revert to mobile styles

**linkBtn**: 1 or 0, include a button below the carousel for the active item link

**linkBtnClass**: string, classes to add to the link button

**linkBtnText**: string, text for the link button

**nav**: 1 or 0, include next/prev buttons for the carousel

**navNextText**: string, text for the 'next' button

**navPrevText**: string, text for the 'previous' button

