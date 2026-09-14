export function isAppSidebarFocused(): boolean {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) return false;
  if (!activeElement.isConnected) return false;
  return activeElement.closest("[data-app-sidebar]") !== null;
}

export function focusAppSidebar(): void {
  document.querySelector<HTMLElement>("[data-app-sidebar]")?.focus();
}
