import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🧹 Cleaning database...');
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.eventAttendee.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.schemeApplication.deleteMany();
  await prisma.report.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.event.deleteMany();
  await prisma.job.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.emergencyAlert.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user first
  console.log('👑 Creating admin user...');
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@civicconnect.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  // Create users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        role: 'citizen',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Raj Kumar',
        email: 'raj@example.com',
        password: hashedPassword,
        role: 'citizen',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Municipal Official',
        email: 'official@gov.in',
        password: hashedPassword,
        role: 'official',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Anita Desai',
        email: 'anita@example.com',
        password: hashedPassword,
        role: 'citizen',
        isVerified: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Health Department',
        email: 'health@gov.in',
        password: hashedPassword,
        role: 'official',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=health',
      },
    }),
  ]);

  const [priya, raj, municipal, anita, health] = users;

  // Create schemes
  console.log('📋 Creating schemes...');
  const schemes = await Promise.all([
    prisma.scheme.create({
      data: {
        title: 'PM Kisan Samman Nidhi',
        description:
          'Income support of ₹6,000 per year for small and marginal farmers across the country.',
        deadline: new Date('2024-12-31'),
        isNew: true,
        eligibility: 'Small and marginal farmers with less than 2 hectares of land',
        documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
        fundingDetails: '₹6,000 per year in 3 installments',
        applicationProcess:
          'Apply online through the official portal or visit your nearest Common Service Center',
      },
    }),
    prisma.scheme.create({
      data: {
        title: 'Skill India Mission',
        description:
          'Free skill development training in various trades with certification and placement assistance.',
        deadline: new Date('2024-06-30'),
        isNew: true,
        eligibility: 'Indian citizens aged 15-35 years',
        documents: ['Aadhaar Card', 'Educational Certificates', 'Passport Photo'],
        fundingDetails: 'Free training with stipend for selected candidates',
        applicationProcess:
          'Register on the Skill India portal and choose your preferred training center',
      },
    }),
    prisma.scheme.create({
      data: {
        title: 'Ayushman Bharat Health Card',
        description:
          'Free health insurance coverage up to ₹5 lakh per family for secondary and tertiary care.',
        deadline: new Date('2024-12-31'),
        isNew: false,
        eligibility: 'BPL families and those meeting SECC criteria',
        documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
        fundingDetails: 'Up to ₹5 lakh per family per year',
        applicationProcess:
          'Visit your nearest Ayushman Bharat center with required documents',
      },
    }),
    prisma.scheme.create({
      data: {
        title: 'Startup India Seed Fund',
        description:
          'Financial assistance for startups to proof of concept, prototype development, and market entry.',
        deadline: new Date('2024-09-30'),
        isNew: true,
        eligibility:
          'DPIIT recognized startups incorporated within last 2 years',
        documents: [
          'Company Registration',
          'DPIIT Recognition',
          'Business Plan',
          'Pitch Deck',
        ],
        fundingDetails: 'Up to ₹50 lakh as grant',
        applicationProcess:
          'Apply through the Startup India Hub portal with required documentation',
      },
    }),
  ]);

  // Create jobs
  console.log('💼 Creating jobs...');
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Junior Developer',
        company: 'Tech Solutions Pvt Ltd',
        location: 'Mumbai, Maharashtra',
        description:
          'Looking for a passionate junior developer to join our growing team. Work on exciting web projects.',
        requirements: [
          'B.Tech/BCA in Computer Science',
          'Knowledge of JavaScript and React',
          'Good communication skills',
          'Willingness to learn',
        ],
        salary: '₹4-6 LPA',
        isNew: true,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Government Clerk',
        company: 'State Public Service Commission',
        location: 'Delhi',
        description:
          'Permanent position in state government office. Excellent job security and benefits.',
        requirements: [
          'Graduate in any discipline',
          'Age 18-35 years',
          'Knowledge of Hindi and English',
          'Basic computer skills',
        ],
        salary: '₹25,000-35,000/month',
        isNew: true,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Community Health Worker',
        company: 'National Health Mission',
        location: 'Pan India',
        description:
          'Join as ASHA worker and contribute to community health initiatives.',
        requirements: [
          'Female candidate',
          '10th pass minimum',
          'Resident of the village',
          'Age 25-45 years',
        ],
        salary: '₹3,000-5,000/month + incentives',
        isNew: false,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Data Entry Operator',
        company: 'District Collectorate',
        location: 'Bangalore, Karnataka',
        description:
          'Contract position for data entry in government digitization project.',
        requirements: [
          '12th pass with computer diploma',
          'Typing speed 35 WPM',
          'Knowledge of MS Office',
          'Attention to detail',
        ],
        salary: '₹15,000/month',
        isNew: true,
      },
    }),
  ]);

  // Create events
  console.log('📅 Creating events...');
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Gram Sabha Meeting',
        date: new Date('2024-02-15T10:00:00'),
        location: 'Village Panchayat Hall',
        description:
          'Monthly Gram Sabha meeting to discuss village development projects and budget allocation.',
        organizer: 'Village Panchayat',
        attendees: 45,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Job Fair 2024',
        date: new Date('2024-02-20T09:00:00'),
        location: 'Town Hall, Mumbai',
        description:
          'Annual job fair with 50+ companies offering various positions. Bring your resume!',
        organizer: 'District Employment Office',
        attendees: 230,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Health Camp',
        date: new Date('2024-02-25T08:00:00'),
        location: 'Primary Health Center',
        description:
          'Free health checkup camp including eye examination, diabetes screening, and general health checkup.',
        organizer: 'Health Department',
        attendees: 120,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Digital Literacy Workshop',
        date: new Date('2024-03-01T14:00:00'),
        location: 'Common Service Center',
        description:
          'Learn to use smartphones, internet banking, and government portals. Free training for all.',
        organizer: 'Digital India Program',
        attendees: 35,
      },
    }),
  ]);

  // Note: Emergency alerts are now managed through the Announcements system in the admin dashboard.
  // Create an urgent announcement with priority "urgent" to display as an emergency alert on the home page.

  // Create posts
  console.log('📝 Creating posts...');
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content:
          'Great news! Our village road construction project has been approved under PMGSY. Work will begin next month. 🎉',
        authorId: municipal!.id,
        likes: 45,
        comments: 12,
        shares: 8,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Just received my PM Kisan installment! The process was smooth through the CSC center. Thank you government! 🙏',
        authorId: priya!.id,
        likes: 23,
        comments: 5,
        shares: 3,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Reminder: Gram Sabha meeting tomorrow at 10 AM. Important discussion on water supply project. Please attend! 📢',
        authorId: municipal!.id,
        likes: 18,
        comments: 7,
        shares: 15,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Completed my skill training in computer basics at the CSC! Looking forward to new opportunities. Never too late to learn! 💪',
        authorId: raj!.id,
        likes: 67,
        comments: 14,
        shares: 5,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Health camp was very successful! We screened 200+ patients. Early detection of 15 diabetes cases. Prevention is better than cure! 🏥',
        authorId: health!.id,
        likes: 89,
        comments: 21,
        shares: 34,
      },
    }),
  ]);

  // Create comments on posts
  console.log('💬 Creating comments...');
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'This is wonderful news! Our village needed this road for so long.',
        postId: posts[0]!.id,
        authorId: priya!.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'When will the work start exactly?',
        postId: posts[0]!.id,
        authorId: raj!.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Congratulations! Which CSC center did you visit?',
        postId: posts[1]!.id,
        authorId: anita!.id,
      },
    }),
  ]);

  // Create connections
  console.log('🤝 Creating connections...');
  await Promise.all([
    prisma.connection.create({
      data: { userId: priya!.id, connectedId: raj!.id },
    }),
    prisma.connection.create({
      data: { userId: priya!.id, connectedId: municipal!.id },
    }),
    prisma.connection.create({
      data: { userId: raj!.id, connectedId: priya!.id },
    }),
    prisma.connection.create({
      data: { userId: anita!.id, connectedId: priya!.id },
    }),
  ]);

  // Create notifications
  console.log('🔔 Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'system',
        title: 'Welcome to CivicConnect!',
        content:
          'Start exploring government schemes, jobs, and events in your area.',
        userId: priya!.id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'alert',
        title: 'New Scheme Available',
        content: 'PM Kisan Samman Nidhi - Apply before December 31st',
        userId: priya!.id,
        isRead: false,
        actionUrl: '/schemes',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'connection',
        title: 'New Connection',
        content: 'Raj Kumar has connected with you',
        userId: priya!.id,
        isRead: true,
      },
    }),
  ]);

  // Create a conversation with messages
  console.log('✉️ Creating messages...');
  const conversation = await prisma.conversation.create({
    data: {
      user1Id: priya!.id,
      user2Id: raj!.id,
    },
  });

  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hi Raj! Did you hear about the new job fair next week?',
        senderId: priya!.id,
        receiverId: raj!.id,
        conversationId: conversation.id,
        isRead: true,
      },
    }),
    prisma.message.create({
      data: {
        content:
          'Yes! I am planning to attend. They have good opportunities for freshers.',
        senderId: raj!.id,
        receiverId: priya!.id,
        conversationId: conversation.id,
        isRead: true,
      },
    }),
    prisma.message.create({
      data: {
        content: 'Great! Let us go together. We can take the morning bus.',
        senderId: priya!.id,
        receiverId: raj!.id,
        conversationId: conversation.id,
        isRead: false,
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Admin: 1`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Schemes: ${schemes.length}`);
  console.log(`   Jobs: ${jobs.length}`);
  console.log(`   Events: ${events.length}`);
  console.log(`   Posts: ${posts.length}`);
  console.log('\n🔑 Admin Credentials:');
  console.log('   Email: admin@civicconnect.com');
  console.log('   Password: Admin@123456');
  console.log('\n🔑 Test User Credentials:');
  console.log('   Email: priya@example.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
