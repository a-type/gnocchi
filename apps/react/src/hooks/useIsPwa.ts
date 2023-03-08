export function useIsPwa() {
	return window.matchMedia('(display-mode: standalone)').matches;
}
