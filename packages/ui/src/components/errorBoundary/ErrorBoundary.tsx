'use client';
import React, { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
	{
		children: ReactNode;
		fallback?:
			| ReactNode
			| (({
					error,
					clearError,
			  }: {
					error: Error;
					clearError: () => void;
			  }) => ReactNode);
	},
	{ error: Error | null }
> {
	state = {
		error: null,
	};

	shouldComponentUpdate(nextProps: this['props'], nextState: this['state']) {
		return (
			this.props.children !== nextProps.children ||
			this.state.error !== nextState.error ||
			// don't update when fallback function isn't stable
			typeof this.props.fallback !== 'function'
		);
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { error };
	}

	private clearError = () => {
		this.setState({ error: null });
	};

	render() {
		if (this.state.error) {
			if (typeof this.props.fallback === 'function') {
				return this.props.fallback({
					error: this.state.error,
					clearError: this.clearError,
				});
			}
			return this.props.fallback || null;
		}
		return this.props.children;
	}
}
