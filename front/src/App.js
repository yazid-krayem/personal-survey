import React, { Component } from 'react';
import {Switch,Route} from 'react-router-dom';
import Question from './Components/Question'
import NavBar from './Components/NavBar/NavBar'
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from 'react-router-dom';
import { pause, makeRequestUrl } from "./utils.js";
import * as auth0Client from './auth';
import SurveyQuestions from './SurveyQuestions'
// import './App.css'
import Profile from './Components/Profile';
import QuestionList from './Components/QuestionList';
import DataCollection from './DataCollection';
import UserName from './Components/UserName';




const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);

class App extends Component {
  
  state={
    toggle: false,
    question_list: [],
    user_list:[],
    user_name:'',
    survey_list:[],
    survey_name:[],
    survey_question:[],
    survey_id:'',
    question_id:'',
    question_title:'',
    question_type:'',
    question_data:'',
    error_message: "",
    isLoading: false,
    token: null,
    nick: null,
    checkingSession: true,
    answer_text:'',
    answer_list:[],
    user:'',
    inner:[],
    surveysUsers:[]


  }
  async componentWillMount(){
  const id = this.state.survey_id
  await this.getSurveyQuestions(id)

  
}

async componentWillReceiveProps(){
  const {survey_id} = this.state
  await this.innerQuestionsAnswers(survey_id)
  await this.innerSyrveysAndUsers()
}
async componentDidMount() {
  await this.getUsersList()
  await this.getAllQuestions();
  await this.getAllSurveys()
  await this.getAllAnswers()
  
    
    if (this.props.location.pathname === "/callback") {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      await this.getPersonalPageData(); // get the data from our server
    } catch (err) {
      if (err.error !== "login_required") {
      }
    }
    this.setState({ checkingSession: false });
  }
 
  //get Survey Question query
  getSurveyQuestions = async id => {
  
    try {
      const url = makeUrl(`survey/questions/${id}`)
      const response = await fetch(url,{
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}
      })
      const answer = await response.json();
      if (answer.success) {
        // add the user to the current list of contacts
        const question = answer.result;
        const survey_question =  question;
        this.setState({ survey_question });
      } else {
        this.setState({ error_message: answer.message });
      }
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };

  //get question
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
      const response = await fetch(url,{
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}
      })
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
      const response = await fetch(url,{
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}
      });
      const answer = await response.json();
      if (answer.success) {
        // remove the user from the current list of users
        const survey_question = this.state.survey_question.filter(
          question => question.id !== question_id
        );
        this.setState({ survey_question });
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
    const response = await fetch(url,{
      method:'POST', 
      headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
    });
    const answer = await response.json();
    if (answer.success) {
      // we update the user, to reproduce the database changes:

      const survey_question = this.state.survey_question.map(question => {
        // if this is the contact we need to change, update it. This will apply to exactly
        // one contact
        if (question.id === question_id ) {
          const new_question = {
            id: question_id,
            question_title: props.question_title || question.question_type || question.question_data,
            question_type: props.question_type || question.question_title || question.question_data,
            question_data:props.question_data || props.question_type || question.question_data,
          
          };
          return new_question;
        }
        // otherwise, don't change the contact at all
        else {
          return question;
        }
      });
      this.setState({ survey_question});
    } else {
      this.setState({ error_message: answer.message });
    }
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};



////add question
createQuestion = async props => {
  try {
    if (!props || !(props.question_title && props.question_type && props.question_data )) {
      throw new Error(
        
      );
    }
    const { question_title,question_type,question_data,survey_id } = props;
    const url = makeUrl(`question/add`,{
      question_title:props.question_title,
      question_type:props.question_type,
      question_data:props.question_data,
      survey_id:props.survey_id,
      token:this.state.token
    })
    const response = await fetch(url,{
      headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
    });
    const answer = await response.json();
    if (answer.success) {
      const question_id = answer.result;
      const question = { question_title,question_type,question_data, id:question_id };
      this.setState({question_id:question_id});
      const question_list = [...this.state.question_list, question];
      const survey_question = [...this.state.survey_question,question]
      this.setState({ question_list, survey_question });
      
    } else {
      this.setState({ error_message: answer.message });
    }
    // this.setState({toggle: !this.state.toggle})
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};



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
//create answer
createAnswer = async props => {
  try {
    if (!props) {
      throw new Error(
        `errrrrrrrrrrrrrrrrrrrrror `
      );
    }
    const { answer_text,question_id } = props;
    const url = makeUrl(`answer/add`,{
      answer_text,
      question_id,
      token:this.state.token
    })
    const response = await fetch(url,{
      headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
    });
    const answer = await response.json();
    if (answer.success) {
     
      const answer_id = answer.result;
      const answer = { answer_text,answer_id };
      const answer_list = [...this.state.answer_list, answer];
      this.setState({ answer_list });
    } else {
      this.setState({ error_message: answer.message });
    }
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};

//inner (questions and answers)
 
innerQuestionsAnswers =  async survey_id => {
  try {
    const {survey_id} = this.state
    const url = makeUrl(`inner/question?survey_id=${survey_id}`)
    const response =  await fetch(url);
    const answer =  await response.json();
    if (answer.success) {
      const inner = answer.result;
      this.setState({ inner });
    } else {
      this.setState({ error_message: answer.message });
    }
    
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};
// inner (surveys and users )

innerSyrveysAndUsers =  async auth0_sub => {
  try {
    const url = makeUrl(`inner/surveys?auth0_sub=${auth0_sub}`)
    const response =  await fetch(url);
    const answer =  await response.json();
    if (answer.success) {
      const surveysUsers = answer.result;
      this.setState({ surveysUsers });
    } else {
      this.setState({ error_message: answer.message });
    }
    
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};
//All Answers

getAllAnswers = async order => {
  try {
    const url = makeUrl(`answers/list`)
    const response = await fetch(url);
    const answer = await response.json();
    if (answer.success) {
      const answer_list = answer.result;
      this.setState({ answer_list });
    } else {
      this.setState({ error_message: answer.message });
    }
    
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};

  //All users
  getUsersList = async order => {
    try {
      const url = makeUrl(`users/list`)
      const response = await fetch(url);
      const answer = await response.json();
      if (answer.success) {
        const user_list = answer.result;
        this.setState({ user_list });
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
    const { question_title, question_type,question_data,survey_id} = this.state;
    // add the question 
    this.createQuestion({ question_title,  question_type,question_data,survey_id});

    // empty
    this.setState({ question_title:'',question_type:'',question_data:'',survey_id});

  };
 
componentDidCatch(){
  this.SubmitQuestions()
}
change = ()=>{
  const { survey_name } = this.state;
    // add the survey 
    this.createQuestion({ survey_name});
    // empty

  this.props.history.push('/user-side')
}

  surveyFormat =() =>{
    const  question = this.state.question_list;
    return(
      <div  className="survey">
      
      <div className="questions">
      
      <form onSubmit={this.SubmitQuestions}>
         
         <br />
        {question.map(question => (
          <Question
            key={question.id}
            question_id={question.id}
            question_data={question.question_data}
            question_title={question.question_title}
            question_type={question.question_type}
            author_id={question.author_id}
            updateQuestion={this.updateQuestion}
            deleteQuestion={this.deleteQuestion}
          />
          
        ))}

        </form>
        </div>
        <div className="addQuestion">
        <br />
<form className="third" onSubmit={this.onSubmit}>
          <input
          id="test"
            type="text"
            placeholder="question"
            onChange={evt => this.setState({ question_title: evt.target.value })}
            value={this.question_title}
          />
          <input type="text"
                    id="test"getPersonalPageData
            placeholder ="question_data"
            onChange={evt => this.setState({ question_data: evt.target.value })}
            value={this.question_data}
          />
          <select id="option" onChange={evt => this.setState({ question_type: evt.target.value })}
            value={this.question_type}>
            <option>Question-Type</option>
            <option>radio</option>
            <option>text</option>
          </select>
         
          <div>
            <input type="submit" value="ADD" />
          </div>
          </form>
          <hr />
          <button className="submit" onClick={this.change}>Save Survey</button>

          </div>

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
      const response = await fetch(url,{
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}

      });
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
//All surveys
getAllSurveys = async order => {
  this.setState({ isLoading: true });
  try {
    const url = makeUrl(`surveys/list`, { order });
    const response = await fetch(url);
    await pause();
    const answer = await response.json();
    if (answer.success) {
      const survey_list = answer.result;
      this.setState({ survey_list, isLoading: false });
    } else {
      this.setState({ error_message: answer.message, isLoading: false });
    }
  } catch (err) {
    this.setState({ error_message: err.message, isLoading: false });
  }
};
data = ()=>{
  this.props.history.push('/data-collection')
 

}
userSide = ()=>{
  const  question = this.state.survey_question;
  console.log('app',this.state.survey_name)

  return(
    <div className="user-side" >
    
    <div className="answers">
    
    <form onSubmit={this.SubmitQuestions}>

       <br />
      {question.map(question => (
        <QuestionList
          key={question.id}
          question_id={question.id}
          question_data={question.question_data}
          question_title={question.question_title}
          question_type={question.question_type}
          author_id={question.author_id}
            createAnswer={this.createAnswer}
            answer_list={this.state.answer_list}
            answer_text={this.state.answer_text}
            survey_name={this.state.survey_name}
          
        />
        
      ))}

      </form>
      <button onClick={this.data}>Data</button>
      </div>
      </div>
  )}
 dataCollection = ()=>{
  const  inner = this.state.inner;
  return(
    <div  >
    
    <div >
    
    <form onSubmit={this.SubmitQuestions}>
       
       <br />
      {inner.map(x => (
        <DataCollection
          key={x.id}
          question_id={x.id}
          question_title={x.question_title}
          question_type={x.question_type}
          answer_text={x.answer_text}
          author_id={x.author_id}
          survey_id={this.state.survey_id}  
          survey_name={this.state.survey_name}
        />
        
      ))}

      </form>
      </div>
      </div>
  )}
  //create survey
  createSurvey = async props => {
    try {
      if (!props ) {
        throw new Error(
          
        );
      }
      const { survey_name } = props;
      const url = makeUrl(`survey/add`,{
        survey_name:props.survey_name,
       
        token:this.state.token
      })
      const response = await fetch(url,{
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      });
      const answer = await response.json();
      if (answer.success) {
        const survey_id = answer.result;
        const survey = { survey_name, id:survey_id, };
        this.setState({survey_id:survey_id,survey_name:survey_name});
        const survey_list = [...this.state.survey_list, survey];
        this.setState({ survey_list });
        
      } else {
        this.setState({ error_message: answer.message });
      }
      // this.setState({toggle: !this.state.toggle})
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };
 
surveyQuestions =() =>{
  const  question = this.state.survey_question;
  const item = question;
    return(
      <div  className="survey">
      <div className="questions">
    
    <form onSubmit={this.SubmitQuestions}>
       
       <br />
       <p></p>
       <h2 className="survey_name">{this.state.survey_name}</h2>
       <hr />
      {item.map(question => (
        <SurveyQuestions
          key={question.id}
          question_id={question.id}
          question_data={question.question_data}
          question_title={question.question_title}
          question_type={question.question_type}
          author_id={question.author_id}
          updateQuestion={this.updateQuestion}
          deleteQuestion={this.deleteQuestion}
          survey_name={this.state.survey_name}
        />
        
      ))}
         
      </form>
      
      </div>
    
  
       
  
 
   
    
    
      <div className="addQuestion">
      <br />
<form className="third" onSubmit={this.onSubmit}>
        <input
        id="test"
          type="text"
          placeholder="question"
          onChange={evt => this.setState({ question_title: evt.target.value })}
          value={this.question_title}
        />
        
        <input type="text"
                  id="test"getPersonalPageData
          placeholder ="question_data"
          onChange={evt => this.setState({ question_data: evt.target.value })}
          value={this.question_data}
        />
        <select id="option" onChange={evt => this.setState({ question_type: evt.target.value })}
          value={this.question_type}>
          <option>Question-Type</option>
          <option>radio</option>
          <option>text</option>
        </select>
       
        <div>
          <input type="submit" value="ADD" />
        </div>
        </form>
        <hr />
        <button className="submit" onClick={this.change}>Save Survey</button>

        </div>

    </div>
  )
}
//router
renderContent() {
  if (this.state.isLoading) {
    return <p>loading...</p>;
  }
  return (
    <Switch>
      
    <Route  path="/" exact  component={this.surveyCreate}  />
    <Route  path="/survey"   component={this.surveyQuestions}  />
    <Route  path="/user-side" component={this.userSide} />
    <Route  path="/data-collection" component={this.dataCollection} />
    <Route  path="/profile" />
    <Route path = '/callback' render = {this.handleAuthentication}/>
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
    console.log('720',name)
    await this.getPersonalPageData(); // get the data from our server
    toast(`${name} is logged in`);
    this.props.history.push("/");
  } catch (err) {
    this.isLogging = false
    toast.error(`error from the server: ${err.message}`);
  }
};
handleAuthentication = () => {
  this.login();
  return <p>wait...{this.name}</p>;
};

userList=()=>{
  const {user_list}=this.state
return (user_list.map(x=> <div>{x.user_name}</div>))
}

surveyCreate = ()=>{
  const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    console.log('testing',current_logged_in_user_id)
  if(current_logged_in_user_id== false){
    return<div className="mainForm"> <button onClick={auth0Client.signIn}>sign in</button>
    </div>
  }else{
    return <div>
  
    {this.state.user_list.map(x => (
      <UserName
        key={x.id}
        auth0_sub={x.auth0_sub}
        user_name={x.user_name}
        createSurvey={this.createSurvey}
        getAllSurveys={this.getAllSurveys}
        survey_name={this.state.survey_name}
       
      />
      
    ))}
   </div>
  }
}

  render() {
    return (
      <div className="mainPage">
     
      <NavBar />
          {this.renderContent()}
<div>
<br />
       <br/>
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
