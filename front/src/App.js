import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state={question_list : []}
  componentDidMount(){
    const getList = async () =>{
      const respone =await fetch('//localhost:8080/questions/list')
      const data = await respone.json()
      if(data){
        const question_list = data.result
        this.setState({question_list})
      }
      // this.setState({question_list:data})
    }
    getList()
  }
  render() {
    const question = this.state.question_list
    return (
      <div className="App">
        <header className="App-r">
          
          <ul>{question.map((x)=>(
              <li key={x.question_id}>{x.question_title} - {x.question_type}</li>
          ))}</ul>
        </header>
      </div>
    );
  }
}

export default App;