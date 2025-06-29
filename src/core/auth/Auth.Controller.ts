import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './Auth.Service';
import { LogInDto } from './dto/LoginDto';
import { SendGridService } from '../../infra/sendgrid/SendGrid.Service';
import { EmailTemplateID } from '../../infra/sendgrid/EmailTemplateID';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sendGridService: SendGridService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LogInDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @Get('test-email')
  @ApiOperation({
    summary: 'Test email sending',
    description: 'Send a test welcome email using SendGrid template',
  })
  @ApiResponse({
    status: 200,
    description: 'Test email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'string' },
        templateUsed: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Failed to send test email' })
  async testEmail() {
    try {
      await this.sendGridService.sendMail({
        toEmailAddresses: ['yugalkhati570@gmail.com'],
        templateId: EmailTemplateID.welcomeEmail,
        body: {
          firstName: 'Test User',
          companyName: 'Sahara Mind',
        },
      });

      return {
        message: 'Test welcome email sent successfully',
        status: 'success',
        templateUsed: 'welcomeEmail',
      };
    } catch (error) {
      throw new Error(`Failed to send test email: ${error.message}`);
    }
  }
}
