export type InboxNotificationType =
  | "TICKET_CREATED"
  | "TICKET_ASSIGNED"
  | "TICKET_RESOLVED";

export interface InboxNotification {
  id: string;
  type: InboxNotificationType;
  title: string;
  body: string;
  ticketId: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface InboxResponse {
  unreadCount: number;
  items: InboxNotification[];
}
