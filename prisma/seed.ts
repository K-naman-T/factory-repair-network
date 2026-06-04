import path from 'path'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
const dbPath = connectionString.replace(/^file:/, '')
const resolvedPath = path.resolve(process.cwd(), dbPath)
const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create Factories
  const tataSteelJsr = await prisma.factory.create({
    data: { name: 'Tata Steel Jamshedpur', address: 'Main Plant Road, Bistupur', city: 'Jamshedpur', phone: '+91-657-2341000' },
  })
  const bhushanSteelDhanbad = await prisma.factory.create({
    data: { name: 'Bhushan Steel Dhanbad', address: 'Industrial Area, Govindpur', city: 'Dhanbad', phone: '+91-326-2201000' },
  })
  const jswRanchi = await prisma.factory.create({
    data: { name: 'JSW Ranchi', address: 'Steel City Road, Tupudana', city: 'Ranchi', phone: '+91-651-2781000' },
  })
  const bokaroSteel = await prisma.factory.create({
    data: { name: 'Bokaro Steel Plant', address: 'Sector IV, Bokaro Steel City', city: 'Bokaro', phone: '+91-6542-2201000' },
  })
  const tataSteelHzb = await prisma.factory.create({
    data: { name: 'Tata Steel Hazaribagh', address: 'Industrial Estate, Silwar', city: 'Hazaribagh', phone: '+91-6546-2301000' },
  })

  // Create Technicians (2 per specialty)
  // HVAC
  const techHvac1 = await prisma.technician.create({
    data: { name: 'Rajesh Kumar', specialty: 'HVAC', city: 'Jamshedpur', phone: '+91-98765-40001', email: 'rajesh.kumar@example.com' },
  })
  const techHvac2 = await prisma.technician.create({
    data: { name: 'Suresh Yadav', specialty: 'HVAC', city: 'Ranchi', phone: '+91-98765-40002', email: 'suresh.yadav@example.com' },
  })
  // Plumbing
  const techPlumb1 = await prisma.technician.create({
    data: { name: 'Amit Singh', specialty: 'Plumbing', city: 'Dhanbad', phone: '+91-98765-40003', email: 'amit.singh@example.com' },
  })
  const techPlumb2 = await prisma.technician.create({
    data: { name: 'Vijay Patel', specialty: 'Plumbing', city: 'Bokaro', phone: '+91-98765-40004', email: 'vijay.patel@example.com' },
  })
  // Electrical
  const techElec1 = await prisma.technician.create({
    data: { name: 'Deepak Verma', specialty: 'Electrical', city: 'Jamshedpur', phone: '+91-98765-40005', email: 'deepak.verma@example.com' },
  })
  const techElec2 = await prisma.technician.create({
    data: { name: 'Ravi Sharma', specialty: 'Electrical', city: 'Ranchi', phone: '+91-98765-40006', email: 'ravi.sharma@example.com' },
  })
  // Pest
  const techPest1 = await prisma.technician.create({
    data: { name: 'Manish Gupta', specialty: 'Pest', city: 'Dhanbad', phone: '+91-98765-40007', email: 'manish.gupta@example.com' },
  })
  const techPest2 = await prisma.technician.create({
    data: { name: 'Pankaj Tiwari', specialty: 'Pest', city: 'Bokaro', phone: '+91-98765-40008', email: 'pankaj.tiwari@example.com' },
  })
  // Industrial
  const techInd1 = await prisma.technician.create({
    data: { name: 'Rohit Das', specialty: 'Industrial', city: 'Jamshedpur', phone: '+91-98765-40009', email: 'rohit.das@example.com' },
  })
  const techInd2 = await prisma.technician.create({
    data: { name: 'Sunil Rao', specialty: 'Industrial', city: 'Hazaribagh', phone: '+91-98765-40010', email: 'sunil.rao@example.com' },
  })

  // Create Jobs (8 open, 4 assigned, 3 in_progress, 5 resolved)
  // Open jobs
  await prisma.job.create({ data: { factoryId: tataSteelJsr.id, specialtyNeeded: 'HVAC', description: 'AC unit not cooling in server room', status: 'open' } })
  await prisma.job.create({ data: { factoryId: bhushanSteelDhanbad.id, specialtyNeeded: 'Electrical', description: 'Circuit breaker keeps tripping', status: 'open' } })
  await prisma.job.create({ data: { factoryId: jswRanchi.id, specialtyNeeded: 'Plumbing', description: 'Pipe burst in cooling tower', status: 'open', urgency: 'high' } })
  await prisma.job.create({ data: { factoryId: bokaroSteel.id, specialtyNeeded: 'Industrial', description: 'Conveyor belt motor overheating', status: 'open', urgency: 'high' } })
  await prisma.job.create({ data: { factoryId: tataSteelHzb.id, specialtyNeeded: 'Pest', description: 'Rodent infestation in warehouse', status: 'open', urgency: 'high' } })
  await prisma.job.create({ data: { factoryId: tataSteelJsr.id, specialtyNeeded: 'Electrical', description: 'Transformer oil leak detected', status: 'open' } })
  await prisma.job.create({ data: { factoryId: bhushanSteelDhanbad.id, specialtyNeeded: 'HVAC', description: 'Ventilation system malfunction', status: 'open' } })
  await prisma.job.create({ data: { factoryId: jswRanchi.id, specialtyNeeded: 'Industrial', description: 'Hydraulic press calibration needed', status: 'open' } })

  // Assigned jobs
  await prisma.job.create({ data: { factoryId: tataSteelJsr.id, technicianId: techHvac1.id, specialtyNeeded: 'HVAC', description: 'Industrial chiller servicing', status: 'assigned' } })
  await prisma.job.create({ data: { factoryId: bhushanSteelDhanbad.id, technicianId: techPlumb1.id, specialtyNeeded: 'Plumbing', description: 'Underground pipe replacement', status: 'assigned', urgency: 'high' } })
  await prisma.job.create({ data: { factoryId: jswRanchi.id, technicianId: techElec2.id, specialtyNeeded: 'Electrical', description: 'Panel board upgrade', status: 'assigned' } })
  await prisma.job.create({ data: { factoryId: bokaroSteel.id, technicianId: techInd1.id, specialtyNeeded: 'Industrial', description: 'CNC machine error diagnosis', status: 'assigned' } })

  // In progress jobs
  await prisma.job.create({ data: { factoryId: tataSteelJsr.id, technicianId: techElec1.id, specialtyNeeded: 'Electrical', description: 'Motor rewinding in progress', status: 'in_progress', urgency: 'high' } })
  await prisma.job.create({ data: { factoryId: bhushanSteelDhanbad.id, technicianId: techPest1.id, specialtyNeeded: 'Pest', description: 'Fumigation in progress', status: 'in_progress' } })
  await prisma.job.create({ data: { factoryId: jswRanchi.id, technicianId: techHvac2.id, specialtyNeeded: 'HVAC', description: 'Duct cleaning and repair', status: 'in_progress' } })

  // Resolved jobs
  await prisma.job.create({ data: { factoryId: tataSteelJsr.id, technicianId: techInd1.id, specialtyNeeded: 'Industrial', description: 'Compressor replaced', status: 'resolved', resolvedAt: new Date('2026-05-28') } })
  await prisma.job.create({ data: { factoryId: bhushanSteelDhanbad.id, technicianId: techPlumb2.id, specialtyNeeded: 'Plumbing', description: 'Water treatment system fixed', status: 'resolved', resolvedAt: new Date('2026-05-30') } })
  await prisma.job.create({ data: { factoryId: bokaroSteel.id, technicianId: techElec2.id, specialtyNeeded: 'Electrical', description: 'Generator restored', status: 'resolved', resolvedAt: new Date('2026-06-01') } })
  await prisma.job.create({ data: { factoryId: tataSteelHzb.id, technicianId: techInd2.id, specialtyNeeded: 'Industrial', description: 'Welding machine repaired', status: 'resolved', resolvedAt: new Date('2026-06-02') } })
  await prisma.job.create({ data: { factoryId: bokaroSteel.id, technicianId: techPest2.id, specialtyNeeded: 'Pest', description: 'Termite treatment completed', status: 'resolved', resolvedAt: new Date('2026-06-03') } })

  // Create Users
  await prisma.user.create({ data: { email: 'admin@fixforge.in', password: 'admin123', role: 'admin', name: 'Admin User' } })
  await prisma.user.create({ data: { email: 'owner@tatasteel.in', password: 'pass123', role: 'factory', name: 'Factory Owner' } })
  await prisma.user.create({ data: { email: 'aman.singh@fixforge.in', password: 'pass123', role: 'technician', name: 'Aman Singh' } })

  // Create Call Logs
  await prisma.callLog.create({ data: { phone: '+91-98765-40001', intent: 'Job assignment confirmation', transcript: 'Confirmed availability for chiller servicing at Tata Steel Jamshedpur.' } })
  await prisma.callLog.create({ data: { phone: '+91-657-2341000', intent: 'Emergency repair request', transcript: 'Reported circuit breaker issue. Urgent electrical repair needed.' } })
  await prisma.callLog.create({ data: { phone: '+91-98765-40005', intent: 'Status update', transcript: 'Motor rewinding at Tata Steel is 70% complete. Expected completion tomorrow.' } })
  await prisma.callLog.create({ data: { phone: '+91-98765-40003', intent: 'New job offer', transcript: 'Offered underground pipe replacement at Bhushan Steel. Accepted.' } })
  await prisma.callLog.create({ data: { phone: '+91-98765-40009', intent: 'Job completion report', transcript: 'Compressor replacement completed successfully. Machine is operational.' } })

  console.log('Seed data created successfully')
  console.log('  - 5 Factories')
  console.log('  - 10 Technicians')
  console.log('  - 20 Jobs')
  console.log('  - 3 Users')
  console.log('  - 5 Call Logs')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
