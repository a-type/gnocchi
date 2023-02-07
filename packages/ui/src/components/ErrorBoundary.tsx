import React, { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
	{ children: ReactNode; fallback?: ReactNode },
	{ error: Error | null }
> {
	state = {
		error: null,
	};

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { error };
	}

	render() {
		if (this.state.error) {
			return this.props.fallback || null;
		}
		return this.props.children;
	}
}
