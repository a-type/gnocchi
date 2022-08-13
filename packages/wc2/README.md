# notes

## What needs to be reactive?

- The props object itself does not (this is not React - components will not be re-rendered with different props)
- Individual props do, if you want them to change and update the UI

## Rendering UI

Basic: non-reactive. Elements are just appended to parents.

```ts
natives.div({
	children: natives.span({
		children: 'Hello World',
	}),
});
```

Reactive: map a reactive value to an element to dynamically change content.

```ts
const loading = reactive(false);
natives.div({
	children: map(loading, (isLoading) => {
		if (isLoading) return 'Loading...';
		return natives.span({
			children: 'Hello World',
		});
	}),
});
```

### Lists of elements
