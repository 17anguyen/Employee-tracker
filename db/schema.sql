DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE
    departments(
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );

CREATE TABLE
    roles(
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
    );

CREATE TABLE
    employees(
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        manager_id INT,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE
        SET NULL
    );