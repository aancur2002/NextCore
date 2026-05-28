const db = require('../db/client');

async function seedBlogs() {
  console.log('Seeding sample blog posts...');
  const posts = [
    {
      title: 'Understanding GPU Cooling Solutions',
      slug: 'gpu-cooling-solutions',
      excerpt: 'Learn how modern GPUs stay cool and what you can do to improve cooling for gaming rigs.',
      content: `# GPU Cooling Solutions

Modern graphics cards generate a lot of heat. Effective cooling ensures stability and longevity.

## Air Cooling
- Large heatsinks with heat pipes
- High static pressure fans

## Liquid Cooling
- Closed-loop AIOs are popular for high‑end builds.
- Custom loops provide best thermal performance.

## Tips
1. Keep case airflow balanced.
2. Clean dust filters regularly.
3. Use good thermal paste.
`,
      author_id: 1,
      is_published: true
    },
    {
      title: 'Top 5 Network Switches for Small Offices',
      slug: 'top-5-network-switches',
      excerpt: 'A quick guide to choosing reliable switches for SMB environments.',
      content: `# Top 5 Switches for Small Offices

Choosing the right switch can save money and improve network reliability.

1. **Ubiquiti UniFi Switch 8** – Managed, PoE, easy UI.
2. **Cisco SG250‑10** – Enterprise‑grade features.
3. **Netgear GS108** – Simple, plug‑and‑play.
4. **TP-Link TL‑SG108E** – Smart switch with VLAN support.
5. **MikroTik CRS312‑4C‑+ – Compact, powerful routing.

## What to Look For
- **Port count**: Ensure future scalability.
- **PoE**: For IP cameras or APs.
- **Managed vs Unmanaged**: Managed gives VLANs and QoS.
- **Warranty & support**.
`,
      author_id: 1,
      is_published: true
    },
    {
      title: 'How to Choose the Right SSD for Your PC',
      slug: 'choose-right-ssd',
      excerpt: 'Factors to consider when picking an SSD for performance and budget.',
      content: `# Choosing the Right SSD

When upgrading storage, SSD type matters.

## SATA vs NVMe
- **SATA SSD**: Up to 550 MB/s, cheap, great for older systems.
- **NVMe SSD**: Up to 7 GB/s, uses PCIe lanes, best for high‑end PCs.

## Capacity Planning
- 256 GB – OS & essential apps.
- 512 GB – OS + games.
- 1 TB+ – Media libraries.

## Endurance (TBW)
Higher TBW means longer lifespan for write‑heavy workloads.

## Recommendations
- **Budget**: Crucial MX500 (SATA)
- **Performance**: Samsung 970 EVO Plus (NVMe)
- **Value**: WD Blue SN550 (NVMe)
`,
      author_id: 1,
      is_published: true
    },
    {
      title: 'Cable Management Tips for Home Labs',
      slug: 'cable-management-home-lab',
      excerpt: 'Organize your cables for a tidy and efficient home lab setup.',
      content: `# Cable Management for Home Labs

A clean rack improves airflow and troubleshooting.

## Tools
- Velcro straps
- Cable combs
- Z‑band ties
- Label makers

## Steps
1. **Plan routes** before plugging devices.
2. **Bundle cables** by function (power, network, serial).
3. **Label each bundle** at both ends.
4. **Route cables** behind the rack using cable trays.
5. **Leave slack** for future upgrades.

## Quick Wins
- Use zip ties for short runs.
- Hide power cords under the desk.
- Color‑code network cables by VLAN.
`,
      author_id: 1,
      is_published: true
    }
  ];

  for (const post of posts) {
    await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, author_id, is_published) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING`,
      [post.title, post.slug, post.excerpt, post.content, post.author_id, post.is_published]
    );
    console.log(`Inserted blog: ${post.title}`);
  }
  console.log('Blog seeding complete.');
}

seedBlogs().then(() => process.exit()).catch(err => { console.error(err); process.exit(1); });
