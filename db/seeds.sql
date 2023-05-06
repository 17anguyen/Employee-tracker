INSERT INTO departments (name)
VALUES ("Engineering"), ("Finance"), ("Legal") ("Marketing");

INSERT INTO
    roles (title, salary, department_id)
VALUES
("Community Developer", 250000 ,1),
("Video Editor", 80000 ,1),

("SR Software Developer", 250000,2),
("JR Software Developer", 90000,2),

("SR Accountant", 250000,3),
("JR Accountant", 80000,3),

("Attorney", 250000,4),
("Legal Assistant", 100000,4),



INSERT INTO
    employees (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES
("Alivia","Thomas",2,1),
("Ashleigh", "Chute", 2, null),
("Tyrin", "Stevenson",1, null),
("Stephon", "Van",1,2),
("Michael", "Daly",3,null),
("Kevin","Schoenberger",4,null),
("Elyzabeth", "Allshouse",4,3);


   