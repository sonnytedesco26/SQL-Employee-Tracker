//imports
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { up } = require('inquirer/lib/utils/readline');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeesdb'
});

connection.connect(error =>{
    if(error) throw error;
    titleDrop();
    userPrompt();
});

function titleDrop(){
    console.log('****************************');
    console.log('**                        **');
    console.log('**                        **');
    console.log('**    EMPLOYEE MANAGER    **');
    console.log('**                        **');
    console.log('**                        **');
    console.log('****************************');
};

function userPrompt(){
    inquirer.prompt(
        [{
            type: 'list',
            name: 'choices',
            message: 'What do you want to do?',
            choices: [
                'View departments',
                'View roles',
                'View employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update employee role',
                'Nothing'
            ]
        }]
    ).then((response) => {
        const {choices} = response;

        if(choices == 'View departments'){
            displayDepartments();
        }
        if(choices == 'View roles'){
            displayRoles();
        }
        if(choices == 'View employees'){
            displayEmployees();
        }
        if(choices == 'Add department'){
            addDepartment();
        }
        if(choices == 'Add role'){
            addRole();
        }
        if(choices == 'Add employee'){
            addEmployee();
        }
        if(choices == 'Update employee role'){
            updateEmployeeRole();
        }
        if(choices == 'Nothing'){
            doNothing();
        }
    }
    );
};

function displayDepartments(){
    console.log('Displaying departments \n');
    const statement = `SELECT id,   
                       name AS department 
                       FROM department`;

    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        userPrompt();
    });
};

function displayRoles(){
    console.log('Displaying roles \n');
    const statement = `SELECT r.id, 
                       r.title,   
                       d.name AS department 
                       FROM role r 
                       INNER JOIN department d 
                       ON r.department_id = d.id`;

    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        userPrompt();
    });
};

function displayEmployees(){
    console.log('Displaying employees \n');

    const statement = `Select e.id,
                       e.first_name,
                       e.last_name,
                       d.name AS department,
                       r.title,
                       CONCAT (m.first_name, ' ', m.last_name) AS manager,
                       r.salary
                       FROM employee e
                       LEFT JOIN role r
                       ON e.role_id = r.id
                       LEFT JOIN department d
                       ON r.department_id = d.id
                       LEFT JOIN employee m on e.manager_id = m.id`;

    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        userPrompt();
    });
};

function addDepartment(){
    inquirer.prompt(
        [{
            type: 'input',
            name: 'depAdd',
            message: 'What department would you like to add?',
            validate(depAdd){
                if(depAdd){return true;}
                else{
                    console.log('Must enter department name');
                    return false
                }

            }
        }]
    ).then(response =>{
        const statement = `INSERT INTO department
                           (name) VALUES (?)`;
        connection.query(statement, response.depAdd, function (error, result){
            if(error) throw error;
            console.log(`Added ${response.depAdd} to departments`);
            displayDepartments();
        })
    });
};

function addRole(){
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'roleAdd',
                message: 'What role would you like to add?',
                validate(roleAdd){
                    if(roleAdd){return true;}
                    else{
                        console.log('Must enter role name');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salaryAdd',
                message: 'What is the annual salary for this role?',
                validate(salaryAdd){
                    if(salaryAdd){return true;}
                    else{
                        console.log('Must enter salary amount');
                        return false;
                    }
                }
            }
        ]
    ).then(response =>{
        const input = [response.roleAdd, response.salaryAdd];
        const listDepartments = `SELECT * FROM department`;

        connection.query(listDepartments, function(error, result){
            if(error) throw error;
            const dep = result.map(({name, id}) => ({name: name, value: id}));
            
            inquirer.prompt(
                [{
                    type: 'list',
                    name: 'dep',
                    message: 'What department does this role belong to?',
                    choices: dep
                }]
            ).then(depChoice =>{
                const dep = depChoice.dep;
                input.push(dep);

                const statement = `INSERT INTO role
                                   (title, salary, department_id)
                                   VALUES (?,?,?)`;
                connection.query(statement, input, function(error, result){
                    if(error) throw error;
                    console.log(`Added ${response.roleAdd} to roles`);
                    displayRoles();
                })
            })
        });
    });
};

function addEmployee(){
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'firstName',
                message: "What's the employee's first name?",
                validate(firstName){
                    if(firstName){return true;}
                    else{
                        console.log('Must enter first name');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What's the employee's last name?",
                validate(lastName){
                    if(lastName){return true;}
                    else{
                        console.log('Must enter last name');
                        return false;
                    }
                }
            }
        ]
    ).then(response =>{
        const input = [response.firstName, response.lastName];
        const listRoles = `SELECT id, title FROM role`;

        connection.query(listRoles, function(error, result){
            if(error) throw error;

            const roles = result.map(({id, title}) => ({name: title, value: id}));

            inquirer.prompt(
                [{
                    type:'list',
                    name: 'role',
                    message: "What is employee's role?",
                    choices: roles
                }]
            ).then(choice =>{
                const role = choice.role;
                input.push(role);

                const listManagers = `SELECT * FROM employee`;
                connection.query(listManagers, function(error, result){
                    if(error) throw error;
                    const managers = result.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value:id}));

                    inquirer.prompt(
                        [{
                            type: 'list',
                            name: 'manager',
                            message: "Who is employee's manager?",
                            choices: managers
                        }]
                    ).then(choice =>{
                        const manager = choice.manager;
                        input.push(manager);

                        const statement = `INSERT INTO employee
                                           (first_name, last_name, role_id, manager_id)
                                           VALUES (?,?,?,?)`;
                        connection.query(statement, input, function(error, result){
                            if(error) throw error;
                            console.log('Employee added')
                            displayEmployees();
                        })
                    })
                });
            })
        });
    })
};

function updateEmployeeRole(){
    const employeeList = `SELECT * FROM employee`;

    connection.query(employeeList, function(error, result){
        if(error) throw error;

        const employees = result.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));

        inquirer.prompt(
            [{
                type: 'list',
                name: 'name',
                message: 'Whose information would you like to update?',
                choices: employees
            }]
        ).then(choice =>{
            const employee = choice.name;
            const roleEmployee = [];

            roleEmployee.push(employee)

            const listRoles = `SELECT * FROM role`;
            connection.query(listRoles, function(error, result){
                if(error) throw error;
                const roles = result.map(({id, title}) => ({name: title, value: id}));

                inquirer.prompt(
                    [{
                        type: 'list',
                        name: 'role',
                        message: "What is their new role?",
                        choices: roles
                    }]
                ).then(choice =>{
                    const role = choice.role;
                    roleEmployee.push(role);

                    roleEmployee[0] = role;
                    roleEmployee[1] = employee;

                    const update = `UPDATE employee
                                    SET role_id = ?
                                    WHERE id = ?`;
                    connection.query(update, roleEmployee, function(error, result){
                        if(error) throw error;
                        console.log("Employee updated");
                        displayEmployees();
                    })
                })
            });
        })
    });

    
};

function doNothing(){
    connection.end();
};