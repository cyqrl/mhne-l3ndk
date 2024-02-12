const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const fs1 = require('fs').promises;
const ratingsFile = 'ratings.json';
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit/', (req, res) => {
  const { name, phone, location, subject, description } = req.body;

  const worksDir = './public/works';
  const filePath = `${worksDir}/${name}.html`; // Declare filePath here

  if (fs.existsSync(filePath)) {
      return res.status(409).send('File with the same name already exists. Please choose a different name.');
  }
  const content = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport"content="width=device-width,initial-scale=1.0"><title>${name}'s work</title><link rel="stylesheet"href="./styles.css"></head><body><header id="header"><div class="main"><a href="../index.html"class="logo"><img src="../images/l.png"></a><a href="../index.html"class="ll home hover">الصفحة الرئيسية</a><a href="../works.html"class="ll courses hover">الاعمال</a><a href="../makeWork.html"class="ll account hover">إنشاء عمل</a><a href="../contact/contact.html"class="ll contact hover">تواصل معنا</a></div></header><h1>عمل : ${name}</h1><table><tr><th>الاسم</th><td>${name}</td></tr><tr><th>رقم الهاتف</th><td>${phone}</td></tr><tr><th>الموقع</th><td>${location}</td></tr><tr><th>العمل</th><td id="subject">${subject}</td></tr><tr><th>الوصف</th><td id="description">${description}</td></tr></table><h2>أعطِ تقييمك على عمله</h2><form id="commentForm"><div id="averageRating">متوسط التقييم: يتم التحميل</div><div class="stars"><input type="radio"id="star5"name="rating"value="5"><label for="star5">&#9733;</label><input type="radio"id="star4"name="rating"value="4"><label for="star4">&#9733;</label><input type="radio"id="star3"name="rating"value="3"><label for="star3">&#9733;</label><input type="radio"id="star2"name="rating"value="2"><label for="star2">&#9733;</label><input type="radio"id="star1"name="rating"value="1"><label for="star1">&#9733;</label></div><button type="submit">Submit</button></form><script src="script.js"></script></body></html>`;
  if (!fs.existsSync(worksDir)) {
    fs.mkdirSync(worksDir);
}

// Write the HTML content to a file
fs.writeFileSync(filePath, content);

// Redirect the user to the newly created work page
res.redirect(`/works/${name}.html`);
});

const { JSDOM } = require('jsdom');

const path = require('path');

const cors = require('cors');
app.use(cors());
const directoryPath = path.join(__dirname, './public/works');


app.get('/files', (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    // Filter HTML files and remove extension
    const htmlFiles = files.filter(file => path.extname(file) === '.html');

    // Read description from each HTML file
    const descriptions = htmlFiles.map(file => {
      const fileNameWithoutExtension = file.slice(0, -5); // Remove last 5 characters (".html")
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(fileContent);
      const descriptionElement = dom.window.document.querySelector('#description');
      const description = descriptionElement ? descriptionElement.textContent.trim() : 'No description Found';
      const subjectElement = dom.window.document.querySelector("#subject")
      const subject = subjectElement ? subjectElement.textContent.trim() : "No Subject Found";
      return { filename: fileNameWithoutExtension, description, subject };
    });

    res.json(descriptions);
  });
});


app.use(bodyParser.json());

app.post('/submitRating', async (req, res) => {
    try {
      const { siteName, rating } = req.body;
      const userIP = req.ip;
  
      const ratings = await loadRatings();
      
    
      if (ratings[siteName] && ratings[siteName].ips.includes(userIP)) {
        return res.status(403).json({ success: false, error: 'You have already submitted a rating for this site.' });
      }
  
    
      if (!ratings[siteName]) {
        ratings[siteName] = { ratings: [], average: '', ips: [] };
      }
      ratings[siteName].ips.push(userIP);
  
    
      ratings[siteName].ratings.push(parseInt(rating));
  
    
      const sum = ratings[siteName].ratings.reduce((acc, val) => acc + val, 0);
      const average = sum / ratings[siteName].ratings.length;
      ratings[siteName].average = isNaN(average) ? '' : average.toFixed(1);
  
    
      await saveRatings(ratings);
      res.json({ success: true, averageRating: ratings[siteName].average });
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).json({ success: false, error: 'Error submitting rating' });
    }
  });
  
app.get('avr', async (req,res) => {
  try {
    const ratings = await loadRatings();
    res.json(ratings);
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).json({ error: 'Error getting average rating' });
  }
})

app.get('/averageRating/:siteName', async (req, res) => {
    try {
      const ratings = await loadRatings();
      const averageRating = ratings[req.params.siteName];
      res.json(averageRating);
    } catch (error) {
      console.error('Error getting average rating:', error);
      res.status(500).json({ error: 'Error getting average rating' });
    }
  });

async function loadRatings() {
  try {
    const data = await fs1.readFile(ratingsFile);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveRatings(ratings) {
  await fs1.writeFile(ratingsFile, JSON.stringify(ratings, null, 2));
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


