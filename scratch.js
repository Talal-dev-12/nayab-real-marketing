const fs = require('fs');
const files = [
  'c:/Users/DELL/Desktop/Nayab Real Marketing/nayab-real-marketing/src/app/(Auth)/sign-in/page.tsx',
  'c:/Users/DELL/Desktop/Nayab Real Marketing/nayab-real-marketing/src/app/(Auth)/sign-up/page.tsx',
  'c:/Users/DELL/Desktop/Nayab Real Marketing/nayab-real-marketing/src/app/(Auth)/sign-up/seller/page.tsx',
  'c:/Users/DELL/Desktop/Nayab Real Marketing/nayab-real-marketing/src/app/(Auth)/forgot-password/page.tsx',
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');

  // container max-width & height
  text = text.replace(/max-w-\[1100px\]/g, 'max-w-[900px] lg:max-w-[1000px]');
  text = text.replace(/lg:min-h-\[700px\]/g, 'lg:min-h-[550px]');
  text = text.replace(/lg:h-\[700px\]/g, 'lg:h-[550px]');
  text = text.replace(/lg:h-\[1000px\]/g, 'lg:h-[650px]'); // for seller

  // panel padding
  text = text.replace(/p-8 sm:p-12 xl:pr-8 xl:pl-8/g, 'p-6 sm:p-8 md:p-10');
  text = text.replace(/p-8 sm:p-12 xl:p-14/g, 'p-6 sm:p-8 md:p-10');
  text = text.replace(/p-8 sm:p-12 xl:pr-12 xl:pl-12/g, 'p-6 sm:p-8 md:p-10');
  
  // logo sizing
  text = text.replace(/w-12 h-12/g, 'w-10 h-10');
  text = text.replace(/size=\{24\}/g, 'size={20}');
  text = text.replace(/text-\[1\.1rem\]/g, 'text-[0.95rem]');
  text = text.replace(/text-\[1\.2rem\]/g, 'text-[1.05rem]'); // forgot password
  text = text.replace(/mb-10/g, 'mb-6');
  text = text.replace(/mb-8/g, 'mb-5');

  // titles
  text = text.replace(/text-\[2\.5rem\]/g, 'text-3xl');
  text = text.replace(/text-\[2\.2rem\]/g, 'text-2xl'); // forgot password, seller
  
  // body text
  text = text.replace(/text-\[15px\]/g, 'text-sm');
  text = text.replace(/text-\[16px\]/g, 'text-sm'); // forgot password
  text = text.replace(/text-\[14px\]/g, 'text-xs');
  text = text.replace(/text-\[13px\]/g, 'text-xs');
  text = text.replace(/text-\[12px\]/g, 'text-[11px]');
  text = text.replace(/text-\[11px\]/g, 'text-[10px]');
  
  // button padding
  text = text.replace(/py-4/g, 'py-2.5');
  text = text.replace(/py-3/g, 'py-2');
  
  // input padding
  text = text.replace(/py-2\.5/g, 'py-2');
  
  // gap
  text = text.replace(/gap-3/g, 'gap-2');
  text = text.replace(/mb-6/g, 'mb-4');
  
  // image text
  text = text.replace(/text-\[24px\]/g, 'text-xl');
  text = text.replace(/text-\[28px\]/g, 'text-2xl');

  // rounded adjustments
  text = text.replace(/rounded-\[2\.5rem\]/g, 'rounded-3xl');
  text = text.replace(/rounded-\[2rem\]/g, 'rounded-2xl');
  
  // Top right banner text
  text = text.replace(/top-12 right-12/g, 'top-8 right-8');
  
  fs.writeFileSync(f, text);
});
