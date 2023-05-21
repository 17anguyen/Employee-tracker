const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
const db = require("./config/connection");

const init = async () => {
  try {
    const userInput = await inquirer.prompt({
      type: "list",
      name: "options",
      message: "Please select an option",
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

const viewAllDepartments = async () => {
  try {
    const [rows, fields] = await db.promise().query(`SELECT id, name FROM departments`);
    console.table(rows);
    init();
  } catch (err) {
    console.log(err);
  }

};

const viewAllRoles = async () => {
  try {
    console.log("roles init");
    const queryStr = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`;
    const [rows, fields] = await db.promise().query(queryStr);
    console.table(rows);
    init();
  } catch (err) {
    console.log(err);
  }

};
const viewAllEmployees = async () => {
  console.log("employee init");
  try {
    const queryStr = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees m ON employees.manager_id = m.id`;
    const [rows, fields] = await db.promise().query(queryStr);
    console.table(rows);
    init();
  } catch (err) {
    console.log(err);
  }
};

const addDepartment = async () => {
  try {
    console.log("add department init");
    const userInput = await inquirer.prompt({
      type: "input",
      name: "department",
      message: "What department would you like to add?",
    });
    await db
      .promise()
      .query(`INSERT INTO departments (name) VALUES ('${userInput.department}')`);
    console.log(`${userInput.department} department has been added to the database!\n`);
    viewAllDepartments();
  } catch (err) {
    console.log(err);
  }

}

const addEmployee = async () => {
  console.log("add employee init");
  const [roles] = await db.promise().query("select * from roles");
  const [employees] = await db.promise().query("select * from employees");
  console.log(employees);
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter first name",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter last name",
    },
    {
      type: "list",
      name: "role_id",
      message: "Select employee role",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
    {
      type: "list",
      name: "manager_id",
      message: "Whos team will this employee work?",
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
      `INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES ('${userInput.first_name}','${userInput.last_name}', ${userInput.role_id}, ${userInput.manager_id})`
    );
  viewAllEmployees();
}
const addRole = async () => {
  const [departments] = await db.promise().query("select * from departments");
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Add a title",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of this role?",
    },
    {
      type: "list",
      name: "department",
      message: "What department will this be added to?",
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
      `INSERT INTO roles (title,salary,department_id) VALUES ('${userInput.title}', '${userInput.salary}', '${userInput.department}')`
    );
  viewAllRoles();
}

const updateEmployee = async () => {
  const [employees] = await db.promise().query("select * from employees");
  const [roles] = await db.promise().query("select * from roles");
  const userInput = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee would you like to update?",
      choices: employees.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })),
    },
    {
      type: "list",
      name: "role",
      message: "Update the employees new roll",
      choices: roles.map(({ title, id }) => ({
        name: title,
        value: id,
      })),
    },
  ]);
  await db
    .promise()
    .query(
      `UPDATE employees SET role_id = ${userInput.role} WHERE id = ${userInput.employee}`
    );
  viewAllEmployees();
}

init();