import { type Request, type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper to format emergency alert response
const formatAlertResponse = (alert: {
  id: string;
  title: string;
  message: string;
  authority: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
}) => ({
  id: alert.id,
  title: alert.title,
  message: alert.message,
  authority: alert.authority,
  isActive: alert.isActive,
  createdAt: alert.createdAt.toISOString(),
  expiresAt: alert.expiresAt?.toISOString() || null,
});

export const listEmergencyAlerts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await prisma.emergencyAlert.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(alerts.map(formatAlertResponse));
  } catch (error) {
    throw new AppError('Failed to get emergency alerts', 500, 'INTERNAL_ERROR');
  }
};

export const getEmergencyAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alertId } = req.params;

    const alert = await prisma.emergencyAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new AppError('Emergency alert not found', 404, 'NOT_FOUND');
    }

    res.json(formatAlertResponse(alert));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get emergency alert', 500, 'INTERNAL_ERROR');
  }
};
