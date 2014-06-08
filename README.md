
## Global Application State

- Tricky to name because of the props/state React conventions.

- Component state (e.g. search term) should be ‘owned’ by a single component far enough up the tree that it owns every component needing the state.
- React suggests a callback for updating this state should be passed down to the children - this would be a Bacon Bus (event channel).
