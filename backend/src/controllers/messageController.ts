import { type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format user for messages
const formatUser = (user: {
  id: string;
  name: string;
  avatar: string | null;
}) => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar,
});

// Helper to format message response
const formatMessageResponse = (message: {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
}) => ({
  id: message.id,
  content: message.content,
  isRead: message.isRead,
  createdAt: message.createdAt.toISOString(),
  sender: formatUser(message.sender),
  receiver: formatUser(message.receiver),
});

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: req.userId }, { user2Id: req.userId }],
      },
      include: {
        user1: {
          select: { id: true, name: true, avatar: true },
        },
        user2: {
          select: { id: true, name: true, avatar: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
            receiver: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(
      conversations.map((conv) => {
        // Get the other user in the conversation
        const otherUser = conv.user1Id === req.userId ? conv.user2 : conv.user1;
        const lastMessage = conv.messages[0];

        return {
          id: conv.id,
          user: formatUser(otherUser),
          lastMessage: lastMessage ? formatMessageResponse(lastMessage) : null,
          updatedAt: conv.updatedAt.toISOString(),
        };
      })
    );
  } catch (error) {
    throw new AppError('Failed to get conversations', 500, 'INTERNAL_ERROR');
  }
};

export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, name: true, avatar: true } },
        user2: { select: { id: true, name: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
            receiver: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404, 'NOT_FOUND');
    }

    // Check if user is part of the conversation
    if (conversation.user1Id !== req.userId && conversation.user2Id !== req.userId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: req.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const otherUser =
      conversation.user1Id === req.userId ? conversation.user2 : conversation.user1;

    res.json({
      id: conversation.id,
      user: formatUser(otherUser),
      messages: conversation.messages.map(formatMessageResponse),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get conversation', 500, 'INTERNAL_ERROR');
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { receiverId, content } = req.body;

    if (req.userId === receiverId) {
      throw new AppError('Cannot send message to yourself', 400, 'VALIDATION_ERROR');
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new AppError('Receiver not found', 404, 'NOT_FOUND');
    }

    // Find or create conversation
    // Conversations are unique by the pair (user1Id, user2Id)
    // We need to check both orderings
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: req.userId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: req.userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: req.userId!,
          user2Id: receiverId,
        },
      });
    }

    // Create message and update conversation
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          content,
          senderId: req.userId!,
          receiverId,
          conversationId: conversation.id,
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
        },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        type: 'message',
        title: 'New Message',
        content: `You have a new message`,
        userId: receiverId,
        actionUrl: `/messages/${conversation.id}`,
      },
    });

    res.status(201).json(formatMessageResponse(message));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to send message', 500, 'INTERNAL_ERROR');
  }
};
