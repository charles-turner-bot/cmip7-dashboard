export function useNavigationState() {
	return useState<boolean>("navigation:isNavigating", () => false);
}