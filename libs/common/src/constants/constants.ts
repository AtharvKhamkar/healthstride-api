export const RESPONSE_MESSAGE = 'response_message';

export enum ConfigType{
  SMTP='smtp',
  RABBITMQ='rabbitmq',
  STORAGE='storage'
}

export const QueueName = 'healthstride_queue';

export const TopicExchange = 'healthstride_queue.topic.exchange';

export enum MailQueueEvents {
    SEND_WELCOME = 'healthstride.mail.welcome',
    FORGOT_PASSWORD = 'healthstride.mail.forgotpassword',
    EMAIL_VERIFY = 'healthstride.mail.emailverify'
}