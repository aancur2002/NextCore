const db = require('./client');

async function seedBlogs() {
  console.log('Seeding troubleshooting blogs...');
  try {
    const blogs = [
      {
        slug: 'preventing-laptop-overheating',
        title: 'Preventing Laptop Overheating: A Complete Guide',
        excerpt: 'Learn the most common causes of laptop overheating and how to prevent permanent hardware damage.',
        content: `Laptops are incredibly convenient, but their compact design makes them prone to overheating. When a laptop gets too hot, it not only becomes uncomfortable to use but can also suffer permanent damage to critical components like the CPU, GPU, and motherboard.

### Common Causes of Overheating

1. **Dust Accumulation:** Over time, dust buildup in the vents and on the cooling fans acts as an insulator, trapping heat inside the chassis.
2. **Blocked Vents:** Using your laptop on soft surfaces like a bed or a pillow blocks the bottom and side exhaust vents, severely restricting airflow.
3. **Dried Thermal Paste:** The thermal paste between the CPU/GPU and the heatsink degrades over time (usually after 2-3 years), reducing its ability to transfer heat effectively.

### Prevention and Maintenance

To keep your laptop running cool and efficiently:
- **Clean the Vents:** Regularly use compressed air to blow out dust from the vents. Do this while the laptop is powered off.
- **Use a Cooling Pad:** A good quality cooling pad with built-in fans can significantly lower operating temperatures during heavy workloads or gaming.
- **Professional Servicing:** If your laptop is over two years old and running hot, it might be time for a professional thermal repasting and internal cleaning. At NextCore System, our technicians can safely disassemble your laptop, clean the fans, and apply premium thermal compound to restore factory cooling performance.

Don't wait until your laptop starts randomly shutting down. Preventive maintenance is always cheaper than a motherboard replacement.`,
        is_published: true,
        author_id: 1 // Assuming admin user has ID 1
      },
      {
        slug: 'spotting-a-failing-hard-drive',
        title: 'How to Spot a Failing Hard Drive Before You Lose Your Data',
        excerpt: 'Warning signs that your hard drive is about to crash and what you should do immediately to save your files.',
        content: `Your computer's hard drive is where all your important documents, family photos, and business data are stored. When a hard drive fails unexpectedly, data recovery can be incredibly expensive and sometimes impossible. Learning to recognize the early warning signs of a failing drive can save you from a digital disaster.

### 4 Warning Signs of a Failing Drive

1. **Strange Noises:** If you hear clicking, grinding, or loud whirring noises coming from your computer, a mechanical hard drive (HDD) failure is imminent. This is often called the "click of death."
2. **Frequent Freezes and Blue Screens:** If your computer frequently freezes, crashes, or displays the Blue Screen of Death (BSOD), especially when opening files, the drive might be struggling to read data.
3. **Corrupted Data:** If files suddenly disappear, refuse to open, or show error messages about being corrupted, the sectors on the drive where they are stored are likely failing.
4. **Extremely Slow Performance:** While slowness can be caused by many things, if opening a small folder or saving a text document takes minutes instead of seconds, your drive's health is severely compromised.

### What to Do Immediately

If you experience any of these symptoms, **do not panic, but act quickly**:
- Immediately back up your most critical files to an external USB drive or cloud storage (Google Drive, Dropbox).
- **Stop using the computer** for non-essential tasks to prevent further wear on the drive.
- Bring your device to a professional IT service center. At NextCore System, we can perform advanced diagnostics to check the drive's SMART status and safely clone your failing drive to a brand-new, ultra-fast SSD (Solid State Drive) without losing your data or operating system.`,
        is_published: true,
        author_id: 1
      },
      {
        slug: 'basic-network-troubleshooting',
        title: 'Basic Network Troubleshooting: Why Is My Internet So Slow?',
        excerpt: 'Simple steps to diagnose and fix common Wi-Fi and network connectivity issues in your home or office.',
        content: `A slow or dropping internet connection is one of the most frustrating tech problems you can face, especially in a professional environment. Before you call your ISP and wait on hold for hours, there are several steps you can take to diagnose and fix the issue yourself.

### Step 1: The Classic Power Cycle
It sounds cliché, but turning it off and on again works. Unplug both your modem and your Wi-Fi router. Wait for a full 60 seconds, then plug the modem back in. Wait for its lights to stabilize, then plug in the router. This clears the devices' cache and forces them to re-establish a fresh connection with your ISP.

### Step 2: Check for Interference
Wi-Fi signals are easily disrupted by physical obstacles and electronic interference. 
- Ensure your router is placed in a central, elevated location.
- Keep it away from microwaves, cordless phones, and thick concrete walls.
- If you live in an apartment building, your neighbor's Wi-Fi might be interfering with yours. Logging into your router settings to change the Wi-Fi channel can significantly improve speed.

### Step 3: Wired vs. Wireless
To determine if the problem is your internet service or just your Wi-Fi, connect a laptop directly to the router using an Ethernet cable. If the speed is fast and stable on the cable but slow on Wi-Fi, the issue is with your wireless router or its configuration, not your ISP.

### When to Call the Pros
If you've tried the basics and are still experiencing dead zones, frequent drops, or slow speeds, it might be time for a network upgrade. NextCore System specializes in enterprise-grade network solutions. We can run CAT6 cables for wired reliability, install seamless Mesh Wi-Fi systems for total coverage, and configure secure routers to keep your business running smoothly without interruption.`,
        is_published: true,
        author_id: 1
      }
    ];

    for (const blog of blogs) {
      await db.query(`
        INSERT INTO blogs (slug, title, excerpt, content, is_published, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO NOTHING;
      `, [blog.slug, blog.title, blog.excerpt, blog.content, blog.is_published, blog.author_id]);
    }
    
    console.log('Blogs seeded successfully.');
  } catch (err) {
    console.error('Error seeding blogs:', err);
  } finally {
    db.pool.end();
  }
}

seedBlogs();
