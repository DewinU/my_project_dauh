import { PrismaClient } from '../generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Limpiar datos existentes en el orden correcto (por foreign keys)
  console.log('🗑️ Cleaning existing data...')
  await prisma.user.deleteMany()
  console.log('Users deleted')
  await prisma.tenant.deleteMany()
  console.log('Tenants deleted')

  // Crear tenants
  console.log('🏢 Creating tenants...')
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'Tech Solutions Inc.',
    },
  })
  console.log(`Tenant 1 created: ${tenant1.name}`)

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Marketing Pro Agency',
    },
  })
  console.log(`Tenant 2 created: ${tenant2.name}`)

  const tenant3 = await prisma.tenant.create({
    data: {
      name: 'Consulting Experts LLC',
    },
  })
  console.log(`Tenant 3 created: ${tenant3.name}`)

  // Hashear contraseñas
  console.log('🔐 Hashing passwords...')
  const hashedPassword1 = await bcrypt.hash('password123', 10)
  const hashedPassword2 = await bcrypt.hash('securepass', 10)

  // Crear usuarios para tenant1
  console.log('👥 Creating users for tenant 1...')
  const adminTenant1 = await prisma.user.create({
    data: {
      email: 'admin@techsolutions.com',
      name: 'Admin Tech Solutions',
      password: hashedPassword1,
      telephone: '+1-555-0101',
      role: 'ADMIN',
      tenantId: tenant1.id,
    },
  })
  console.log(`User created: ${adminTenant1.email}`)

  const userTenant1 = await prisma.user.create({
    data: {
      email: 'user@techsolutions.com',
      name: 'John Developer',
      password: hashedPassword2,
      telephone: '+1-555-0102',
      role: 'USER',
      tenantId: tenant1.id,
    },
  })
  console.log(`User created: ${userTenant1.email}`)

  // Crear usuarios para tenant2
  console.log('👥 Creating users for tenant 2...')
  const adminTenant2 = await prisma.user.create({
    data: {
      email: 'admin@marketingpro.com',
      name: 'Admin Marketing Pro',
      password: hashedPassword1,
      telephone: '+1-555-0201',
      role: 'ADMIN',
      tenantId: tenant2.id,
    },
  })
  console.log(`User created: ${adminTenant2.email}`)

  const userTenant2 = await prisma.user.create({
    data: {
      email: 'user@marketingpro.com',
      name: 'Sarah Designer',
      password: hashedPassword2,
      telephone: '+1-555-0202',
      role: 'USER',
      tenantId: tenant2.id,
    },
  })
  console.log(`User created: ${userTenant2.email}`)

  // Crear usuarios para tenant3
  console.log('👥 Creating users for tenant 3...')
  const adminTenant3 = await prisma.user.create({
    data: {
      email: 'admin@consultingexperts.com',
      name: 'Admin Consulting Experts',
      password: hashedPassword1,
      telephone: '+1-555-0301',
      role: 'ADMIN',
      tenantId: tenant3.id,
    },
  })
  console.log(`User created: ${adminTenant3.email}`)

  const userTenant3 = await prisma.user.create({
    data: {
      email: 'user@consultingexperts.com',
      name: 'Michael Consultant',
      password: hashedPassword2,
      telephone: '+1-555-0302',
      role: 'USER',
      tenantId: tenant3.id,
    },
  })
  console.log(`User created: ${userTenant3.email}`)

  console.log('\n✅ Seed completed successfully!')
  console.log('\n🔐 Test credentials:')
  console.log('Tenant 1 - Tech Solutions Inc.:')
  console.log('   Admin: admin@techsolutions.com / password123')
  console.log('   User:  user@techsolutions.com / securepass')
  
  console.log('\nTenant 2 - Marketing Pro Agency:')
  console.log('   Admin: admin@marketingpro.com / password123')
  console.log('   User:  user@marketingpro.com / securepass')
  
  console.log('\nTenant 3 - Consulting Experts LLC:')
  console.log('   Admin: admin@consultingexperts.com / password123')
  console.log('   User:  user@consultingexperts.com / securepass')

  return {
    tenants: [tenant1, tenant2, tenant3],
    users: [adminTenant1, userTenant1, adminTenant2, userTenant2, adminTenant3, userTenant3],
  }
}

main()
  .then(async (result) => {
    console.log('\n📊 Seed results:')
    console.log(`   - Tenants: ${result.tenants.length}`)
    console.log(`   - Users: ${result.users.length}`)
    console.log(`   - ADMIN users: ${result.users.filter(u => u.role === 'ADMIN').length}`)
    console.log(`   - USER users: ${result.users.filter(u => u.role === 'USER').length}`)
    
    // Mostrar resumen por tenant
    console.log('\n🏢 Tenants summary:')
    for (const tenant of result.tenants) {
      const tenantUsers = await prisma.user.findMany({
        where: { tenantId: tenant.id },
        select: { email: true, name: true, role: true }
      })
      console.log(`\n   ${tenant.name}:`)
      tenantUsers.forEach(user => {
        console.log(`      ${user.role}: ${user.name} (${user.email})`)
      })
    }
    
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })