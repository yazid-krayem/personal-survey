import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Router from './Router';
import Question from './Components/Question'

class App extends Component {
  state={
    question_list: [],
    question_title:'',
    question_type:'',
    error_message: "",
  }
  async componentDidMount() {
    await this.getAllQuestions();
   }
   
  getQuestion = async id => {
    // check if we already have the contact
    const previous_question = this.state.question_list.find(
      question => question.question_id === id
    );
    if (previous_question) {
      return; // do nothing, no need to reload a contact we already have
    }
    try {
      const response = await fetch(`http://localhost:8080/questions/get/${id}`);
      const answer = await response.json();
      if (answer.success) {
        // add the user to the current list of contacts
        const question = answer.result;
        const question_list = [...this.state.question_list, question];
        this.setState({ question_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  deleteQuestion = async question_id => {
    try {
      const response = await fetch(
        `http://localhost:8080/questions/delete/${question_id}`
      );
      const answer = await response.json();
      if (answer.success) {
        // remove the user from the current list of users
        const question_list = this.state.question_list.filter(
          question => question.question_id !== question_id
        );
        this.setState({ question_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };
 
//////////////////////////update

updateQuestion = async (question_id, props) => {
  try {
    if (!props || !(props.question_title || props.question_type )) {
      throw new Error(
        `you need at least something  `
      );
    }
    const response = await fetch(
      `http://localhost:8080/questions/update/${question_id}?question_title=${props.question_title}&question_type=${props.question_type}`
    );
    const answer = await response.json();
    if (answer.success) {
      // we update the user, to reproduce the database changes:
      const question_list = this.state.question_list.map(question => {
        // if this is the contact we need to change, update it. This will apply to exactly
        // one contact
        if (question.question_id === question_id) {
          const new_question = {
            question_id: question.question_id,
            question_title: props.question_title || question.question_type,
            question_type: props.question_type || question.question_title,
          
          };
          return new_question;
        }
        // otherwise, don't change the contact at all
        else {
          return question;
        }
      });
      this.setState({ question_list});
    } else {
      this.setState({ error_message: answer.message });
    }
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};

////create
createQuestion = async props => {
  try {
    if (!props || !(props.question_title && props.question_type )) {
      throw new Error(
        `errrrrrrrrrrrrrrrrrrrrror `
      );
    }
    const { question_title,question_type } = props;
    const response = await fetch(
      `http://localhost:8080/question/add?question_title=${question_title}&question_type=${question_type}`
    );
    const answer = await response.json();
    if (answer.success) {
      const question_id = answer.result;
      const question = { question_title,question_type, question_id };
      const question_list = [...this.state.question_list, question];
      this.setState({ question_list });
    } else {
      this.setState({ error_message: answer.message });
    }
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};


  //All
  getAllQuestions = async order => {
    try {
      const response = await fetch(
        `//localhost:8080/questions/list`
      );
      const answer = await response.json();
      if (answer.success) {
        const question_list = answer.result;
        console.log("here",question_list)
        this.setState({ question_list });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  handleChange = (e) =>{
    const value = e.target.value
    this.setState({question:value})
  }
  handleType = (e) =>{
    const value = e.target.value
    this.setState({type:value})
    console.log(value)
  }
  onSubmit = evt => {
    evt.preventDefault();
    const { question_title, question_type } = this.state;
    // create the contact from mail and email
    this.createQuestion({ question_title,  question_type });
    // empty name and email so the text input fields are reset
    this.setState({ question_title:'',question_type:'' });
  };

  render() {
    const  question = this.state.question_list;
    const {error_message } = this.state;
    return (
      <div>
             <header className="App-">

 
 <div className="container" style={{background:'blue',width:"40%", textAlign:'center',margin:'0 auto'}}>
     {error_message ? <p> ERROR! {error_message}</p> : false}
        {question.map(question => (
          <Question
            key={question.id}
            question_id={question.id}
            question_title={question.question_title}
            question_type={question.question_type}
            updateQuestion={this.updateQuestion}
            deleteQuestion={this.deleteQuestion}
          />
        ))}
<form className="third" onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="question"
            onChange={evt => this.setState({ question_title: evt.target.value })}
            value={this.state.question_title}
          />
          <input
            type="text"
            placeholder="type"
            onChange={evt => this.setState({ question_type: evt.target.value })}
            value={this.state.question_type}
            
          />
         
          <div>
            <input type="submit" value="ok" />
            <input type="reset" value="cancel" className="button" />
          </div>
        </form>
        </div>

</header>
       {/* <Router /> */}
      </div>
    );
  }
}

export default App;
