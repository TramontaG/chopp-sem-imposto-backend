import fs from 'fs';
import csv from 'csv-parser';

interface Contact {
  name: string;
  phone: string;
}

const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Remove the leading 55 if present
  const withoutCountryCode = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;
  
  // Format the phone number
  return `(${withoutCountryCode.substring(0, 2)})${withoutCountryCode.substring(2, 7)}-${withoutCountryCode.substring(7)}`;
};

const processCSV = async (filePath: string): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    const contacts: Contact[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        contacts.push({
          name: row.name,
          phone: formatPhoneNumber(row.phone),
        });
      })
      .on('end', () => {
        resolve(contacts);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const removeDuplicates = (contacts: Contact[]): Contact[] => {
  const uniqueContacts: Contact[] = [];
  const seenPhones = new Set<string>();
  
  for (const contact of contacts) {
    if (!seenPhones.has(contact.phone)) {
      seenPhones.add(contact.phone);
      uniqueContacts.push(contact);
    }
  }
  
  return uniqueContacts;
};

const writeCSV = (filePath: string, contacts: Contact[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const csvContent = contacts.map((contact) => `${contact.name},${contact.phone}`).join('\n');
    
    fs.writeFile(filePath, csvContent, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  try {
    const file1Path = 'path/to/file1.csv';
    const file2Path = 'path/to/file2.csv';
    const outputPath = 'path/to/output.csv';
    
    const contacts1 = await processCSV(file1Path);
    const contacts2 = await processCSV(file2Path);
    
    const allContacts = [...contacts1, ...contacts2];
    const uniqueContacts = removeDuplicates(allContacts);
    
    await writeCSV(outputPath, uniqueContacts);
    
    console.log('CSV processing completed successfully.');
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
};

main();