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

// ==================== ADMIN EVENT MANAGEMENT ====================

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, organizer } = req.body;

    if (!title || !description || !date || !location || !organizer) {
      throw new AppError('All fields are required', 400, 'VALIDATION_ERROR');
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizer,
        attendees: 0,
      },
    });

    res.status(201).json(formatEventResponse(event));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create event', 500, 'INTERNAL_ERROR');
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location, organizer } = req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(organizer && { organizer }),
      },
    });

    res.json(formatEventResponse(event));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update event', 500, 'INTERNAL_ERROR');
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    // Delete all attendees first
    await prisma.eventAttendee.deleteMany({
      where: { eventId },
    });

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete event', 500, 'INTERNAL_ERROR');
  }
};

export const getEventAttendees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    const attendees = await prisma.eventAttendee.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json({
      event: formatEventResponse(event),
      attendees: attendees.map((a) => ({
        id: a.id,
        joinedAt: a.joinedAt.toISOString(),
        user: a.user,
      })),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get event attendees', 500, 'INTERNAL_ERROR');
  }
};
