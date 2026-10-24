import type { NotificationItem } from '../types';

export function markDemoNotificationRead(items: NotificationItem[], id: string): NotificationItem[] {
  return items.map(item => item.id === id ? { ...item, read: true } : item);
}
export function markAllDemoNotificationsRead(items: NotificationItem[]): NotificationItem[] {
  return items.map(item => ({ ...item, read: true }));
}
