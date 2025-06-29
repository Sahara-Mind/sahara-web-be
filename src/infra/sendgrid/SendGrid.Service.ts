import { Injectable } from '@nestjs/common';
import { Client } from '@sendgrid/client';
import * as SendGridMail from '@sendgrid/mail';
import { InfraConfig } from 'src/config/InfraConfig';
import { IEmailAttachment } from 'src/lib/interface/IEmailAttachment';

export type SendGridMailPayload = {
  templateId: string;
  fromEmailAddress?: string | undefined;
  toEmailAddresses: string[];
  body?: any;
  attachments?: IEmailAttachment[];
};

export type SendGridSimpleMailPayload = {
  to: string;
  from: string; // Use the email address or domain you verified above
  subject: string;
  html: string;
  attachments?: IEmailAttachment[];
};

@Injectable()
export class SendGridService {
  constructor() {
    //
  }

  async sendMail(sendGridMailPayload: SendGridMailPayload): Promise<void> {
    try {
      SendGridMail.setClient(new Client());

      if (!InfraConfig.sendGridApiKey) {
        return;
      }

      SendGridMail.setApiKey(InfraConfig.sendGridApiKey);

      for (const email of sendGridMailPayload.toEmailAddresses) {
        try {
          SendGridMail.send({
            to: email,
            from: {
              name: 'Sahara Mind',
              email:
                sendGridMailPayload.fromEmailAddress ?? 'yugal@saharamind.com',
            },
            templateId: sendGridMailPayload.templateId,
            dynamicTemplateData: sendGridMailPayload.body,
          });
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  async sendMailSimple(message: SendGridSimpleMailPayload): Promise<void> {
    try {
      SendGridMail.setClient(new Client());

      if (!InfraConfig.sendGridApiKey) {
        return;
      }

      SendGridMail.setApiKey(InfraConfig.sendGridApiKey);

      SendGridMail.send(message).then(
        () => {
          //
        },
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  }
}
