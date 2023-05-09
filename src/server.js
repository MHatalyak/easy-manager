import express from 'express';
const server = express();
const port = 3000; // or any other port of your choice
import he from 'he';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// import * as JSC from 'jscharting';

// JSC.defaults({ baseUrl: './js/jsc/' });

// export default JSC;

// Set up the view engine
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());

// Set up static files directory
server.use(express.static('public'));
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'irmaro593',
  port: 9477,
  encoding: 'UTF8',
});

client.connect();

// server.use(cookieParser());
// server.use(
//   session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the login_data table to find the user
    const result = await client.query(
      'SELECT * FROM login_data WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rowCount > 0) {
      // User exists, store their email in a cookie to remember them
      res.cookie('email', email);

      // Redirect to the profile page
      res.redirect('/profile');
    } else {
      // User doesn't exist or password is incorrect
      res.render('pages/login', { error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// const isAuthenticated = (req, res, next) => {
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// };
server.get('/profile', async (req, res) => {
  const email = req.cookies.email;

  try {
    // Query the employees table to get the user's profile data
    const result = await client.query(
      'SELECT * FROM employees WHERE email = $1',
      [email]
    );

    if (result.rowCount > 0) {
      // User exists, render the profile page with their data
      try {
        // Fetch employee data from PostgreSQL database based on email
        const employee = await client.query(
          'SELECT * FROM employees WHERE email = $1',
          [email]
        );

        const employeeId = employee.rows[0].id;

        const { technologyNames, percentages, colors } =
          await getEmployeeTechData(employeeId);
        const technologyChart = {
          technologyNames: JSON.stringify(technologyNames),
          percentages: JSON.stringify(percentages),
          colors: JSON.stringify(colors),
        };

        // Render the employee profile page with the technology chart
        res.render('pages/profile', {
          currentPage: 'profile',
          employee: employee.rows[0], // Assuming only one result is expected
          technologyChart,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    } else {
      // User doesn't exist or is not logged in
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// Fetch data from the database
server.get('/', (req, res) => {
  res.render('pages/login', {
    currentPage: 'login',
  });
});

server.get('/clients', (req, res) => {
  client.query('SELECT * FROM team_members', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/clients', {
        currentPage: 'clients',
        teamMembers: result.rows,
      });
      console.log(`${result}`);
    }
  });
});

server.get('/projects', (req, res) => {
  client.query('SELECT * FROM projects', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/projects', {
        currentPage: 'projects',
        projects: result.rows,
      });
      console.log(`${result}`);
    }
  });
});

server.get('/learnings', (req, res) => {
  client.query('SELECT * FROM learnings', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/learnings', {
        currentPage: 'learnings',
        learnings: result.rows,
      });
      console.log(`${result}`);
    }
  });
});

async function getEmployeeTechData(employeeId) {
  const query = `
    SELECT t.name, et.percentage, et.color
    FROM employee_technology et
    JOIN technologies t ON et.technology_id = t.technology_id
    WHERE et.employee_id = $1
  `;

  const { rows } = await client.query(query, [employeeId]);

  const technologyNames = [];
  const percentages = [];
  const colors = [];

  rows.forEach(({ name, percentage, color }) => {
    technologyNames.push(name);
    percentages.push(percentage);
    colors.push(color);
  });

  return { technologyNames, percentages, colors };
}

// Example usage

// server.get('/profile/:name', async (req, res) => {
//   try {
//     const projectManagerName = req.params.name;
//     // Fetch project manager data from PostgreSQL database based on projectManagerName
//     const projectManager = await client.query(
//       'SELECT * FROM employees WHERE name = $1',
//       [projectManagerName]
//     );
//     res.render('pages/profile', {
//       currentPage: 'profile',
//       employee: projectManager.rows[0], // Assuming only one result is expected
//     });
//   } catch (err) {
//     // Handle error
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

server.get('/profile/:name', async (req, res) => {
  const employeeName = req.params.name;

  try {
    // Fetch employee data from PostgreSQL database based on employeeName
    const employee = await client.query(
      'SELECT * FROM employees WHERE name = $1',
      [employeeName]
    );

    const employeeId = employee.rows[0].id;

    const { technologyNames, percentages, colors } = await getEmployeeTechData(
      employeeId
    );
    const technologyChart = {
      technologyNames: JSON.stringify(technologyNames),
      percentages: JSON.stringify(percentages),
      colors: JSON.stringify(colors),
    };

    // Render the employee profile page with the technology chart
    res.render('pages/profile', {
      currentPage: 'profile',
      employee: employee.rows[0], // Assuming only one result is expected
      technologyChart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// server.get('/profile/:team_member_name', async (req, res) => {
//   try {
//     const teamMemberName = req.params.team_member_name;
//     // const employeeName = req.params.employeeName;
//     // const employeeData = await employeeData(employeeName);
//     // res.send(employeeData);

//     // Query the database to fetch employee data based on the teamMemberName
//     const employee = await client.query(
//       'SELECT * FROM employees WHERE name = $1',
//       [teamMemberName]
//     );

//     // Query the database to fetch the employee's technology data
//     // const techData = await client.query(
//     //   `SELECT technologies.name, employee_technology.percentage, employee_technology.color
//     //    FROM technologies
//     //    JOIN employee_technology ON technologies.id = employee_technology.technology_id
//     //    WHERE employee_technology.employee_id = $1`,
//     //   [employee.rows[0].id]
//     // );

//     // Render the profile page with the fetched employee and technology data
//     res.render('pages/profile', {
//       currentPage: 'profile',
//       employee: employee.rows[0],
//       // techData: techData.rows,
//     });

//     // server.use('/custom_js', express.static('public/custom_js'));

//     // res.render('custom_js/pie_diagram.js', {
//     //   employee: employee.rows[0].name,
//     //   techData: techData.rows,
//     // });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// server.get('/profile/:name', (req, res) => {
//   // Get the employee's ID based on their name
//   const query = {
//     text: 'SELECT id FROM employees WHERE name = $1',
//     values: [req.params.name],
//   };
//   client.query(query, (err, result) => {
//     if (err) {
//       console.error(err);
//       res.sendStatus(500);
//       return;
//     }

//     const employeeId = result.rows[0].id;

//     // Get the employee's technology data
//     const query2 = {
//       text: 'SELECT t.name, et.percentage, et.color FROM technology t JOIN employee_technology et ON t.technology_id = et.technology_id WHERE et.employee_id = $1',
//       values: [employeeId],
//     };
//     client.query(query2, (err, result2) => {
//       if (err) {
//         console.error(err);
//         res.sendStatus(500);
//         return;
//       }

//       const techData = result2.rows.map(row => ({
//         name: row.name,
//         percentage: row.percentage,
//         color: row.color,
//       }));

//       // Render the profile page with the tech data
//       res.render('pages/profile', { currentPage: 'profile', techData });
//     });
//   });
// });

// server.get('/template', (req, res) => {
//   res.render('pages/template', {
//     currentPage: 'template',
//   }); // Replace with the name of your EJS template file
// });

server.get('/template', (req, res) => {
  client
    .query('SELECT id, pid, name, title, email, img FROM employees')
    .then(result => {
      const nodes = result.rows.map(row => ({
        id: row.id !== null ? row.id.toString() : null,
        pid: row.pid !== null ? row.pid.toString() : null,
        name: row.name,
        title: row.title,
        email: row.email,
        img: row.img,
      }));

      res.render('pages/template', {
        currentPage: 'template',
        nodes: nodes,
      });
    })
    .catch(error => console.error(error));
});

// server.get('/calendar', (req, res) => {
//   res.render('pages/calendar', {
//     currentPage: 'calendar',
//   }); // Replace with the name of your EJS template file
// });

server.get('/calendar', async (req, res) => {
  client
    .query('SELECT * FROM events')
    .then(result => {
      const events = result.rows.map(row => ({
        id: row.id !== undefined ? row.id : null,
        groupId: row.groupId !== undefined ? row.groupId : null,
        title: row.title,
        start: row.start,
        end: row.end !== undefined ? row.end : null,
        url: row.url !== undefined ? row.url : null,
      }));

      res.render('pages/calendar', {
        currentPage: 'calendar',
        events: events,
      });
    })
    .catch(error => console.error(error));
});

server.post('/events', async (req, res) => {
  const { title, start, end } = req.body;

  try {
    const result = await client.query(
      `
      INSERT INTO events (title, "start", "end")
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [title, start, end]
    );

    const id = result.rows[0].id;
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create event' });
  }
});

server.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    await client.query('DELETE FROM events WHERE id = $1', [eventId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
