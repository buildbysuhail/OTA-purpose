export enum NotificationsChannel {
  Sms = 1,
  Whatsapp = 2,
  Email = 3,
  InAppNotification = 4
}

export enum NotificationsProvider {
  TwillioSms = 1,
  TwillioWhatsapp = 2,
  Smtp = 3,
  SmsGateway,
  LinkWhatsapp
}