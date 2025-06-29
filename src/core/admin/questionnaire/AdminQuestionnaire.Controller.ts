import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminQuestionnaireService } from './AdminQuestionnaire.Service';
import { CreateQuestionnaireDto } from './dto/CreateQuestionnaireDto';
import { UpdateQuestionnaireDto } from './dto/UpdateQuestionnaireDto';
import { FilterQuestionnaireDto } from './dto/FilterQuestionnaireDto';
import { Questionnaire } from '../../entities/Questionnaire.Entity';

@ApiTags('Admin - Questionnaires')
@Controller('admin/questionnaires')
export class AdminQuestionnaireController {
  constructor(
    private readonly adminQuestionnaireService: AdminQuestionnaireService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new questionnaire' })
  @ApiResponse({
    status: 201,
    description: 'The questionnaire has been successfully created.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.create(createQuestionnaireDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questionnaires with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of questionnaires retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Questionnaire' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(@Query() filterDto: FilterQuestionnaireDto) {
    return await this.adminQuestionnaireService.findAll(filterDto);
  }

  @Get(':questionnaireId')
  @ApiOperation({ summary: 'Get a questionnaire by ID' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire retrieved successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async findOne(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.findOne(questionnaireId);
  }

  @Patch(':questionnaireId')
  @ApiOperation({ summary: 'Update a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire updated successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async update(
    @Param('questionnaireId') questionnaireId: string,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.update(
      questionnaireId,
      updateQuestionnaireDto,
    );
  }

  @Delete(':questionnaireId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 204,
    description: 'Questionnaire deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async remove(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<void> {
    return await this.adminQuestionnaireService.remove(questionnaireId);
  }

  @Patch(':questionnaireId/publish')
  @ApiOperation({ summary: 'Publish a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire published successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async publish(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.publish(questionnaireId);
  }

  @Patch(':questionnaireId/unpublish')
  @ApiOperation({ summary: 'Unpublish a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire unpublished successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async unpublish(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.unpublish(questionnaireId);
  }

  @Patch(':questionnaireId/activate')
  @ApiOperation({ summary: 'Activate a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire activated successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async activate(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.activate(questionnaireId);
  }

  @Patch(':questionnaireId/deactivate')
  @ApiOperation({ summary: 'Deactivate a questionnaire' })
  @ApiParam({ name: 'questionnaireId', description: 'Questionnaire ID' })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire deactivated successfully.',
    type: Questionnaire,
  })
  @ApiResponse({ status: 404, description: 'Questionnaire not found.' })
  async deactivate(
    @Param('questionnaireId') questionnaireId: string,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireService.deactivate(questionnaireId);
  }
}
