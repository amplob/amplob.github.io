require('dotenv').config();
const supabase = require('./supabaseClient');
const fs = require('fs');
const path = require('path');

// Function to read JSON file and insert data
const insertData = async () => {
  // Read JSON file
  const filePath = path.join(__dirname, '../resources/civsGpt.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const civilizations = JSON.parse(fileData);

  // Insert data into Supabase
  for (const civ of civilizations) {
    const { data, error } = await supabase
      .from('civs')
      .insert([
        {
          name: civ.name,
          dateIni: civ.dateIni,
          dateEnd: civ.dateEnd,
          flag_url: civ.flag_url
        }
      ]);

    if (error) {
      console.error('Error inserting row:', error);
    } else {
      console.log('Row inserted:', data);
    }
  }
};

insertData();
