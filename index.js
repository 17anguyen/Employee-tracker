const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`initializing database`)
);

const init = async () => {
  try {
    const userInput = await inquirer.prompt({
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Quit",
      ],
    });
    switch (userInput.options) {
      case "View All Departments":
        viewAllDepartments();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Add Role":
        addRole();
        break;
      case "Update Employee Role":
        updateEmployee();
        break;
      case "Quit":
        process.exit();
    }
  } catch (err) {
    console.log(err);
  }
};

async function viewAllDepartments() {
  const [departments] = await db.promise().query("select * from department");
  console.table(departments);
  init();
}
async function viewAllRoles() {
  const [roles] = await db.promise().query("select * from role");
  console.table(roles);
  init();
}
async function viewAllEmployees() {
  console.log("test");
  try {
    const [employees] = await db.promise().query("select * from employee");
    console.table(employees);
    init();
  } catch (err) {
    console.log(err);
  }
}

async function addDepartment() {
  const userInput = await inquirer.prompt({
    type: "input",
    name: "department",
    message: "What department would you like to add?",
  });
  await db
    .promise()
    .query(`INSERT INTO department (name) VALUES ('${userInput.department}')`);
  viewAllDepartments();
}

async function addEmployee() {
  const [roles] = await db.promise().query("select * from role");
  const [employees] = await db.promise().query("select * from employee");
  console.log(employees);
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the employee",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the employee",
    },
    {
      type: "list",
      name: "role_id",
      message: "Select the role of the employee",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: employees.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }
      )),
    },
  ]);
  console.log(userInput);
  await db
    .promise()
    .query(
      `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${userInput.first_name}','${userInput.last_name}', ${userInput.role_id}, ${userInput.manager_id})`
    );
  viewAllEmployees();
}
async function addRole() {
  const [departments] = await db.promise().query("select * from department");
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of this role?",
    },
    {
      type: "list",
      name: "department",
      message: "What department is the role in?",
      choices: departments.map(({ name, id }) => ({
        name: name,
        value: id,
      })),
    },
  ]);
  console.log(userInput);
  await db
    .promise()
    .query(
      `INSERT INTO role (title,salary,department_id) VALUES ('${userInput.title}', '${userInput.salary}', '${userInput.department}')`
    );
  viewAllRoles();
}

async function updateEmployee() {
  const [employees] = await db.promise().query("select * from employee");
  const [roles] = await db.promise().query("select * from role");
  const userInput = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee would you like to update the role of?",
      choices: employees.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })),
    },
    {
      type: "list",
      name: "role",
      message: "What is the new role of the employee?",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
  ]);
  await db
    .promise()
    .query(
      `UPDATE employee SET role_id = ${userInput.role} WHERE id = ${userInput.employee}`
    );
  viewAllEmployees();
}

init();