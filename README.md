# OakEngine Logo

A JavaScript library for creating and animating the OakEngine logo.

## Installation

```bash
npm install oakengine-logo
```

## Usage

### In Browser

```html
<script src="node_modules/oakengine-logo/src/js/oakenginelogo.js"></script>
<script>
  // Create a logo instance
  const logo = new OakEngineLogo('#logo-container', {
    colors: ["#0066cc", "#0077e6", "#0088ff", "#3399ff", "#66b3ff", "#99ccff", "#4d4d4d", "#fff"],
    outerSpeed: 0.3,
    innerSpeed: -0.15,
    size: 250
  });
</script>
```

### In Node.js

```javascript
const OakEngineLogo = require('oakengine-logo');

// Note: The library uses browser-specific APIs for rendering
// In Node.js, you can only access the class and its configuration
const logo = new OakEngineLogo();
console.log(logo.colors);
```

## Configuration Options

- `colors`: Array of 8 colors for the logo layers (default: `["#000", "#fff", "#000", "#fff", "#000", "#fff", "#4F4F4F", "#fff"]`)
- `outerSpeed`: Rotation speed of the outer rings (default: `-0.3`)
- `innerSpeed`: Rotation speed of the inner gear (default: `0.2`)
- `size`: Size of the logo in pixels (default: `200`)

## Methods

- `pause()`: Pause the animation
- `play()`: Resume the animation
- `toggleAnimation()`: Toggle between play and pause
- `updateColors(colors)`: Update the colors of the logo
- `updateSpeeds(outerSpeed, innerSpeed)`: Update the rotation speeds
- `reverse()`: Reverse the rotation direction
- `reset()`: Reset the rotation to the initial position

## License

MIT