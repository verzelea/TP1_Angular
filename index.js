import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

async function getFoxImage() {
  try {
    const fox = await axios.get('https://randomfox.ca/floof/');
    return fox.data.image;
  } catch (e) {
    console.error(`Error : ${e}`);
    return null;
  }
}

async function getFactCat(amount = 0) {
  try {
    let fact;

    if (fact <= 0) {
      fact = await axios.get(
        `https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1`,
      );
    } else {
      fact = await axios.get(
        `https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=${amount}`,
      );
    }

    const filteredFacts = fact.data.map((fact) => {
      return fact.text;
    });

    return filteredFacts;
  } catch (e) {
    console.error(`Error : ${e}`);
    return null;
  }
}

async function getHolidays(countryCode = 'FR') {
  try {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const holidays = await axios.get(
      `https://date.nager.at/api/v2/PublicHolidays/2021/${countryCode}`,
    );
    return holidays.data;
  } catch (e) {
    console.error(`Error : ${e}`);
    return null;
  }
}

async function fetchApis(countryCode) {
  const foxImage = await getFoxImage();
  const catFacts = await getFactCat(3);
  const holidays = await getHolidays(countryCode);

  return {
    foxPicture: foxImage,
    catFacts: catFacts,
    holidays: holidays,
  };
}

app.post('/', async (req, res) => {
  return await fetchApis(req.body.countryCode);
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
