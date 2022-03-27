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
            name: 'options',
            message: 'What do you like to do?',
            options: [
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
    ).then((responses) => {
        const options = responses;

        if(options == 'View departments'){
            displayDepartments();
        }
        if(options == 'View roles'){
            displayRoles();
        }
        if(options == 'View employees'){
            displayEmployees();
        }
        if(options == 'Add department'){
            addDepartment();
        }
        if(options == 'Add role'){
            addRole();
        }
        if(options == 'Add employee'){
            addEmployee();
        }
        if(options == 'Update employee role'){
            updateEmployeeRole();
        }
        if(options == 'Nothing'){
            doNothing();
        }
    }
    );
};

function displayDepartments(){
    console.log('Displaying departments \n');
    const statement = `SELECT id, name AS department from department`;

    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        userPrompt();
    });
};

function displayRoles(){
    console.log('Displaying roles \n');
    const statement = `SELECT r.id, r.title, d.name AS department 
                       FROM role r INNER JOIN department d 
                       ON r.department_id = d.id`;
                       
    connection.query(statement, function (error, result){
        if(error) throw error;
        console.table(result);
        userPrompt();
    });
};

function displayEmployees(){

};

function addDepartment(){

};

function addRole(){

};

function addEmployee(){

};

function updateEmployeeRole(){

};

function doNothing(){
    connection.end();
};