import { PrismaClient, Role } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Delete all users and tenants
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  console.log('✅ Deleted all users and tenants');

  // Hash passwords
  const password = await bcrypt.hash('password123', 10);

  // Create tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Google',
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Facebook',
    },
  });

  console.log('✅ Created 2 tenants');

  // Create users with tenants
  const user1 = await prisma.user.create({
    data: {
      email: 'dewin@google.com',
      name: 'DewinU',
      password: password,
      telephone: '+505858531864',
      role: Role.ADMIN,
      tenantId: tenant1.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'cris@facebook.com',
      name: 'cristoferlarios',
      password: password,
      telephone: '+50585858585',
      role: Role.USER,
      tenantId: tenant2.id,
    },
  });

  // Create user without tenant
  const user3 = await prisma.user.create({
    data: {
      email: 'fabricio@upwork.com',
      name: 'hardy',
      password: password,
      telephone: '+50522222222',
      role: Role.USER,
    },
  });

  console.log('✅ Created 3 users (2 with tenants, 1 without)');

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log(`- Created ${await prisma.tenant.count()} tenants`);
  console.log(`- Created ${await prisma.user.count()} users`);
  console.log(`- ${await prisma.user.count({ where: { tenantId: { not: null } } })} users with tenants`);
  console.log(`- ${await prisma.user.count({ where: { tenantId: null } })} users without tenant`);

  console.log('\n🔐 Test Credentials (all users):');
  console.log(`- dewin@google.com / password123`);
  console.log(`- cris@facebook.com / password123`);
  console.log(`- fabricio@upwork.com / password123`);

  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
