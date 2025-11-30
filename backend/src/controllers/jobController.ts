import { type Request, type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format job response
const formatJobResponse = (job: {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string | null;
  isNew: boolean;
  postedAt: Date;
}) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  description: job.description,
  requirements: job.requirements,
  salary: job.salary,
  isNew: job.isNew,
  postedAt: job.postedAt.toISOString(),
});

export const listJobs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { postedAt: 'desc' },
    });

    res.json(jobs.map(formatJobResponse));
  } catch (error) {
    throw new AppError('Failed to get jobs', 500, 'INTERNAL_ERROR');
  }
};

export const getJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'NOT_FOUND');
    }

    res.json(formatJobResponse(job));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get job', 500, 'INTERNAL_ERROR');
  }
};

export const applyForJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError('Job ID is required', 400, 'VALIDATION_ERROR');
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'NOT_FOUND');
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: req.userId!,
          jobId,
        },
      },
    });

    if (existingApplication) {
      throw new AppError('Already applied for this job', 409, 'CONFLICT');
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        userId: req.userId!,
        jobId,
      },
      include: {
        job: true,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'application',
        title: 'Job Application Submitted',
        content: `Your application for "${job.title}" at ${job.company} has been submitted.`,
        userId: req.userId!,
        actionUrl: `/jobs/${jobId}`,
      },
    });

    res.status(201).json({
      id: application.id,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
      job: formatJobResponse(application.job),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to apply for job', 500, 'INTERNAL_ERROR');
  }
};

export const getMyJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.userId },
      include: {
        job: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(
      applications.map((app) => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt.toISOString(),
        job: formatJobResponse(app.job),
      }))
    );
  } catch (error) {
    throw new AppError('Failed to get job applications', 500, 'INTERNAL_ERROR');
  }
};
