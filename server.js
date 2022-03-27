//imports
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeesdb'
});
//start connection, call necessary functions
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
//main menu presentation
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
        //choices here will NOT work properly without {}, due to ES6
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
//let user know what's happening, throw new line 
function displayDepartments(){
    console.log('Displaying departments \n');
    const statement = `SELECT id,   
                       name AS department 
                       FROM department`;
    //run query against established connection
    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        //when done, go back to "main menu"
        userPrompt();
    });
};
//inner join to not double count
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
    //left join here to leave out other columns from department and role
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
                //checks if user just didn't enter anything
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
        //takes response from inquirer prompt to use with query for parameters for query
        connection.query(statement, response.depAdd, function (error, result){
            if(error) throw error;
            //let user know what they added, then display the changes (which also calls main menu from display function)
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
        //get list of departments to choose where role is
        const input = [response.roleAdd, response.salaryAdd];
        const listDepartments = `SELECT * FROM department`;

        connection.query(listDepartments, function(error, result){
            if(error) throw error;
            //map the name and associated id from query
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
                //push department choice into our input list item, throw them all into query
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
                //enter first and last name separately, tried together but was annoying
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
        //get list of existing roles to create list to choose from
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
                //same type of for managers like done for roles
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
            //create empty list item, will eventually be populated by role_id and employee (indexes 0 and 1)
            const roleEmployee = [];
            //push selection into roleEmployee item
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
//Kill connection if user doesn't wanna do anything
function doNothing(){
    connection.end();
};