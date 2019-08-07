export interface INotification{
  id: number;
  ticketId: number;
  userId: number;
  newUserId: number;
  action: number;
  message: string;
}
export interface INotificationData{
  status:boolean;
  Data:INotification[];
}
export interface IResponse{
  messages: string;
  status: boolean;
}
