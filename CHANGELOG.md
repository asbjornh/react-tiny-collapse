# Changelog

## 1.2.0

Adds `react@^18.0.0` and `react-dom@^18.0.0` as peer dependencies

## 1.1.0

Adds `react@^17.0.0` and `react-dom@^17.0.0` as peer dependencies

## 1.0.0

- Adds changelog! 🙈
- Adds support for using `style` in `componentProps`. Inline styles set by `react-tiny-collapse` will override user styles when there's a collision.
- Adds support for using function components using `React.forwardRef` as `component`

### BREAKING CHANGES:

- Renames `unmountClosed` to `unmountChildren`
- Makes `false` the default value for `unmountChildren`
- Makes `false` the default value for `animateChildren`

`unmountClosed` was a confusing name, and options that default to `true` are not nice.
