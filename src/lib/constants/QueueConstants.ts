export const QUEUE_NAMES = {
  EMAIL_NOTIFICATIONS: 'email-notifications',
  // Future queue names can be added here
  // FILE_PROCESSING: 'file-processing',
  // DATA_SYNC: 'data-sync',
  // SCHEDULED_TASKS: 'scheduled-tasks',
} as const;

export const QUEUE_JOB_TYPES = {
  EMAIL: {
    SEND_EMAIL: 'send-email',
    SEND_TEMPLATE_EMAIL: 'send-template-email',
  },
  // Future job types can be added here
  // FILE: {
  //   PROCESS_UPLOAD: 'process-upload',
  //   GENERATE_THUMBNAIL: 'generate-thumbnail',
  // },
} as const;
