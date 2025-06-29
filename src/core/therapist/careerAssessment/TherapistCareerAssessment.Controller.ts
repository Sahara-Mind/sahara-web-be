import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TherapistCareerAssessmentService } from './TherapistCareerAssessment.Service';
import { CreateCareerAssessmentDto } from './dto/CreateCareerAssessmentDto';
import { UpdateCareerAssessmentDto } from './dto/UpdateCareerAssessmentDto';
import { AssignAssessmentDto } from './dto/AssignAssessmentDto';
import { CareerAssessment, CareerAssessmentAssignment } from '../../entities';
import { AssignmentStatus } from '../../entities/CareerAssessmentAssignment.Entity';
import { CustomAuthGuard } from '../../auth/guards/AuthGuard';

@ApiTags('Therapist - Career Assessments')
@ApiBearerAuth()
@Controller('therapist/career-assessments')
@UseGuards(CustomAuthGuard)
export class TherapistCareerAssessmentController {
  constructor(
    private readonly careerAssessmentService: TherapistCareerAssessmentService,
  ) {}

  // Assessment Management Endpoints

  @Post()
  @ApiOperation({
    summary: 'Create a new career assessment',
    description: 'Creates a new career assessment with custom questions',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment created successfully',
    type: CareerAssessment,
  })
  async createAssessment(
    @Req() req: any,
    @Body() createDto: CreateCareerAssessmentDto,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.createAssessment(
      createDto,
      therapistId,
    );
  }

  @Post('from-template/:templateName')
  @ApiOperation({
    summary: 'Create assessment from template',
    description: 'Creates a new assessment using a predefined template',
  })
  @ApiParam({
    name: 'templateName',
    description: 'Name of the template to use',
    example: 'career_exploration',
  })
  @ApiQuery({
    name: 'title',
    description: 'Custom title for the assessment',
    required: false,
    example: 'My Custom Career Assessment',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment created from template successfully',
    type: CareerAssessment,
  })
  async createFromTemplate(
    @Req() req: any,
    @Param('templateName') templateName: string,
    @Query('title') customTitle?: string,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.createFromTemplate(
      templateName,
      therapistId,
      customTitle,
    );
  }

  @Get('templates')
  @ApiOperation({
    summary: 'Get available assessment templates',
    description: 'Returns a list of available assessment templates',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available templates',
    schema: {
      type: 'array',
      items: { type: 'string' },
      example: ['career_exploration', 'life_goals', 'comprehensive'],
    },
  })
  getAvailableTemplates(): string[] {
    return this.careerAssessmentService.getAvailableTemplates();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all career assessments',
    description: 'Retrieves all career assessments created by the therapist',
  })
  @ApiResponse({
    status: 200,
    description: 'List of career assessments',
    type: [CareerAssessment],
  })
  async findAllAssessments(@Req() req: any): Promise<CareerAssessment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.findAllAssessments(therapistId);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get assessment statistics',
    description: 'Retrieves statistics about assessments and assignments',
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment statistics',
    schema: {
      type: 'object',
      properties: {
        totalAssessments: { type: 'number', example: 15 },
        activeAssessments: { type: 'number', example: 8 },
        totalAssignments: { type: 'number', example: 42 },
        completedAssignments: { type: 'number', example: 25 },
        pendingAssignments: { type: 'number', example: 17 },
      },
    },
  })
  async getAssessmentStats(@Req() req: any) {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.getAssessmentStats(therapistId);
  }

  @Get(':assessmentId')
  @ApiOperation({
    summary: 'Get assessment by ID',
    description: 'Retrieves a specific career assessment by ID',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment details',
    type: CareerAssessment,
  })
  async findAssessmentById(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.findAssessmentById(
      assessmentId,
      therapistId,
    );
  }

  @Put(':assessmentId')
  @ApiOperation({
    summary: 'Update assessment',
    description: 'Updates an existing career assessment',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment updated successfully',
    type: CareerAssessment,
  })
  async updateAssessment(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Body() updateDto: UpdateCareerAssessmentDto,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.updateAssessment(
      assessmentId,
      updateDto,
      therapistId,
    );
  }

  @Delete(':assessmentId')
  @ApiOperation({
    summary: 'Delete assessment',
    description: 'Deletes a career assessment (only if not assigned to users)',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Assessment deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssessment(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<void> {
    const therapistId = req.user.id;
    await this.careerAssessmentService.deleteAssessment(
      assessmentId,
      therapistId,
    );
  }

  @Put(':assessmentId/activate')
  @ApiOperation({
    summary: 'Activate assessment',
    description: 'Activates an assessment making it available for assignment',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment activated successfully',
    type: CareerAssessment,
  })
  async activateAssessment(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.activateAssessment(
      assessmentId,
      therapistId,
    );
  }

  @Put(':assessmentId/archive')
  @ApiOperation({
    summary: 'Archive assessment',
    description: 'Archives an assessment making it inactive',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment archived successfully',
    type: CareerAssessment,
  })
  async archiveAssessment(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<CareerAssessment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.archiveAssessment(
      assessmentId,
      therapistId,
    );
  }

  // Assignment Management Endpoints

  @Post('assign')
  @ApiOperation({
    summary: 'Assign assessment to users',
    description: 'Assigns an active assessment to one or more users',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment assigned successfully',
    type: [CareerAssessmentAssignment],
  })
  async assignAssessment(
    @Req() req: any,
    @Body() assignDto: AssignAssessmentDto,
  ): Promise<CareerAssessmentAssignment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.assignAssessment(
      assignDto,
      therapistId,
    );
  }

  @Get('assignments/all')
  @ApiOperation({
    summary: 'Get all assignments',
    description: 'Retrieves all assessment assignments made by the therapist',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all assignments',
    type: [CareerAssessmentAssignment],
  })
  async findAllAssignments(
    @Req() req: any,
  ): Promise<CareerAssessmentAssignment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.findAllAssignments(therapistId);
  }

  @Get('assignments/overdue')
  @ApiOperation({
    summary: 'Get overdue assignments',
    description: 'Retrieves assignments that are past their due date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of overdue assignments',
    type: [CareerAssessmentAssignment],
  })
  async getOverdueAssignments(
    @Req() req: any,
  ): Promise<CareerAssessmentAssignment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.getOverdueAssignments(
      therapistId,
    );
  }

  @Get('assignments/status/:status')
  @ApiOperation({
    summary: 'Get assignments by status',
    description: 'Retrieves assignments filtered by their status',
  })
  @ApiParam({
    name: 'status',
    description: 'Assignment status',
    enum: AssignmentStatus,
    example: AssignmentStatus.ASSIGNED,
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignments with specified status',
    type: [CareerAssessmentAssignment],
  })
  async findAssignmentsByStatus(
    @Req() req: any,
    @Param('status') status: AssignmentStatus,
  ): Promise<CareerAssessmentAssignment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.findAssignmentsByStatus(
      status,
      therapistId,
    );
  }

  @Get(':assessmentId/assignments')
  @ApiOperation({
    summary: 'Get assignments for assessment',
    description: 'Retrieves all assignments for a specific assessment',
  })
  @ApiParam({
    name: 'assessmentId',
    description: 'Assessment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignments for the assessment',
    type: [CareerAssessmentAssignment],
  })
  async findAssignmentsByAssessment(
    @Req() req: any,
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.findAssignmentsByAssessment(
      assessmentId,
      therapistId,
    );
  }

  @Put('assignments/:assignmentId/status/:status')
  @ApiOperation({
    summary: 'Update assignment status',
    description: 'Updates the status of an assignment',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'status',
    description: 'New assignment status',
    enum: AssignmentStatus,
    example: AssignmentStatus.COMPLETED,
  })
  @ApiResponse({
    status: 200,
    description: 'Assignment status updated successfully',
    type: CareerAssessmentAssignment,
  })
  async updateAssignmentStatus(
    @Req() req: any,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Param('status') status: AssignmentStatus,
  ): Promise<CareerAssessmentAssignment> {
    const therapistId = req.user.id;
    return await this.careerAssessmentService.updateAssignmentStatus(
      assignmentId,
      status,
      therapistId,
    );
  }
}
