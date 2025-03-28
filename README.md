# Bug reproduction
## Context

I noticed this issue when 3rd party code slipped into the build of my sveltekit app. I expected production dependencies to be externalized as described here: https://svelte.dev/docs/kit/adapter-node#Deploying

My setup is as follows:
- my-monorepo
  - my-esm-tool (depends on a 3rd party package)
  - my-sveltekit-app with node-adapter (depends on my esm package)

## Reproduction

1. Run `npm install` in `my-monorepo`
2. Run `npm run build` in `my-sveltekit-app`
3. Run `node ./build` in `my-sveltekit-app`

The app will crash because commonjs code cannot run in an esm environment. This would not be an issue if the package is externalized.

You can inspect the build output of `build/server/chunks/hooks.server-*.js` and see that the 3rd party code is present here.

### Notes

Running with `vite dev` or `vite preview` works fine as they do not use the output from `build/`

I created a simple 3rd party package myself (`their-cjs-tool`) and published it to the Github npm registry.

## Cause

The node-adapter will mark all direct dependencies of my-sveltekit-app as external, however this does not take into account the dependencies of a linked dependency (`my-esm-tool`).



## Solution

The following change will instead externalize everything from the `node_modules` directory, which fixes the issue.

https://github.com/sveltejs/kit/compare/main...resultx-ai:sveltekit:main
