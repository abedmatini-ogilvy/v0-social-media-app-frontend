import { type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

export const search = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string) || '';
    const type = req.query.type as string;

    if (!query) {
      res.json({
        users: [],
        posts: [],
        schemes: [],
        jobs: [],
        events: [],
      });
      return;
    }

    const results: {
      users?: unknown[];
      posts?: unknown[];
      schemes?: unknown[];
      jobs?: unknown[];
      events?: unknown[];
    } = {};

    // Search users
    if (!type || type === 'users') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
        take: 10,
      });
      results.users = users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      }));
    }

    // Search posts
    if (!type || type === 'posts') {
      const posts = await prisma.post.findMany({
        where: {
          content: { contains: query, mode: 'insensitive' },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              isVerified: true,
              createdAt: true,
            },
          },
        },
        take: 10,
      });
      results.posts = posts.map((p) => ({
        id: p.id,
        content: p.content,
        image: p.image,
        likes: p.likes,
        comments: p.comments,
        shares: p.shares,
        createdAt: p.createdAt.toISOString(),
        author: {
          ...p.author,
          createdAt: p.author.createdAt.toISOString(),
        },
      }));
    }

    // Search schemes
    if (!type || type === 'schemes') {
      const schemes = await prisma.scheme.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
      results.schemes = schemes.map((s) => ({
        ...s,
        deadline: s.deadline.toISOString(),
      }));
    }

    // Search jobs
    if (!type || type === 'jobs') {
      const jobs = await prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
      results.jobs = jobs.map((j) => ({
        ...j,
        postedAt: j.postedAt.toISOString(),
      }));
    }

    // Search events
    if (!type || type === 'events') {
      const events = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
      results.events = events.map((e) => ({
        ...e,
        date: e.date.toISOString(),
      }));
    }

    res.json(results);
  } catch (error) {
    throw new AppError('Search failed', 500, 'INTERNAL_ERROR');
  }
};
