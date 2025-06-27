import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TherapistCareerAssessmentRepository } from './TherapistCareerAssessment.Repository';
import { CreateCareerAssessmentDto } from './dto/CreateCareerAssessmentDto';
import { UpdateCareerAssessmentDto } from './dto/UpdateCareerAssessmentDto';
import { AssignAssessmentDto } from './dto/AssignAssessmentDto';
import { CareerAssessment, CareerAssessmentAssignment } from '../../entities';
import {
  AssessmentStatus,
  QuestionType,
} from '../../entities/CareerAssessment.Entity';
import { AssignmentStatus } from '../../entities/CareerAssessmentAssignment.Entity';

@Injectable()
export class TherapistCareerAssessmentService {
  constructor(
    private readonly repository: TherapistCareerAssessmentRepository,
  ) {}

  // Assessment Management
  async createAssessment(
    createDto: CreateCareerAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessment> {
    return await this.repository.createAssessment(createDto, therapistId);
  }

  async createFromTemplate(
    templateName: string,
    therapistId: string,
    customTitle?: string,
  ): Promise<CareerAssessment> {
    const template = this.getAssessmentTemplate(templateName);

    const createDto: CreateCareerAssessmentDto = {
      title: customTitle || template.title,
      description: template.description,
      instructions: template.instructions,
      questions: template.questions,
      categories: template.categories,
      tags: template.tags,
      estimatedTimeMinutes: template.estimatedTimeMinutes,
      status: AssessmentStatus.DRAFT,
    };

    return await this.repository.createAssessment(createDto, therapistId);
  }

  async findAllAssessments(therapistId: string): Promise<CareerAssessment[]> {
    return await this.repository.findAllByTherapistId(therapistId);
  }

  async findAssessmentById(
    id: string,
    therapistId: string,
  ): Promise<CareerAssessment> {
    const assessment = await this.repository.findOneByIdAndTherapistId(
      id,
      therapistId,
    );
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return assessment;
  }

  async updateAssessment(
    id: string,
    updateDto: UpdateCareerAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessment> {
    const assessment = await this.findAssessmentById(id, therapistId);

    // Check if assessment is already active and has assignments
    if (assessment.status === AssessmentStatus.ACTIVE && updateDto.questions) {
      const assignments = await this.repository.findAssignmentsByAssessmentId(
        id,
        therapistId,
      );
      if (assignments.length > 0) {
        throw new BadRequestException(
          'Cannot modify questions of an active assessment that has been assigned to users',
        );
      }
    }

    const updatedAssessment = await this.repository.updateAssessment(
      id,
      updateDto,
      therapistId,
    );
    if (!updatedAssessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return updatedAssessment;
  }

  async deleteAssessment(id: string, therapistId: string): Promise<void> {
    await this.findAssessmentById(id, therapistId);

    // Check if assessment has assignments
    const assignments = await this.repository.findAssignmentsByAssessmentId(
      id,
      therapistId,
    );
    if (assignments.length > 0) {
      throw new BadRequestException(
        'Cannot delete assessment that has been assigned to users',
      );
    }

    await this.repository.deleteAssessment(id, therapistId);
  }

  async activateAssessment(
    id: string,
    therapistId: string,
  ): Promise<CareerAssessment> {
    return await this.updateAssessment(
      id,
      { status: AssessmentStatus.ACTIVE },
      therapistId,
    );
  }

  async archiveAssessment(
    id: string,
    therapistId: string,
  ): Promise<CareerAssessment> {
    return await this.updateAssessment(
      id,
      { status: AssessmentStatus.ARCHIVED },
      therapistId,
    );
  }

  // Assignment Management
  async assignAssessment(
    assignDto: AssignAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    const assessment = await this.findAssessmentById(
      assignDto.assessmentId,
      therapistId,
    );

    if (assessment.status !== AssessmentStatus.ACTIVE) {
      throw new BadRequestException(
        'Only active assessments can be assigned to users',
      );
    }

    return await this.repository.assignAssessment(assignDto, therapistId);
  }

  async findAllAssignments(
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.repository.findAssignmentsByTherapistId(therapistId);
  }

  async findAssignmentsByAssessment(
    assessmentId: string,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.repository.findAssignmentsByAssessmentId(
      assessmentId,
      therapistId,
    );
  }

  async findAssignmentsByStatus(
    status: AssignmentStatus,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.repository.findAssignmentsByStatus(therapistId, status);
  }

  async updateAssignmentStatus(
    assignmentId: string,
    status: AssignmentStatus,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment> {
    const assignment = await this.repository.updateAssignmentStatus(
      assignmentId,
      status,
      therapistId,
    );

    if (!assignment) {
      throw new NotFoundException(
        `Assignment with ID ${assignmentId} not found`,
      );
    }

    return assignment;
  }

  // Statistics
  async getAssessmentStats(therapistId: string) {
    return await this.repository.getAssessmentStats(therapistId);
  }

  async getOverdueAssignments(
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.repository.findOverdueAssignments(therapistId);
  }

  // Assessment Templates
  getAvailableTemplates(): string[] {
    return [
      'career_exploration',
      'life_goals',
      'skills_assessment',
      'career_transition',
      'comprehensive',
    ];
  }

  private getAssessmentTemplate(
    templateName: string,
  ): CreateCareerAssessmentDto {
    const templates = {
      career_exploration: {
        title: 'Career Exploration Assessment',
        description:
          'Explore your career interests, values, and potential paths',
        instructions:
          'Answer each question thoughtfully. There are no right or wrong answers.',
        estimatedTimeMinutes: 25,
        categories: ['career_interests', 'values', 'work_environment'],
        tags: ['career', 'exploration', 'interests'],
        questions: [
          {
            question:
              'What activities make you feel most energized and engaged?',
            type: QuestionType.TEXT,
            required: true,
            order: 1,
            category: 'career_interests',
          },
          {
            question: 'Which work environment appeals to you most?',
            type: QuestionType.SINGLE_CHOICE,
            options: [
              'Office setting',
              'Remote work',
              'Outdoors',
              'Laboratory',
              'Clinical setting',
              'Varied locations',
            ],
            required: true,
            order: 2,
            category: 'work_environment',
          },
          {
            question: 'What values are most important to you in your career?',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              'Work-life balance',
              'High income',
              'Helping others',
              'Creative expression',
              'Job security',
              'Leadership opportunities',
              'Continuous learning',
            ],
            required: true,
            order: 3,
            category: 'values',
          },
          {
            question:
              'On a scale of 1-10, how important is career advancement to you?',
            type: QuestionType.SCALE,
            required: true,
            order: 4,
            category: 'values',
          },
          {
            question: 'Describe your ideal workday in detail.',
            type: QuestionType.TEXT,
            required: true,
            order: 5,
            category: 'career_interests',
          },
        ],
      },
      life_goals: {
        title: 'Life Goals and Vision Assessment',
        description: 'Clarify your long-term life goals and personal vision',
        instructions:
          'Reflect deeply on your aspirations and be honest about your desires.',
        estimatedTimeMinutes: 30,
        categories: ['life_vision', 'personal_goals', 'relationships'],
        tags: ['life', 'goals', 'vision', 'personal'],
        questions: [
          {
            question: 'Where do you see yourself in 10 years?',
            type: QuestionType.TEXT,
            required: true,
            order: 1,
            category: 'life_vision',
          },
          {
            question: 'What legacy do you want to leave behind?',
            type: QuestionType.TEXT,
            required: true,
            order: 2,
            category: 'life_vision',
          },
          {
            question: 'Which life areas are most important to you?',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              'Career/Professional',
              'Family/Relationships',
              'Health/Wellness',
              'Financial security',
              'Personal growth',
              'Community involvement',
              'Spirituality',
            ],
            required: true,
            order: 3,
            category: 'personal_goals',
          },
          {
            question: 'Are you satisfied with your current work-life balance?',
            type: QuestionType.YES_NO,
            required: true,
            order: 4,
            category: 'personal_goals',
          },
          {
            question:
              'What obstacles are currently preventing you from achieving your goals?',
            type: QuestionType.TEXT,
            required: true,
            order: 5,
            category: 'personal_goals',
          },
        ],
      },
      comprehensive: {
        title: 'Comprehensive Career & Life Assessment',
        description:
          'A thorough evaluation of career interests, life goals, skills, and values',
        instructions:
          'This comprehensive assessment will take about 45 minutes. Please set aside adequate time and answer honestly.',
        estimatedTimeMinutes: 45,
        categories: [
          'career_interests',
          'life_vision',
          'skills',
          'values',
          'personality',
        ],
        tags: ['comprehensive', 'career', 'life', 'assessment'],
        questions: [
          {
            question: 'What are your top 3 career interests?',
            type: QuestionType.TEXT,
            required: true,
            order: 1,
            category: 'career_interests',
          },
          {
            question:
              'Rate your satisfaction with your current career path (1-10)',
            type: QuestionType.SCALE,
            required: true,
            order: 2,
            category: 'career_interests',
          },
          {
            question: 'What are your strongest skills?',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              'Communication',
              'Leadership',
              'Technical skills',
              'Creative problem solving',
              'Analytical thinking',
              'Project management',
              'Teamwork',
              'Innovation',
            ],
            required: true,
            order: 3,
            category: 'skills',
          },
          {
            question: 'Describe your ideal life 5 years from now.',
            type: QuestionType.TEXT,
            required: true,
            order: 4,
            category: 'life_vision',
          },
          {
            question: 'Do you prefer working independently or in teams?',
            type: QuestionType.SINGLE_CHOICE,
            options: [
              'Strongly prefer independent work',
              'Prefer independent work',
              'No preference',
              'Prefer team work',
              'Strongly prefer team work',
            ],
            required: true,
            order: 5,
            category: 'personality',
          },
        ],
      },
    };

    const template = templates[templateName];
    if (!template) {
      throw new BadRequestException(`Template '${templateName}' not found`);
    }

    return template;
  }
}
