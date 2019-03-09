import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state={
    question_list : [],
    question:''
  }
  
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

  handleChange = (e) =>{
    const value = e.target.value
    this.setState({question:value})
  }
  // onSubmit = (e) => {
  //   e.preventDefault()
  //   console.log('cli')
  //   const question_list = this.state.question_list
  //   question_list.push({ question_title:this.state.question });
  //   this.setState({ question_list, question: '' })
  //   // this.setState({ question })
  // }
  createContact = async (props, e) => {
    try {
      e.preventDefault()

      if (!props ) {
        throw new Error(
          `add something`
        );
      }
      const { question } = props;
      const response = await fetch(
        `http://localhost:8080/question/new/?question_title=${question}`
      );
      const answer = await response.json();
      if (answer.success) {
        // we reproduce the user that was created in the database, locally
        const id = answer.result;
        const question = { question, id };
        const question_list = [...this.state.question_list, question];
        this.setState({ question_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };


  render() {
    const question = this.state.question_list
    return (
      <div className="App">
        <header className="App-r">
          
          <ul>{question.map((x)=>(
              <li key={x.question_id}>{x.question_title} - {x.question_type}</li>
          ))}</ul>
          <form onSubmit={this.createContact} >
            <input onChange={this.handleChange}/>
            <button className="success" >x</button>

          </form>
        </header>
      </div>
    );
  }
}

export default App;