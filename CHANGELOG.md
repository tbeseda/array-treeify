# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Non-string labels render instead of disappearing. Any value that isn't an array is stringified, at any depth, and can be a parent node: `treeify(['deploys', [2025, ['spring']]])` renders `2025` with a child.
- `LICENSE` file (MIT). The README had linked to it since the beginning, but it was never committed. It now ships in the npm tarball.
- `exports`, `sideEffects` and `engines` fields in `package.json`.
- Continuous integration on GitHub Actions: tests and build across Node.js 22, 24 and 26.
- This changelog.

### Changed

- **Breaking:** input validation now throws a `TypeError` rather than an `Error`, with a message naming what it received: `array-treeify: expected the first element to be a string, received number (1)`. It used to be `Error: First element must be a string`.
- **Breaking:** input that is not an array now throws instead of returning an empty string. `treeify(null)` used to render nothing at all, which quietly hid the mistake.
- **Breaking:** `treeify([undefined])` now throws. It is the same failure as any other non-string first element, and used to return an empty string.
- **Breaking:** requires Node.js 22 or newer. Node.js 20 reached end of life on 2026-04-30.
- `treeify` accepts numbers, bigints and booleans as labels without a cast.
- Development toolchain: Biome 2 and TypeScript 7. `tsx` is gone — tests are `.ts` files run directly by `node --test` using Node's built-in type stripping, and `npm run typecheck` now covers the test files, which it never did before.

`treeify([])` still returns an empty string.

## [0.1.5] - 2025-05-08

### Changed

- More permissive input type.

## [0.1.4] - 2025-05-07

### Changed

- `TreeInput` accepts an empty array.
- Upgraded dependencies.

## [0.1.3] - 2025-03-30

### Added

- `chars` option for custom tree characters.
- `plain` option for whitespace-only output.

## [0.1.2] - 2025-03-29

### Changed

- Tests are no longer published to npm.

## [0.1.1] - 2025-03-28

### Added

- Initial release.

[Unreleased]: https://github.com/tbeseda/array-treeify/compare/0.1.5...HEAD
[0.1.5]: https://github.com/tbeseda/array-treeify/compare/0.1.4...0.1.5
[0.1.4]: https://github.com/tbeseda/array-treeify/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/tbeseda/array-treeify/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/tbeseda/array-treeify/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/tbeseda/array-treeify/releases/tag/0.1.1
