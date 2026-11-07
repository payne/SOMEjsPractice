// jQuery UI and its theme, loaded only when a question needs them (chapter 11).
// The theme's icon images are inlined so widgets look right offline and in the sandbox.
import js from 'jquery-ui/dist/jquery-ui.min.js?raw';
import cssText from 'jquery-ui/dist/themes/base/jquery-ui.min.css?raw';
import icon0 from 'jquery-ui/dist/themes/base/images/ui-icons_444444_256x240.png?inline';
import icon1 from 'jquery-ui/dist/themes/base/images/ui-icons_555555_256x240.png?inline';
import icon2 from 'jquery-ui/dist/themes/base/images/ui-icons_777620_256x240.png?inline';
import icon3 from 'jquery-ui/dist/themes/base/images/ui-icons_777777_256x240.png?inline';
import icon4 from 'jquery-ui/dist/themes/base/images/ui-icons_cc0000_256x240.png?inline';
import icon5 from 'jquery-ui/dist/themes/base/images/ui-icons_ffffff_256x240.png?inline';

const icons = {
  'ui-icons_444444_256x240.png': icon0,
  'ui-icons_555555_256x240.png': icon1,
  'ui-icons_777620_256x240.png': icon2,
  'ui-icons_777777_256x240.png': icon3,
  'ui-icons_cc0000_256x240.png': icon4,
  'ui-icons_ffffff_256x240.png': icon5,
};

const css = cssText.replace(/url\("?images\/([^")]+)"?\)/g, (match, name) => (icons[name] ? `url("${icons[name]}")` : match));

export default { js, css, version: '1.14.2' };
