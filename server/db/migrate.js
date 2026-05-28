const db = require('./client');
const bcrypt = require('bcryptjs');

async function runMigration() {
  console.log('Starting NextCoreSystem Database Migration...');

  try {
    // 1. Drop existing tables if they exist to start fresh
    console.log('Dropping existing tables if they exist...');
    await db.query(`
      DROP TABLE IF EXISTS feedback CASCADE;
      DROP TABLE IF EXISTS remote_devices CASCADE;
      DROP TABLE IF EXISTS ticket_updates CASCADE;
      DROP TABLE IF EXISTS tickets CASCADE;
      DROP TABLE IF EXISTS leads CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS blogs CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // 2. Create tables
    console.log('Creating users table...');
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'admin', 'staff', 'customer'
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating blogs table...');
    await db.query(`
      CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating customers table...');
    await db.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        organization VARCHAR(150),
        address VARCHAR(255),
        customer_type VARCHAR(20) DEFAULT 'individual', -- 'individual', 'business'
        amc_status VARCHAR(20) DEFAULT 'none', -- 'active', 'expired', 'none'
        amc_start DATE,
        amc_end DATE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating leads table...');
    await db.query(`
      CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        organization VARCHAR(150),
        service_type VARCHAR(50), -- 'hardware', 'networking', 'cctv', 'software', 'remote', 'other'
        description TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'website', -- 'website', 'referral', 'facebook', 'walk-in', 'other'
        status VARCHAR(30) DEFAULT 'new', -- 'new', 'contacted', 'converted', 'archived'
        converted_customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating tickets table...');
    await db.query(`
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        ticket_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        category VARCHAR(50) NOT NULL, -- 'Hardware', 'Network', 'CCTV', 'Software', 'Remote', 'Other'
        priority VARCHAR(20) DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Urgent'
        subject VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(30) DEFAULT 'Open', -- 'Open', 'Assigned', 'In Progress', 'On Hold', 'Resolved', 'Closed'
        sla_due TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP WITH TIME ZONE,
        closed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    console.log('Creating ticket_updates table...');
    await db.query(`
      CREATE TABLE ticket_updates (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating remote_devices table...');
    await db.query(`
      CREATE TABLE remote_devices (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        nickname VARCHAR(100) NOT NULL,
        device_type VARCHAR(50) DEFAULT 'Desktop', -- 'Desktop', 'Laptop', 'Server', 'POS', 'Other'
        anydesk_id VARCHAR(50),
        teamviewer_id VARCHAR(50),
        pin_encrypted VARCHAR(255), -- stored PIN
        os VARCHAR(50) DEFAULT 'Windows 11',
        hardware_notes TEXT,
        last_accessed TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating feedback table...');
    await db.query(`
      CREATE TABLE feedback (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE UNIQUE,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All tables created successfully!');

    // 3. Seed Mock Data
    console.log('Seeding mock users...');
    const salt = await bcrypt.genSalt(10);
    
    // Hash passwords
    const adminPassHash = await bcrypt.hash('admin123', salt);
    const tech1PassHash = await bcrypt.hash('tech123', salt);
    const tech2PassHash = await bcrypt.hash('tech123', salt);
    const cust1PassHash = await bcrypt.hash('customer123', salt);
    const cust2PassHash = await bcrypt.hash('customer123', salt);

    // Insert Users
    const usersResult = await db.query(`
      INSERT INTO users (name, email, phone, password_hash, role) VALUES
      ('Admin Director', 'admin@nextcore.com', '9855012345', $1, 'admin'),
      ('Sandeep Thapa (Technician)', 'sandeep@nextcore.com', '9845098765', $2, 'staff'),
      ('Aayush Shrestha (Technician)', 'aayush@nextcore.com', '9812345678', $3, 'staff'),
      ('Ram Prasad Sharma', 'ram@sharma.com', '9855024680', $4, 'customer'),
      ('Gita Adhikari', 'gita@adhikari.com', '9801234567', $5, 'customer')
      RETURNING id, name, role;
    `, [adminPassHash, tech1PassHash, tech2PassHash, cust1PassHash, cust2PassHash]);

    const users = usersResult.rows;
    const adminId = users.find(u => u.role === 'admin').id;
    const tech1Id = users.find(u => u.name.includes('Sandeep')).id;
    const tech2Id = users.find(u => u.name.includes('Aayush')).id;
    const ramUserId = users.find(u => u.name.includes('Ram')).id;
    const gitaUserId = users.find(u => u.name.includes('Gita')).id;

    console.log('Seeding mock customers...');
    // Insert Customers
    const customerRamResult = await db.query(`
      INSERT INTO customers (user_id, organization, address, customer_type, amc_status, amc_start, amc_end, notes) VALUES
      ($1, 'Sharma Trading House', 'Chaubiskoti, Bharatpur, Chitwan', 'business', 'active', '2026-01-01', '2027-01-01', 'Long-term trading business, has 5 local PCs and 1 network rack.')
      RETURNING id;
    `, [ramUserId]);

    const customerGitaResult = await db.query(`
      INSERT INTO customers (user_id, organization, address, customer_type, amc_status, amc_start, amc_end, notes) VALUES
      ($1, NULL, 'Hakimchowk, Bharatpur, Chitwan', 'individual', 'none', NULL, NULL, 'Individual customer for gaming laptop repairs.')
      RETURNING id;
    `, [gitaUserId]);

    const ramCustomerId = customerRamResult.rows[0].id;
    const gitaCustomerId = customerGitaResult.rows[0].id;

    console.log('Seeding mock leads...');
    // Insert Leads
    await db.query(`
      INSERT INTO leads (name, phone, email, organization, service_type, description, source, status, converted_customer_id) VALUES
      ('Hari Bahadur', '9845011223', 'hari@bahadur.com', 'Chitwan Medical College Co.', 'networking', 'Need a full wireless network installation with unified APs for our admin block.', 'website', 'new', NULL),
      ('Sita Kumari', '9865033445', 'sita@kumari.com', NULL, 'hardware', 'Laptop screen has vertical green lines. Needs screen replacement. Dell Inspiron 15.', 'website', 'contacted', NULL),
      ('Ram Prasad Sharma', '9855024680', 'ram@sharma.com', 'Sharma Trading House', 'networking', 'Need AMC service for office network setup.', 'website', 'converted', $1)
    `, [ramCustomerId]);

    console.log('Seeding mock tickets...');
    // Insert Tickets
    const ticket1Result = await db.query(`
      INSERT INTO tickets (ticket_number, customer_id, assigned_to, category, priority, subject, description, status, sla_due) VALUES
      ('NCS-2026-0001', $1, $2, 'Network', 'High', 'Frequent WiFi drops in Main Office Room', 'The WiFi network drops connection every 15-20 minutes on boss computer. Other devices also experience lag.', 'In Progress', NOW() + INTERVAL '2 days')
      RETURNING id;
    `, [ramCustomerId, tech1Id]);

    const ticket2Result = await db.query(`
      INSERT INTO tickets (ticket_number, customer_id, assigned_to, category, priority, subject, description, status, sla_due) VALUES
      ('NCS-2026-0002', $1, $2, 'Hardware', 'Low', 'Printer Toner Replacement', 'HP LaserJet Pro M402 needs toner replacement cartridge 26A.', 'Assigned', NOW() + INTERVAL '5 days')
      RETURNING id;
    `, [ramCustomerId, tech2Id]);

    const ticket3Result = await db.query(`
      INSERT INTO tickets (ticket_number, customer_id, assigned_to, category, priority, subject, description, status, sla_due, resolved_at, closed_at) VALUES
      ('NCS-2026-0003', $1, NULL, 'CCTV', 'Medium', 'Adjust Camera 3 Angle in Warehouse', 'Camera 3 angle is pointing too low. Please adjust to cover the loading bay entrance.', 'Closed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days')
      RETURNING id;
    `, [ramCustomerId]);

    const ticket4Result = await db.query(`
      INSERT INTO tickets (ticket_number, customer_id, assigned_to, category, priority, subject, description, status, sla_due) VALUES
      ('NCS-2026-0004', $1, $2, 'Software', 'High', 'Blue Screen of Death (BSOD) on Boot', 'Dell G15 laptop throws BSOD loop with error "INACCESSIBLE_BOOT_DEVICE" after Windows update.', 'Open', NOW() + INTERVAL '24 hours')
      RETURNING id;
    `, [gitaCustomerId, tech1Id]);

    const ticket1Id = ticket1Result.rows[0].id;
    const ticket3Id = ticket3Result.rows[0].id;
    const ticket4Id = ticket4Result.rows[0].id;

    console.log('Seeding mock ticket updates...');
    // Insert Ticket Updates (Notes/Comments)
    await db.query(`
      INSERT INTO ticket_updates (ticket_id, author_id, message, is_public) VALUES
      ($1, $2, 'I have analyzed the router logs. It seems to be a DHCP IP conflict. Need to assign static IPs to the main PC and check if any custom router is connected by staff.', TRUE)
    `, [ticket1Id, tech1Id]);

    await db.query(`
      INSERT INTO ticket_updates (ticket_id, author_id, message, is_public) VALUES
      ($1, $2, 'Checked signal strength in room. It is strong (-45dBm) but channel congestion is present from neighboring building WiFi. Recommend switching to 5GHz channel.', FALSE)
    `, [ticket1Id, tech2Id]);

    await db.query(`
      INSERT INTO ticket_updates (ticket_id, author_id, message, is_public) VALUES
      ($1, $2, 'Adjusted warehouse Camera 3 angle. It now fully covers the loading bay and garage door entry. Closing ticket.', TRUE)
    `, [ticket3Id, tech1Id]);

    await db.query(`
      INSERT INTO ticket_updates (ticket_id, author_id, message, is_public) VALUES
      ($1, $2, 'Customer states that she has critical college files on the C: drive. Backup is requested before any OS reinstall.', FALSE)
    `, [ticket4Id, ramUserId]);

    console.log('Seeding remote devices...');
    // Insert Remote Devices
    await db.query(`
      INSERT INTO remote_devices (customer_id, nickname, device_type, anydesk_id, teamviewer_id, pin_encrypted, os, hardware_notes, last_accessed, notes) VALUES
      ($1, 'Sharma Boss PC', 'Desktop', '987 654 321', NULL, 'boss1234', 'Windows 11 Pro', 'Intel i7-12700, 16GB RAM, 512GB NVMe SSD. Connected directly via Ethernet.', NOW() - INTERVAL '1 day', 'Highly critical device. Do not update software without approval.'),
      ($1, 'Warehouse Billing Laptop', 'Laptop', '123 456 789', '987654321', 'bill@987', 'Windows 10 Pro', 'Dell Latitude 3420, i5-11th Gen, 8GB RAM. Connected over WiFi.', NOW() - INTERVAL '5 days', 'Billing printer attached via USB (EPSON LQ-310).'),
      ($2, 'Gita Gaming Laptop', 'Laptop', '456 123 789', NULL, NULL, 'Windows 11 Home', 'Asus TUF Gaming A15, AMD Ryzen 7, RTX 3060, 16GB RAM.', NOW() - INTERVAL '10 days', 'Personal system.')
    `, [ramCustomerId, gitaCustomerId]);

    console.log('Seeding ticket feedback...');
    // Insert Feedback
    await db.query(`
      INSERT INTO feedback (ticket_id, customer_id, rating, comment) VALUES
      ($1, $2, 5, 'Adjusted camera captures the warehouse loading area exactly as requested. Excellent support speed!.')
    `, [ticket3Id, ramCustomerId]);

    console.log('Seeding sample blog posts...');
    // Insert Blog Posts
    await db.query(`
      INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published) VALUES
      ($1, $2, $3, $4, $5, TRUE)
    `, [
      'Understanding GPU Cooling: Air vs Liquid Solutions',
      'gpu-cooling-air-vs-liquid',
      'A comprehensive guide to keeping your graphics card temperatures under control with the right cooling solution.',
      `When it comes to keeping your GPU running at optimal temperatures, choosing the right cooling solution is critical. Whether you are a gamer pushing high frame rates or a professional running GPU-intensive workloads, overheating can lead to thermal throttling, reduced performance, and even permanent hardware damage.

Air cooling remains the most popular and cost-effective option for most users. Modern air coolers feature dual or triple fan designs with large heatsinks and direct-contact copper heat pipes. They are easy to install, require zero maintenance, and can handle most mid-range to high-end GPUs effectively. Brands like Noctua and Arctic have set benchmarks for quiet, efficient air cooling.

Liquid cooling — whether through All-in-One (AIO) closed-loop systems or custom open-loop setups — offers superior thermal performance. AIO coolers are a great middle ground: they provide better temperatures than air coolers without the complexity of a full custom loop. Custom loops, while expensive and maintenance-heavy, deliver the absolute best temperatures and allow you to cool both CPU and GPU in a single circuit.

Regardless of the method you choose, do not overlook thermal paste quality. A premium thermal compound like Thermal Grizzly Kryonaut or Noctua NT-H2 can shave off 3–5°C compared to stock paste. Also, configuring a custom fan curve in your BIOS or GPU software ensures your fans ramp up precisely when needed, balancing noise and cooling efficiency.`,
      adminId
    ]);

    await db.query(`
      INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published) VALUES
      ($1, $2, $3, $4, $5, TRUE)
    `, [
      'Top 5 Network Switches for Small Office Setup',
      'best-network-switches-small-office',
      'Choosing the right managed or unmanaged switch can make or break your office network performance.',
      `Setting up a reliable network for a small office starts with choosing the right switch. A network switch connects all your devices — computers, printers, IP cameras, and access points — and determines how efficiently data flows across your local network.

For most small offices with under 20 devices, an unmanaged gigabit switch is the simplest and most cost-effective choice. Models like the TP-Link TL-SG108 (8-port) or Netgear GS316 (16-port) offer plug-and-play operation with no configuration required. They deliver full gigabit speeds on every port, which is more than enough for file sharing, email, and web browsing.

If you need more control, such as VLAN segmentation, QoS priority for VoIP phones, or port mirroring for monitoring, step up to a managed or smart-managed switch. The Cisco CBS220 series and TP-Link TL-SG2210MP are excellent options. They also support PoE (Power over Ethernet), which is essential if you are deploying IP cameras or wireless access points — no separate power adapter needed for each device.

When planning for the future, consider 2.5G switches if your budget allows. As WiFi 6 and WiFi 7 access points become standard, your switch becomes the bottleneck if it only supports 1 Gbps. The QNAP QSW-1105-5T is a fantastic affordable 2.5G option. Always ensure your switch has enough headroom for growth — buy one size larger than your current needs.`,
      adminId
    ]);

    await db.query(`
      INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published) VALUES
      ($1, $2, $3, $4, $5, TRUE)
    `, [
      'SSD vs HDD in 2026: Making the Right Storage Choice',
      'ssd-vs-hdd-2026-guide',
      'With NVMe prices dropping rapidly, is there still a case for traditional hard drives in your build?',
      `The storage landscape has shifted dramatically. NVMe SSDs, once a premium luxury, have become surprisingly affordable in 2026. A 1TB NVMe Gen4 drive now costs roughly the same as a 2TB HDD did just two years ago. But does that mean hard drives are obsolete? Not quite.

For your primary boot drive and frequently accessed applications, an NVMe SSD is non-negotiable. Gen4 drives deliver sequential read speeds of 5,000–7,000 MB/s — roughly 50x faster than a traditional HDD. Gen5 drives push this even further to 12,000+ MB/s, though they run hotter and currently offer diminishing returns for everyday use. Even a SATA SSD at 550 MB/s is a massive upgrade over any spinning disk.

HDDs still have a strong case for bulk storage, NAS (Network Attached Storage) systems, and backup drives. If you need 4TB+ of storage for media libraries, surveillance footage, or archival data, HDDs remain far more cost-effective per gigabyte. The Seagate IronWolf and WD Red series are purpose-built for NAS environments with 24/7 reliability ratings.

When selecting an SSD, pay attention to two often-overlooked specs: DRAM cache and TBW (Terabytes Written) endurance rating. A DRAM-less SSD may be cheaper but suffers in sustained write performance. The Samsung 990 EVO and WD Black SN850X are excellent choices with DRAM cache and high endurance. For most users, a 1TB NVMe boot drive paired with a 4TB HDD for storage is the sweet spot in 2026.`,
      adminId
    ]);

    await db.query(`
      INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published) VALUES
      ($1, $2, $3, $4, $5, TRUE)
    `, [
      'Structured Cabling Best Practices for Modern Offices',
      'structured-cabling-best-practices',
      'Proper cable management and structured wiring can prevent 80% of network issues before they happen.',
      `In our years of setting up office networks across Bharatpur and Chitwan, we have found that the majority of recurring network issues trace back to poor cabling. Loose connections, unlabeled cables, and improper terminations cause intermittent drops that are frustrating to diagnose. Investing in proper structured cabling from day one saves countless hours of troubleshooting later.

Start with CAT6 cable as the minimum standard. CAT6 supports 10 Gbps at short distances (up to 55 meters) and comfortably handles gigabit speeds across a full 100-meter run. For future-proofing, CAT6A is worth the modest extra cost — it supports 10 Gbps at the full 100-meter distance and has better shielding against electromagnetic interference (EMI) from fluorescent lights and power cables.

Every structured cabling installation should include a patch panel at the central network rack. Patch panels provide clean, organized termination points for each cable run, making it easy to add, move, or troubleshoot connections without touching the permanent cabling. Use a punch-down tool for T568B wiring standard terminations and always test each run with a cable tester or Fluke certifier.

Labeling is the unsung hero of cable management. Label both ends of every cable run with a numbering system (e.g., "FL1-R01" for Floor 1, Room 01). Use cable management trays, J-hooks, or vertical organizers to keep runs tidy. Finally, consider running a fiber backbone between floors or buildings — single-mode fiber is incredibly affordable and supports speeds of 100 Gbps+ over kilometers, making it the ultimate future-proof investment.`,
      adminId
    ]);

    console.log('Database Migration & Mock Data Seeding completed successfully!');
  } catch (error) {
    console.error('Error executing database migration:', error);
  } finally {
    // Terminate DB client pool
    db.pool.end();
  }
}

runMigration();
