import React, { Component } from "react";
import Task from "./Task";
import Keywords from "./Keywords";
import RefreshIcon from '@material-ui/icons/Refresh';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../services/getData';
import moment from 'moment';


export default class Todo extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      tasks: [],
      keys: [],
    };
  }
  componentDidMount(){
    //console.log('Mount')
    const appData = this.getLocalData();
    if(appData && appData.tasks.length > 0)
      this.setState({...this.state,...appData});
  }
  componentDidUpdate(){
    this.setLocalData();
  }
  getLocalData = () => {
     return getDataFromLocalStorage();
  }
  setLocalData = () => {
    setDataToLocalStorage(this.state);
  }
  addTask = (e) => {
    if (e.charCode === 13 && e.target.value) {
      const date = moment().format();
      let id =
        this.state.tasks.length > 0? this.state.tasks[0].id + 1: 1;
      let tasks = [
        {
          id: id,
          title: e.target.value,
          createdDate: date,
          completedDate: null,
        },
        ...this.state.tasks
      ];
      let State = { ...this.state, inputValue: "", tasks: [...tasks] };
      this.setState({ ...State });
    }
  };
  handleChange = (e) => {
    this.setState({ ...this.state, inputValue: e.target.value });
  };
  deleteAll = () => {
    this.setState({ inputValue: "", tasks: [] , keys: []});
  }
  resetAll = () => {
      if(this.state.tasks.length > 0)
        this.setState({...this.state, tasks: [...this.state.tasks.map((t)=>{t.completedDate=null; return t;})]})
  }
  getTasksWithKeywords = () =>{
    const { tasks, keys } = this.state;
    if(keys.length === 0)
      return tasks;
    return tasks.filter((task) => {
        let matchingKeys = keys.filter((key) => {
            return task.title.includes(key)
        });
        return matchingKeys.length === keys.length;
    })
  }
  getUnCompletedTasks = () => {
    const { tasks } = this.state;
    if (tasks.length > 0) {
        return this.getTasksWithKeywords().filter((task) => {
          return task.completedDate === null;
        }).sort((t1,t2)=>{
          return  t1.createdDate - t2.createdDate;
        });
    }
    return [];
  };
  getCompletedTasks = () => {
    const { tasks } = this.state;
    if (tasks.length > 0) {
        
        return this.getTasksWithKeywords().filter((task) => {
          return task.completedDate !== null;
        }).sort((t1,t2)=>{
          return  t1.completedDate - t2.completedDate;
        });
    }
    return [];
  };
  markCompleted = (id) => {
    const date = moment().format();
    let tasks = this.state.tasks.map((t) => {
      if (t.id === id) {
        t.completedDate = date;
      }
      return t;
    });
    this.setState({ ...this.state, tasks: [...tasks] });
  };
  addKey = (key) => {
      //key = key.toLowerCase();
      if(!this.state.keys.includes(key))
        this.setState({ ...this.state, keys: [...this.state.keys, key] });
  }
  deleteKey = (key) => {
    this.setState({ ...this.state, keys: [...this.state.keys.filter((k) => k !== key)] });
  };
  render() {
    
    const uncompletedTasks = this.getUnCompletedTasks();
    const completedTasks = this.getCompletedTasks();
    
   // console.log(uncompletedTasks ," ", completedTasks);
    
    return (
      <div className="todo_container">
        <div className="todo_wrapper">
          <h2>To do list</h2>
          <div>
            <div className="button_container">
                <button onClick={this.deleteAll}><span><ClearAllIcon/></span><span>Delete all tasks</span></button>
                <button onClick={this.resetAll}><span><RefreshIcon/></span><span>Reset all tasks</span></button>
            </div>
            <div className="input_conatiner">
              <input
                type="text"
                value={this.state.inputValue}
                onChange={(e) => this.handleChange(e)}
                onKeyPress={(e) => this.addTask(e)}
                placeholder="+ Add a task"
              />
            </div>
              { this.state.keys.length > 0 ? (
                  <Keywords
                    keywords={this.state.keys}
                    onKeyRemoved={this.deleteKey}
                  />
              ) : (
                ""
              )}
            <div className="tasks_wrapper">
              <div>
                {uncompletedTasks.map((t) => {
                  return (
                    <Task
                      key={t.id}
                      id={t.id}
                      title={t.title}
                      onComplete={this.markCompleted}
                      completed="false"
                      onKeySearch={this.addKey}
                    />
                  );
                })}
              </div>
              <div>
                {completedTasks.length > 0 ? <div>Completed</div> : ""}

                {completedTasks.map((t) => {
                  return (
                    <Task
                      key={t.id}
                      id={t.id}
                      title={t.title}
                      completed="true"
                      onKeySearch={this.addKey}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
