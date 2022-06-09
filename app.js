const fs = require('fs');
const express = require('express');

const app = express();
// middleware that can modify the incomming requests
// middleware between req and response
app.use(express.json());
// app.get('/', (req, res) => {
//   res.status(200).json({ Hello: 'Hello from the server', ID: 56 });
// });
// app.post('/', (req, res) => {
//   res.end('You can post to this endpoint');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
app.get('/api/v1/tours/:id', (req, res) => {
  // req.params stores all the parameters which we define in the API
  console.log(req.params);
  // *1 is the trick to change the string to a NUMBER
  const id = req.params.id * 1;
  // First solution to handle if we want to get ID which is not defined in our DB
  // if (id >= tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  const tour = tours.find((el) => el.id === id);
  // Second solution to handle if we want to get ID which is not defined in our DB
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});
// we are not updating  the data here because its hude javascript --> we have to read json file then read properties then update that data, this is dummy data thats why we are not doing update with this dummy json file, BECAUSE in real world we deal with databases not json filess
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour Here...>',
    },
  });
});
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // status code 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
