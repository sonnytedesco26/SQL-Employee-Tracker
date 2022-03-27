INSERT INTO department (name) VALUES
('Advertising'),
('Production'),
('HR'),
('Development'),
('Sales');

INSERT INTO role (title, salary, department_id) VALUES
('Creative Director', 90000, 1),
('Chief Marketing Officer', 120000, 1),
('Software Engineer', 40000, 4),
('Production Lead', 86000, 2),
('Marketing Director', 74000, 5),
('HR Director', 89000, 3),
('Chief diversity officer', 80000, 3),
('CIO', 111000, 4),
('Mechanical Engineer', 67000, 2),
('Recruiter', 56000, 3),
('Sales consultant', 45000, 5),
('Regional Sales Manager', 69000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Bob', 'Barker', 1, 1),
('Lindsay', 'Willis', 1, 2),
('Saget', 'Bob', 2, NULL),
('David', 'Dickens', 3, 8),
('Steve', 'Richardson', 3, NULL),
('Chester', 'Malone', 4, NULL),
('Tony', 'Two Shoes', 5, 5),
('Nicholas', 'Cage', 11, 12),
('Hank', 'Hill', 10, 6)
('Denice', 'Desalad' 9, NULL)
('Mantis', 'Toboggan', 6, NULL)
('Mac', 'Miller', 7, 6),
('Brian', 'Blian', 8, NULL)
('Stephanie', 'Sodds', 12, NULL);

