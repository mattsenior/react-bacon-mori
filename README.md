```sh
npm install
npm start
```

Enable LiveReload extension in browser.


The rest of this is just notes.

## Influences

### Om/Mori

- One immutable global state object, with `shouldComponentUpdate` checking for referential equality of the state ‘cursor(s)’ given to it.
- requestAnimationFrame batching.

### Bacon.js

- Bacon.model’s functional lenses are similar to the way Om’s cursors work - you can create a subset of a given object, which remains connected to its parent, but subcomponents that render the data don’t need to know anything about the rest of the state tree.
- I was also thinking about using Bacon buses for managing React component ‘state’ (not props). On the React site it talks about dealing with component state, and how it should be owned by a shared component high enough up the tree to be an owner of every component that needs it. At this point, sending state down to subcomponents is handled by React, but sending state changes back up to the owning component could be handled with a Bacon bus.

### Fluxxor

- Facebook’s Flux’s single event dispatcher and one-way flow makes a lot of sense. In the same way that you create `core.async` channels and pass them into Om components, we could use a Bacon bus passed down to each component for sending actions through.
