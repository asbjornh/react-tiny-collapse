# react-tiny-collapse

[![npm version](https://img.shields.io/npm/v/react-tiny-collapse.svg?style=flat)](https://www.npmjs.com/package/react-tiny-collapse)

TinyCollapse is a lightweight component for making animated expand / collapse components. It measures the height and applies it inline so you can add a transition (works when children change too).


### Browser support:
TinyCollapse needs `requestAnimationFrame` in order to do its thing, so make sure to add polyfills if you need to support older browsers (like IE9 and below).


### Why it exists
I really like [react-collapse](https://github.com/nkbt/react-collapse) and I've used it a lot. It does have some drawbacks though, such as being dependent on [react-motion](https://github.com/chenglou/react-motion) and not playing nice with server side rendering (as of v4). I wanted to create a more lightweight alternative.

### Other Tiny libraries

* [react-tiny-transition](https://github.com/asbjornh/react-tiny-transition)
* [react-tiny-crossfade](https://github.com/asbjornh/react-tiny-crossfade)


## Install

```console
npm install --save react-tiny-collapse
```

or

```console
yarn add react-tiny-collapse
```


## Import

```javascript
// in ES5/commonJS
var TinyCollapse = require("react-tiny-collapse").default;

// in ES6
import TinyCollapse from "react-tiny-collapse";
```

## Props:

| Prop         | Type          | Default   | Description                                                                       |
| ------------ | ------------- | --------- | --------------------------------------------------------------------------------- |
| `animateChildren` | Boolean  | true      | Animates height when children changes (set to `false` when nesting collapses)
| `children`   | React element |           | Single React element
| `component`  | String        | "div"     | Type of element used for the wrapper node
| `duration`   | Number        | 500       | The duration of your css transition (milliseconds)
| `forceInitialAnimation` | Boolean | false | Force animation when TinyCollapse mounts
| `isOpen`     | Boolean  | true    | Shows or hides the content
| `unmountClosed` | Boolean | true   | Unmounts children when closed

#### Example usage:

```js
<TinyCollapse className="collapse" isOpen={this.state.isOpen}>
  <div>Content</div>
</TinyCollapse>
```


#### CSS example:

TinyCollapse will only measure and set the height. Transitions must be added with css (`overflow: hidden` and `visibility: hidden` will be added inline when closed or animating)

```css
.collapse {
  transition: height 0.5s;
}
```

#### Nested TinyCollapse

When using nested `TinyCollapse` instances it's a good idea to set `animateChildren` to `false` on the outer one. If you don't, the outer one will measure the wrong height which will result in jaggy animation and clipping of content.
