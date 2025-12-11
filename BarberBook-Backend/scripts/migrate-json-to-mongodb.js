require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

const User = require("../src/models/User");
const Barber = require("../src/models/Barber");
const Appointment = require("../src/models/Appointment");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://barberbook_admin:barberbook123@barberbook.r6wseaj.mongodb.net/barberbook?retryWrites=true&w=majority&appName=BarberBook";

const dataDir = path.join(__dirname, "../src/data");

async function migrateData() {
  try {
    console.log("🔄 Starting migration from JSON to MongoDB...\n");

    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Barber.deleteMany({});
    await Appointment.deleteMany({});
    console.log("✅ Database cleared\n");

    const usersFile = path.join(dataDir, "users.json");
    const barbersFile = path.join(dataDir, "barbers.json");
    const appointmentsFile = path.join(dataDir, "appointments.json");

    console.log("📂 Reading JSON files...");
    const usersData = JSON.parse(await fs.readFile(usersFile, "utf8"));
    const barbersData = JSON.parse(await fs.readFile(barbersFile, "utf8"));
    const appointmentsData = JSON.parse(await fs.readFile(appointmentsFile, "utf8"));
    console.log(`   Found ${usersData.length} users`);
    console.log(`   Found ${barbersData.length} barbers`);
    console.log(`   Found ${appointmentsData.length} appointments\n`);

    const userIdMap = {};

    console.log("👥 Migrating users...");
    for (const userData of usersData) {
      const newUser = new User({
        name: userData.name,
        email: userData.email.toLowerCase(),
        passwordHash: userData.passwordHash,
        role: userData.role,
        phone: userData.phone,
        createdAt: userData.createdAt || new Date()
      });
      await newUser.save();
      userIdMap[userData.id] = newUser._id.toString();
      console.log(`   ✓ Migrated user: ${userData.email} (${userData.role})`);
    }
    console.log(`✅ Migrated ${usersData.length} users\n`);

    const barberIdMap = {};

    console.log("💈 Migrating barbers...");
    for (const barberData of barbersData) {
      // Find user with matching barberId field
      const matchingUser = usersData.find(u => u.barberId === barberData.id && u.role === 'barber');
      const userId = matchingUser ? userIdMap[matchingUser.id] : null;
      
      if (!userId) {
        console.log(`   ⚠️  Skipping barber ${barberData.id} - no matching user`);
        continue;
      }

      // Parse experience - handle string numbers with commas
      let experience = 5;
      if (barberData.experience) {
        experience = typeof barberData.experience === 'string' 
          ? parseInt(barberData.experience.replace(/,/g, ''))
          : barberData.experience;
      } else if (barberData.totalReviews) {
        experience = typeof barberData.totalReviews === 'string'
          ? parseInt(barberData.totalReviews.replace(/,/g, ''))
          : barberData.totalReviews;
      }
      
      const newBarber = new Barber({
        userId: userId,
        name: barberData.name,
        specialization: barberData.specialization || barberData.bio?.substring(0, 50) || "Hair Styling",
        experience: experience,
        rating: barberData.rating || 0,
        bio: barberData.bio,
        profileImage: barberData.photo || barberData.profileImage,
        services: barberData.services || [],
        availability: barberData.availability || [],
        createdAt: barberData.createdAt || new Date()
      });
      await newBarber.save();
      barberIdMap[barberData.id] = newBarber._id.toString();
      console.log(`   ✓ Migrated barber: ${barberData.name}`);
    }
    console.log(`✅ Migrated ${Object.keys(barberIdMap).length} barbers\n`);

    console.log("📅 Migrating appointments...");
    let migratedCount = 0;
    for (const aptData of appointmentsData) {
      // Customer ID is straightforward user ID
      const customerId = userIdMap[aptData.customerId];
      
      // Barber ID can be either a barberId (like "1") or a user ID
      let barberId = userIdMap[aptData.barberId];
      if (!barberId) {
        // Try to find user with this barberId
        const barberUser = usersData.find(u => u.barberId === aptData.barberId && u.role === 'barber');
        barberId = barberUser ? userIdMap[barberUser.id] : null;
      }

      if (!customerId || !barberId) {
        console.log(`   ⚠️  Skipping appointment ${aptData.id} - missing user references (customer: ${!!customerId}, barber: ${!!barberId})`);
        continue;
      }

      const newAppointment = new Appointment({
        customerId: customerId,
        barberId: barberId,
        serviceId: aptData.serviceId,
        date: new Date(aptData.date),
        time: aptData.time,
        duration: aptData.duration,
        price: aptData.price,
        status: aptData.status || "confirmed",
        notes: aptData.notes,
        createdAt: aptData.createdAt || new Date()
      });
      await newAppointment.save();
      migratedCount++;
      if (migratedCount % 10 === 0) {
        console.log(`   ✓ Migrated ${migratedCount} appointments...`);
      }
    }
    console.log(`✅ Migrated ${migratedCount} appointments\n`);

    console.log("📊 Migration Summary:");
    console.log("====================");
    console.log(`   Users:        ${usersData.length} → ${await User.countDocuments()}`);
    console.log(`   Barbers:      ${barbersData.length} → ${await Barber.countDocuments()}`);
    console.log(`   Appointments: ${appointmentsData.length} → ${await Appointment.countDocuments()}`);
    console.log("");
    console.log("✅ Migration completed successfully!");
    console.log("");
    console.log("🔍 Verify your data in MongoDB Compass:");
    console.log(`   Database: barberbook`);
    console.log(`   Collections: users, barbers, appointments`);
    console.log("");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

migrateData();
