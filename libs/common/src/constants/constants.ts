export const RESPONSE_MESSAGE = 'response_message';

export enum ConfigType{
  SMTP='smtp',
  RABBITMQ='rabbitmq',
  STORAGE='storage'
}

export const QueueName = 'lms_queue';

export const TopicExchange = 'lms.topic.exchange';

export enum MailQueueEvents {
    SEND_WELCOME = 'lms.mail.welcome',
    FORGOT_PASSWORD = 'lms.mail.forgotpassword',
    EMAIL_VERIFY = 'lms.mail.emailverify'
}