(function() {
    'use strict';

    function Task( config ) {
        this.name = config.name;
        this.due = config.due;
    }

    Task.prototype.setContainer = function( container ) {
        this.container = container;
    };

    Task.prototype.update = function( config ) {
        Object.assign( this, config );
        this.render();
    };

    Task.prototype.render = function() {
        this.container.innerHTML = `
            <div class="task cursor">
                ${this.name}
                <i class="edit fas fa-pencil-alt cursor"></i>
            </div>
            <div class="edit-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="edit-input full-width-input"></textarea>
                    <div class="edit-form-actions">
                        <button class="btn btn-inline btn-primary edit-button cursor">Update Task</button>
                        <i class="fas fa-2x fa-times edit-cancel cursor"></i>
                    </div>
                </form>
            </div>
        `;

        this.container.querySelector( '.edit' ).addEventListener( 'click', () => {
            this.container.querySelector( '.task' ).classList.add( 'hide' );
            this.container.querySelector( '.edit-form' ).classList.remove( 'hide' );
            this.container.querySelector( '.edit-input' ).value = this.name;
        });

        this.container.querySelector( '.edit-cancel' ).addEventListener( 'click', () => {
            this.container.querySelector( '.edit-form' ).classList.add( 'hide' );
            this.container.querySelector( '.task' ).classList.remove( 'hide' );
        });

        this.container.querySelector( '.edit-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const Tasktext = this.container.querySelector( '.edit-input' ).value;
            if( Tasktext.trim() !== '' ) {
                this.update({
                    name: Tasktext
                });
            }
        });
    };

    function Tasklist( config ) {
        this.name = config.name;
        this.tasks = config.tasks.map( taskConfig => new Task( taskConfig ) );
    }

   Tasklist.prototype.setContainer = function( container ) {
        this.container = container;
    };

   Tasklist.prototype.renderTasks = function( container ) {
        this.tasks.forEach( this.renderTask.bind( this, container ) );
    };

   Tasklist.prototype.renderTask = function( container, task ) {
        const TaskWrapper = document.createElement( 'div' );
        TaskWrapper.classList.add( 'task-wrapper' );

        container.appendChild( TaskWrapper );
        
        task.setContainer( TaskWrapper );
        task.render();
    };

   Tasklist.prototype.renderAddCard = function( container ) {
        if( this.tasks.length === 0 ) {
            container.innerHTML = `<div class="add-card-message cursor">+ Add card</div>`;
        } else {
            container.innerHTML = `<div class="add-card-message cursor">+ Add another card</div>`;
        }

        container.innerHTML += `
            <div class="add-card-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="add-card-input full-width-input"></textarea>
                    <div class="add-card-form-actions">
                        <button class="btn btn-inline btn-primary add-card-button cursor">Add Card</button>
                        <i class="fas fa-2x fa-times add-card-cancel cursor"></i>
                    </div>
                </form>
            </div>
        `;

        container.querySelector( '.add-card-message' ).addEventListener( 'click', function() {
            this.classList.add( 'hide' );
            container.querySelector( '.add-card-form' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-card-cancel' ).addEventListener( 'click', function() {
            container.querySelector( '.add-card-form' ).classList.add( 'hide' );
            container.querySelector( '.add-card-message' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-card-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const Tasktext = container.querySelector( '.add-card-input' ).value;
            if( Tasktext.trim() !== '' ) {
                this.pushTask(new Task({
                    name: Tasktext,
                    due: new Date()
                }));
            }
        });
    };

   Tasklist.prototype.render = function() {
        this.container.innerHTML = `
            <div class="task-list">
                <div class="task-list-title-container">
                    <h3 class="task-list-title">${this.name}</h3>
                    <span class="task-list-more cursor">...</span>
                </div>
                <div class="tasks-wrapper"></div>
                <div class="add-card-wrapper"></div>
            </div>
        `;

        this.renderTasks( this.container.querySelector( '.tasks-wrapper' ) );
        this.renderAddCard( this.container.querySelector( '.add-card-wrapper' ) );
    };

   Tasklist.prototype.pushTask = function( task ) {
        this.tasks.push( task );
        this.render();
    };

    function Board( config, container ) {
        this.setContainer( container );
        this.name = config.name;
        this.taskLists = config.taskLists.map( taskListConfig => new Tasklist( taskListConfig ) );
    }

    Board.prototype.setContainer = function( container ) {
        this.container = container;
    };

    Board.prototype.render = function() {
        this.container.innerHTML = `
            <div class="board-menubar">
                <div class="board-title">${this.name}</div>
                <div class="board-show-menubar cursor">
                    <i class="fas fa-ellipsis-v"></i>
                    Show menubar
                </div>
            </div>
            <div class="board">
                <div class="task-lists">
                    <div class="task-lists-wrapper"></div>
                    <!-- <div class="add-task-list-wrapper"></div> -->
                </div>
            </div>
        `;

        this.renderTaskLists( this.container.querySelector( '.task-lists-wrapper' ) );
    };

    Board.prototype.renderTaskLists = function( container ) {
        this.taskLists.forEach( this.renderTaskList.bind( this, container ) );
        
        const addTaskListWrapper = document.createElement( 'div' );
        addTaskListWrapper.classList.add( 'add-task-list-wrapper' );
        container.appendChild( addTaskListWrapper );

        this.renderAddTaskList( addTaskListWrapper );
    };

    Board.prototype.renderTaskList = function( container,Tasklist ) {
        const taskListWrapper = document.createElement( 'div' );
        taskListWrapper.classList.add( 'task-list-wrapper' );

        container.appendChild( taskListWrapper );
        
       Tasklist.setContainer( taskListWrapper );
       Tasklist.render();
    };

    Board.prototype.renderAddTaskList = function( container ) {
        let addListMessage, addListForm;
        
        if( this.taskLists.length === 0 ) {
            addListMessage = `<div class="add-list-message cursor">+ Add list</div>`;
        } else {
            addListMessage = `<div class="add-list-message cursor">+ Add another list</div>`;
        }

        addListForm = `
            <div class="add-list-form hide">
                <form>
                    <textarea rows="3" placeholder="Enter a title for this card..." class="add-list-input full-width-input"></textarea>
                    <div class="add-list-form-actions">
                        <button class="btn btn-inline btn-primary add-list-button cursor">Add List</button>
                        <i class="fas fa-2x fa-times add-list-cancel cursor"></i>
                    </div>
                </form>
            </div>
        `;

        container.innerHTML = `
            <div class="add-list">
                ${addListMessage}
                ${addListForm}
            </div>
        `;

        container.querySelector( '.add-list-message' ).addEventListener( 'click', function() {
            this.classList.add( 'hide' );
            container.querySelector( '.add-list-form' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-list-cancel' ).addEventListener( 'click', function() {
            container.querySelector( '.add-list-form' ).classList.add( 'hide' );
            container.querySelector( '.add-list-message' ).classList.remove( 'hide' );
        });

        container.querySelector( '.add-list-button' ).addEventListener( 'click', ( event ) => {
            event.preventDefault();
            const taskListText = container.querySelector( '.add-list-input' ).value;
            if( taskListText.trim() !== '' ) {
                this.pushTaskList(new Tasklist({
                    name: taskListText,
                    tasks: []
                }));
            }
        });
    };

    Board.prototype.pushTaskList = function(Tasklist ) {
        this.taskLists.push(Tasklist );
        this.render();
    };

    const boardConfig = {
        name: 'Frontend Training',
        taskLists: [
            {
                name: 'To Do',
                tasks: [
                    {
                        name: 'Learn HTML',
                        due: new Date( 2019, 11, 15 )
                    },
                    {
                        name: 'Learn CSS',
                        due: new Date( 2019, 11, 25 )
                    },
                    {
                        name: 'Learn JavaScript',
                        due: new Date( 2019, 12, 14 )
                    }
                ]
            },
            {
                name: 'Doing',
                tasks: [
                    {
                        name: 'Prepare resume',
                        due: new Date( 2019, 12, 31 )
                    }
                ]
            },
            {
                name: 'Testing/Verifying',
                tasks: [
                    {
                        name: 'Twitter app frontend',
                        due: new Date( 2019, 11, 20 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Deploying',
                tasks: [
                    {
                        name: 'Twitter app backend',
                        due: new Date( 2019, 11, 18 )
                    }
                ]
            },
            {
                name: 'Done',
                tasks: []
            }
        ]
    };

    const board = new Board( boardConfig, document.querySelector( '.containerboard' ) );
    board.render();
}());