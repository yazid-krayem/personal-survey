import React, { Component } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Question from './Components/Question'
import Link from './Components/Link';
import NavBar from './Components/NavBar/NavBar'
import About from './Components/About';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from 'react-router-dom';
import { pause, makeRequestUrl } from "./utils.js";
import * as auth0Client from './auth';

import './App.css'




const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);

class App extends Component {
  
  state={
    toggle: false,
    question_list: [],
    answer_list:[],
    question_id:'',
    question_title:'',
    question_type:'',
    question_data:'',
    error_message: "",
    isLoading: false,
    token: null,
    nick: null,
    checkingSession: true



  }

  async componentDidMount() {
    await this.getAllQuestions();
    if (this.props.location.pathname === "/callback") {
      this.setState({checkingSession:false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      await this.getPersonalPageData(); // get the data from our server
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") {
        console.log(err.error);
      }
    }
    this.setState({checkingSession:false});

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
      const url = makeUrl(`questions/get/${id}`)
      const response = await fetch(url)
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
      const url = makeUrl(`questions/delete/${question_id}`)
      const response = await fetch(url);
      const answer = await response.json();
      if (answer.success) {
        // remove the user from the current list of users
        const question_list = this.state.question_list.filter(
          question => question.question_id !== question_id
        );
        this.setState({ question_list });
        toast('deleted')
      } else {
        this.setState({ error_message: answer.message });
        toast.error(answer.message)
      }
    } catch (err) {
      this.setState({ error_message: err.message });
      toast.error(err.message)
    }
  };
 
//////////////////////////update

updateQuestion = async (question_id, props) => {
  try {
    if (!props || !(props.question_title || props.question_type ||!props.question_data )) {
      throw new Error(
        `you need at least something  `
      );
    }
    const url = makeUrl(`questions/update/${question_id}`,{
      question_title:props.question_title,
      question_type:props.question_type,
      question_data:props.question_data,
      token:this.state.token
    })
    const response = await fetch(url);
    const answer = await response.json();
    if (answer.success) {
      // we update the user, to reproduce the database changes:
      const question_list = this.state.question_list.map(question => {
        // if this is the contact we need to change, update it. This will apply to exactly
        // one contact
        if (question.question_id === question_id) {
          const new_question = {
            question_id: question.question_id,
            question_title: props.question_title || question.question_type || question.question_data,
            question_type: props.question_type || question.question_title || question.question_data,
            question_data:props.question_title || props.question_type || question.question_data,
          
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
    if (!props || !(props.question_title && props.question_type && props.question_data )) {
      throw new Error(
        `errrrrrif(this.state.question_id===''){
    //   return this.getAllQuestions()
    // }rrrrrrrrrrrrrrrror `
      );
    }
    const { question_title,question_type,question_data } = props;
    const url = makeUrl(`question/add`,{
      question_title:props.question_title,
      question_type:props.question_type,
      question_data:props.question_data,
      token:this.state.token
    })
    const response = await fetch(url);
    const answer = await response.json();
    if (answer.success) {
      const question_id = answer.result;
      const question = { question_title,question_type,question_data, id:question_id };
      this.setState({question_id:question_id});
      const question_list = [...this.state.question_list, question];
      this.setState({ question_list });
      console.log(question, question_list)
      
    } else {
      this.setState({ error_message: answer.message });
    }
    // this.setState({toggle: !this.state.toggle})
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};

question_id

  //All
  getAllQuestions = async order => {
    try {
      const url = makeUrl(`questions/list`)
      const response = await fetch(url);
      const answer = await response.json();
      if (answer.success) {
        const question_list = answer.result;
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
  }
  onSubmit = evt => {
    evt.preventDefault();
    const { question_title, question_type,question_data, } = this.state;
    // add the question 
    this.createQuestion({ question_title,  question_type,question_data });
    // empty
    this.setState({ question_title:'',question_type:'',question_data:'' });

  };
  SubmitQuestions = e =>{
    // e.preventDefault();
    // this.context.router.history.push(`/About`);
    
    // this.props.location.SubmitQuestions();

  }
componentDidCatch(){
  this.SubmitQuestions()
}
change = ()=>{
  this.props.history.push('/About')
}
  surveyFormat =() =>{
    const  question = this.state.question_list;
    const {error_message } = this.state;
    return(
      <div className="survey">
      <form onSubmit={this.SubmitQuestions}>
         {error_message ? <p> ERROR! {error_message}</p> : false}
        {question.map(question => (
          <Question
            key={question.id}
            question_id={question.id}
            question_data={question.question_data}
            question_title={question.question_title}
            question_type={question.question_type}
            updateQuestion={this.updateQuestion}
            deleteQuestion={this.deleteQuestion}
          />
          
        ))}
                  <button className="submit" onClick={this.change}>submit</button>

        </form>
<form className="third" onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="question"
            onChange={evt => this.setState({ question_title: evt.target.value })}
            value={this.question_title}
          />
          <input type="text"
            placeholder ="question_data"
            onChange={evt => this.setState({ question_data: evt.target.value })}
            value={this.question_data}
          />
          <select onChange={evt => this.setState({ question_type: evt.target.value })}
            value={this.question_type}>
            <option></option>
            <option>radio</option>
            <option>text</option>
          </select>
         
          <div>
            <input type="submit" value="ADD" />
          </div>
          </form>



      </div>
    )
  }
  renderUser() {
    const isLoggedIn = auth0Client.isAuthenticated();
    if (isLoggedIn) {
      // user is logged in
      return this.renderUserLoggedIn();
    } else {
      return this.renderUserLoggedOut();
    }
  }
  renderUserLoggedOut() {
    return <button onClick={auth0Client.signIn}>Sign In</button>;
  }
  renderUserLoggedIn() {
    const nick = auth0Client.getProfile().name;
    return (
      <div>
        Hello, {nick}!{" "}
        <button
          onClick={() => {
            auth0Client.signOut();
            this.setState({});
          }}
        >
          logout
        </button>
      </div>
    );
  }


  getPersonalPageData = async () => {
    try {
      const url = makeUrl(`mypage`, { token: this.state.token });
      const response = await fetch(url);
      const answer = await response.json();
      if (answer.success) {
        const message = answer.result;
        // we should see: "received from the server: 'ok, user <username> has access to this page'"
        toast(`received from the server: '${message}'`);
      } else {
        this.setState({ error_message: answer.message });
        toast.error(`error message received from the server: ${answer.message}`);
      }
    } catch (err) {
      this.setState({ error_message: err.message });
      toast.error(err.message);
    }
  };
//router
renderContent() {
  if (this.state.isLoading) {
    return <p>loading...</p>;
  }
  return (
    <Switch>
    <Route exact path="/"  component={this.surveyFormat}  />
    <Route  path="/About" component={About} />
    <Route  path="/link" component={Link} />
    
    <Route render={()=><div>not found!</div>}/>

   
  </Switch>
  );
}
isLogging = false;
login = async () => {
  if (this.isLogging === true) {
    return;
  }
  this.isLogging = true;
  try {
    await auth0Client.handleAuthentication();
    const name = auth0Client.getProfile().name; // get the data from Auth0
    await this.getPersonalPageData(); // get the data from our server
    toast(`${name} is logged in`);
    this.props.history.push("/profile");
  } catch (err) {
    this.isLogging = false
    toast.error(`error from the server: ${err.message}`);
  }
};
handleAuthentication = () => {
  this.login();
  return <p>wait...</p>;
};


  render() {
    return (
      <div>
     

        <NavBar />
       
          {this.renderContent()}
<div>
         
            </div>
        <div className="home"> 
      <br />    
<br />
<br />
<div>

        </div>
 
 
    


   
      </div>
      </div>
    );
  }
}

export default withRouter(App);
