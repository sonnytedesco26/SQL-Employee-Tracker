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

        if(options === 'View departments'){
            displayDepartments();
        }
    })
};

function displayDepartments(){

};

function displayRoles(){

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

};