import { type Request, type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format event response
const formatEventResponse = (event: {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  organizer: string;
  attendees: number;
}) => ({
  id: event.id,
  title: event.title,
  date: event.date.toISOString(),
  location: event.location,
  description: event.description,
  organizer: event.organizer,
  attendees: event.attendees,
});

export const listEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    res.json(events.map(formatEventResponse));
  } catch (error) {
    throw new AppError('Failed to get events', 500, 'INTERNAL_ERROR');
  }
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    res.json(formatEventResponse(event));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get event', 500, 'INTERNAL_ERROR');
  }
};

export const attendEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      throw new AppError('Event ID is required', 400, 'VALIDATION_ERROR');
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    // Check if already attending
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: req.userId!,
          eventId,
        },
      },
    });

    if (existingAttendee) {
      throw new AppError('Already attending this event', 409, 'CONFLICT');
    }

    // Create attendee record
    await prisma.eventAttendee.create({
      data: {
        userId: req.userId!,
        eventId,
      },
    });

    // Update event attendee count
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { attendees: { increment: 1 } },
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      event: formatEventResponse(updatedEvent),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to register for event', 500, 'INTERNAL_ERROR');
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const attendees = await prisma.eventAttendee.findMany({
      where: { userId: req.userId },
      include: {
        event: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json(
      attendees.map((a) => ({
        id: a.id,
        joinedAt: a.joinedAt.toISOString(),
        event: formatEventResponse(a.event),
      }))
    );
  } catch (error) {
    throw new AppError('Failed to get my events', 500, 'INTERNAL_ERROR');
  }
};
