import { type Request, type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format scheme response
const formatSchemeResponse = (scheme: {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  isNew: boolean;
  eligibility: string;
  documents: string[];
  fundingDetails: string;
  applicationProcess: string;
}) => ({
  id: scheme.id,
  title: scheme.title,
  description: scheme.description,
  deadline: scheme.deadline.toISOString(),
  isNew: scheme.isNew,
  eligibility: scheme.eligibility,
  documents: scheme.documents,
  fundingDetails: scheme.fundingDetails,
  applicationProcess: scheme.applicationProcess,
});

export const listSchemes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(schemes.map(formatSchemeResponse));
  } catch (error) {
    throw new AppError('Failed to get schemes', 500, 'INTERNAL_ERROR');
  }
};

export const getScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schemeId } = req.params;

    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
    });

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'NOT_FOUND');
    }

    res.json(formatSchemeResponse(scheme));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get scheme', 500, 'INTERNAL_ERROR');
  }
};

export const applyForScheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { schemeId } = req.params;

    if (!schemeId) {
      throw new AppError('Scheme ID is required', 400, 'VALIDATION_ERROR');
    }

    // Check if scheme exists
    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
    });

    if (!scheme) {
      throw new AppError('Scheme not found', 404, 'NOT_FOUND');
    }

    // Check if already applied
    const existingApplication = await prisma.schemeApplication.findUnique({
      where: {
        userId_schemeId: {
          userId: req.userId!,
          schemeId,
        },
      },
    });

    if (existingApplication) {
      throw new AppError('Already applied for this scheme', 409, 'CONFLICT');
    }

    // Create application
    const application = await prisma.schemeApplication.create({
      data: {
        userId: req.userId!,
        schemeId,
      },
      include: {
        scheme: true,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'application',
        title: 'Scheme Application Submitted',
        content: `Your application for "${scheme.title}" has been submitted.`,
        userId: req.userId!,
        actionUrl: `/schemes/${schemeId}`,
      },
    });

    res.status(201).json({
      id: application.id,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
      scheme: formatSchemeResponse(application.scheme),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to apply for scheme', 500, 'INTERNAL_ERROR');
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await prisma.schemeApplication.findMany({
      where: { userId: req.userId },
      include: {
        scheme: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(
      applications.map((app) => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt.toISOString(),
        scheme: formatSchemeResponse(app.scheme),
      }))
    );
  } catch (error) {
    throw new AppError('Failed to get applications', 500, 'INTERNAL_ERROR');
  }
};

export const getApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;

    const application = await prisma.schemeApplication.findUnique({
      where: { id: applicationId },
      include: {
        scheme: true,
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'NOT_FOUND');
    }

    if (application.userId !== req.userId) {
      throw new AppError('Not authorized to view this application', 403, 'FORBIDDEN');
    }

    res.json({
      id: application.id,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      scheme: formatSchemeResponse(application.scheme),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get application status', 500, 'INTERNAL_ERROR');
  }
};
