const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/pravi/OneDrive/Desktop/shivani/frontend/src/pages';
const pages = [
  { file: 'Home.jsx', title: 'Find Your Next Dream Job', desc: 'Shivani Tech is the leading platform for finding software engineering, telehealth, and enterprise architecture jobs.' },
  { file: 'Companies.jsx', title: 'Top Companies Hiring Now', desc: 'Discover great places to work. Get access to millions of company reviews and find your perfect fit at Shivani Tech.' },
  { file: 'Services.jsx', title: 'Career Services & Coaching', desc: 'Accelerate your career with our premium suite of tools and services including interview prep, skill certifications, and career counseling.' },
  { file: 'Financial.jsx', title: 'Strategic Capital & Financials', desc: 'Map your strategic capital against our scaled business trajectories. Shivani Tech builds scalable cloud infrastructure and telehealth products.' },
  { file: 'Contact.jsx', title: 'Contact Us', desc: 'Get in touch with Shivani Technologies. Send us a message about career coaching, job postings, or enterprise solutions.' },
  { file: 'Dashboard.jsx', title: 'Job Seeker Dashboard', desc: 'Manage your job applications, saved jobs, and profile on your Shivani Tech dashboard.' }
];

pages.forEach(p => {
  const filePath = path.join(dir, p.file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has SEO
  if (content.includes('import SEO')) return;

  // Add import
  const importLines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < importLines.length; i++) {
    if (importLines[i].startsWith('import ')) {
      lastImportIdx = i;
    } else if (importLines[i].trim() === '' && lastImportIdx !== -1) {
      // blank line after imports
      break;
    }
  }

  if (lastImportIdx !== -1) {
    importLines.splice(lastImportIdx + 1, 0, `import SEO from '../components/SEO';`);
  }

  content = importLines.join('\n');

  // Insert <SEO ... /> after the first return (
  const returnRegex = /return\s*\(\s*(<[A-Za-z0-9_.\-]+[^>]*>)/;
  
  content = content.replace(returnRegex, (match, p1) => {
    return `return (\n    <>\n      <SEO title="${p.title}" description="${p.desc}" />\n      ${p1}`;
  });
  
  // Close the fragment at the end
  const lastClosingDiv = content.lastIndexOf('</div>\n  );');
  if (lastClosingDiv !== -1) {
     content = content.substring(0, lastClosingDiv) + '</div>\n    </>\n  );' + content.substring(lastClosingDiv + 12);
  } else {
     // try alternative formatting
     const altClosing = content.lastIndexOf('</div >\n  );'); // wait, let's just use a regex for the last closing tag before );
     const matchEnd = content.match(/(\s*<\/[a-zA-Z0-9]+>\s*)\);\s*};/);
     if (matchEnd) {
       content = content.replace(/(\s*<\/[a-zA-Z0-9]+>\s*)\);\s*};/, '$1    </>\n  );\n};');
     } else {
       // Just fallback to replacing the last );
       content = content.replace(/\);\s*};\s*(export default [A-Za-z0-9_]+;\s*)$/, '    </>\n  );\n};\n\n$1');
     }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${p.file} with SEO`);
});
