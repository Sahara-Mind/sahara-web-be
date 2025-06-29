import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerAssessment, CareerAssessmentAssignment } from '../../entities';
import { AssessmentStatus } from '../../entities/CareerAssessment.Entity';
import { AssignmentStatus } from '../../entities/CareerAssessmentAssignment.Entity';
import { CreateCareerAssessmentDto } from './dto/CreateCareerAssessmentDto';
import { UpdateCareerAssessmentDto } from './dto/UpdateCareerAssessmentDto';
import { AssignAssessmentDto } from './dto/AssignAssessmentDto';

@Injectable()
export class TherapistCareerAssessmentRepository {
  constructor(
    @InjectRepository(CareerAssessment)
    private readonly assessmentRepository: Repository<CareerAssessment>,
    @InjectRepository(CareerAssessmentAssignment)
    private readonly assignmentRepository: Repository<CareerAssessmentAssignment>,
  ) {}

  // Career Assessment CRUD Operations
  async createAssessment(
    createDto: CreateCareerAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessment> {
    const assessment = this.assessmentRepository.create({
      ...createDto,
      therapistId,
      questions: createDto.questions.map((q, index) => ({
        ...q,
        id: `q${index + 1}`,
      })),
    });

    return await this.assessmentRepository.save(assessment);
  }

  async findAllByTherapistId(therapistId: string): Promise<CareerAssessment[]> {
    return await this.assessmentRepository.find({
      where: { therapistId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByIdAndTherapistId(
    id: string,
    therapistId: string,
  ): Promise<CareerAssessment | null> {
    return await this.assessmentRepository.findOne({
      where: { id, therapistId },
    });
  }

  async updateAssessment(
    id: string,
    updateDto: UpdateCareerAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessment | null> {
    const updateData = { ...updateDto };

    // Update question IDs if questions are being updated
    if (updateData.questions) {
      updateData.questions = updateData.questions.map((q, index) => ({
        ...q,
        id: `q${index + 1}`,
      }));
    }

    await this.assessmentRepository.update({ id, therapistId }, updateData);
    return await this.findOneByIdAndTherapistId(id, therapistId);
  }

  async deleteAssessment(id: string, therapistId: string): Promise<void> {
    await this.assessmentRepository.delete({ id, therapistId });
  }

  async findActiveAssessmentsByTherapistId(
    therapistId: string,
  ): Promise<CareerAssessment[]> {
    return await this.assessmentRepository.find({
      where: { therapistId, status: AssessmentStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  // Assignment Operations
  async assignAssessment(
    assignDto: AssignAssessmentDto,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    const assignments = assignDto.userIds.map((userId) =>
      this.assignmentRepository.create({
        assessmentId: assignDto.assessmentId,
        userId,
        therapistId,
        dueDate: assignDto.dueDate ? new Date(assignDto.dueDate) : null,
        notes: assignDto.notes,
        priority: assignDto.priority,
      }),
    );

    return await this.assignmentRepository.save(assignments);
  }

  async findAssignmentsByTherapistId(
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.assignmentRepository.find({
      where: { therapistId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAssignmentsByAssessmentId(
    assessmentId: string,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.assignmentRepository.find({
      where: { assessmentId, therapistId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAssignmentsByStatus(
    therapistId: string,
    status: AssignmentStatus,
  ): Promise<CareerAssessmentAssignment[]> {
    return await this.assignmentRepository.find({
      where: { therapistId, status },
      order: { createdAt: 'DESC' },
    });
  }

  async updateAssignmentStatus(
    assignmentId: string,
    status: AssignmentStatus,
    therapistId: string,
  ): Promise<CareerAssessmentAssignment | null> {
    const updateData: any = { status };

    if (status === AssignmentStatus.STARTED) {
      updateData.startedAt = new Date();
    } else if (status === AssignmentStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    await this.assignmentRepository.update(
      { id: assignmentId, therapistId },
      updateData,
    );

    return await this.assignmentRepository.findOne({
      where: { id: assignmentId, therapistId },
    });
  }

  async getAssessmentStats(therapistId: string): Promise<{
    totalAssessments: number;
    activeAssessments: number;
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
  }> {
    const [
      totalAssessments,
      activeAssessments,
      totalAssignments,
      completedAssignments,
      pendingAssignments,
    ] = await Promise.all([
      this.assessmentRepository.count({ where: { therapistId } }),
      this.assessmentRepository.count({
        where: { therapistId, status: AssessmentStatus.ACTIVE },
      }),
      this.assignmentRepository.count({ where: { therapistId } }),
      this.assignmentRepository.count({
        where: { therapistId, status: AssignmentStatus.COMPLETED },
      }),
      this.assignmentRepository.count({
        where: { therapistId, status: AssignmentStatus.ASSIGNED },
      }),
    ]);

    return {
      totalAssessments,
      activeAssessments,
      totalAssignments,
      completedAssignments,
      pendingAssignments,
    };
  }

  async findOverdueAssignments(
    therapistId: string,
  ): Promise<CareerAssessmentAssignment[]> {
    const now = new Date();
    return await this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.assessment', 'assessment')
      .leftJoinAndSelect('assignment.user', 'user')
      .where('assignment.therapistId = :therapistId', { therapistId })
      .andWhere('assignment.dueDate < :now', { now })
      .andWhere('assignment.status NOT IN (:...completedStatuses)', {
        completedStatuses: [
          AssignmentStatus.COMPLETED,
          AssignmentStatus.EXPIRED,
        ],
      })
      .orderBy('assignment.dueDate', 'ASC')
      .getMany();
  }
}
