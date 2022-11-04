const { parse } = require('csv-parse');
const fs = require('fs');

const readStream = fs.createReadStream('kepler_dataset.csv');

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

readStream
  .pipe(
    parse({
      comment: '#',
      columns: true,
    })
  )
  .on('data', (data) => {
    if (isHabitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => planet['kepler_name']));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
