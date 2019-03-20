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
import './css.css'




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
    surveysUsers:[],
    questionSurvey:[],
    activities:[]
    


  }
  async componentWillMount(){
  const id = this.state.survey_id
  await this.getSurveyQuestions(id)
 
  
}

async componentWillReceiveProps(){
  const {survey_id} = this.state
  await this.innerQuestionsAnswers(survey_id)
  const isLoggedIn = auth0Client.isAuthenticated();
  const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
  const auth0_sub = current_logged_in_user_id
  await this.innerSurveysAndUsers(auth0_sub)
  await this.innerSurveysAndQuestions()
  await this.innerQuestionAsurvey(survey_id)
}

async componentDidMount() {
  const isLoggedIn = auth0Client.isAuthenticated();
  const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
  const auth0_sub = current_logged_in_user_id
  await this.getUsersList()
  await this.getAllQuestions();
  await this.getAllSurveys()
  await this.getAllAnswers()
  await this.innerQuestionSurveyUsers(auth0_sub)
    
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
// inner join questions surveys users 
innerQuestionSurveyUsers =  async auth0_sub => {
  try {
    const url = makeUrl(`inner/questions/surveys/users`)
    console.log('innerAll',url)
    console.log('Asurvey',url)
    const response =  await fetch(url,
     { headers: { Authorization: `Bearer ${auth0Client.getIdToken()}`}
    });
    const answer =  await response.json();
    if (answer.success) {
      const survey_question = answer.result;
      this.setState({ survey_question });
    } else {
      this.setState({ error_message: answer.message });
    }
    
  } catch (err) {
    this.setState({ error_message: err.message });
  }
};
  //inner join questions Asurvey
  innerQuestionAsurvey =  async survey_id => {
    try {
      const {survey_id} = this.state
      const url = makeUrl(`inner/qsurvey?survey_id=${survey_id}`)
      console.log('Asurvey',url)
      const response =  await fetch(url);
      const answer =  await response.json();
      if (answer.success) {
        const questionSurvey = answer.result;
        this.setState({ questionSurvey });
      } else {
        this.setState({ error_message: answer.message });
      }
      
    } catch (err) {
      this.setState({ error_message: err.message });
    }
  };
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
        const question_list = this.state.question_list.filter(
          question => question.id !== question_id
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
    const response = await fetch(url,{
      method:'POST', 
      headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
    });
    const answer = await response.json();
    if (answer.success) {
      // we update the user, to reproduce the database changes:

      const survey_question = this.state.survey_question.map(question => {
        // if this is the question we need to change, update it. This will apply to exactly
        // one question
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
      survey_id,
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
      const questionSurvey = [...this.state.questionSurvey,question]
      this.setState({ question_list, questionSurvey });
      
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
     
      // const answer_id = answer.result;
      const answer = { answer_text };
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

innerSurveysAndUsers =  async auth0_sub => {
  try {
    const url = makeUrl(`inner/surveys?auth0_sub="${auth0_sub}"`)
    console.log('this is ',url)
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

// inner ( surveys and questions )
innerSurveysAndQuestions =  async order => {
  try {
    const url = makeUrl(`inner/survey/questions`)
    const response =  await fetch(url);
    console.log('surevy',url)
    const answer =  await response.json();
    if (answer.success) {
    const survey_question = answer.result;
      this.setState({ survey_question });
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
    const { question_title, question_type,survey_id} = this.state;
    const question_data = 'deleted'
    // add the question 
    this.createQuestion({ question_title,  question_type,question_data,survey_id});
console.log(this.createQuestion)
    // empty
    this.setState({ question_title:' ',question_type:' ',question_data:' '});

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
  const  question = this.state.questionSurvey;
  console.log('app',this.state.questionSurvey)

  return(
    <div className="user-side" >
    
    <div className="answers">
    
    <form onSubmit={this.SubmitQuestions}>

       <br />
      {question.map(question => (
        <QuestionList
          key={question.id}
          question_id={question.question_id}
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
   reduceInner  = ()=>{
     const {inner} = this.state
     var dateArr = Object.values(inner.reduce((result, {
    question_id,
    question_title,
    question_data,
    question_type,
    survey_id,
    answer_text,
    answer_id,
    auth0_sub
}) => {
    // Create new group
    if (!result[question_id]) result[question_id] = {
      question_id,
        activities: []
    };
    // Append to group
    result[question_id].activities.push({
      question_title,
      question_data,
      question_type,
      survey_id,
      answer_text,
      answer_id,
      auth0_sub
    });
    return result;
}, {}))
  };
 dataCollection = ()=>{
  const  inner = this.state.inner;
  var dateArr = Object.values(inner.reduce((result, {
    question_id,
    question_type,
    question_title,
    answer_id,
    answer_text
}) => {
    // Create new group
    if (!result[question_id]) result[question_id] = {
      question_id,
      question_type,
    question_title,
        answers: []
    };
    // Append to group
    result[question_id].answers.push({
      answer_id,
      answer_text
    });
    return result;
}, {}));
  return(
    <div className="dataCollection-main" >
            <h2 className="survey_name">{this.state.survey_name}</h2>

    <div className="dataCollection" >
    
    <form onSubmit={this.SubmitQuestions}>
       <br />
      {dateArr.map(x => (
        <DataCollection
          key={x.id}
          question_id={x.question_id}
          question_title={x.question_title}
          question_type={x.question_type}
          answer={x.answers}
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
        const survey = { survey_name, survey_id };
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
  const  question = this.state.questionSurvey;
    return(
                 <div className="row survey " >
        <div class="col-xs-12">

      <div className="addquestion-survey">
      

    
    <form onSubmit={this.SubmitQuestions}className="questions" >
       
       <br />
       <p></p>
       <h2 id="survey_name">{this.state.survey_name}</h2>
       <hr />
       <div className="mapping"> 
      {question.map(question => (
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
         </div>
      </form>
      
      </div>
    
{/* add question section  */}
      <div className="addQuestion">
<form className="addQuestion-form" onSubmit={this.onSubmit}>
      <h4  className="add-question-h4">ADD Question</h4>
        <input
        id="test"
          type="text"
          placeholder="question"
          onChange={evt => this.setState({ question_title: evt.target.value })}
          value={this.question_title}
        />
        
        {/* <input type="text"
                  id="test"getPersonalPageData
          placeholder ="question_data"
          onChange={evt => this.setState({ question_data: evt.target.value })}
          value={this.question_data}
        /> */}
        <select id="option" onChange={evt => this.setState({ question_type: evt.target.value })}
          value={this.question_type}>
          <option>Question-Type</option>
          <option>radio</option>
          <option>text</option>
        </select>
       
        <div>
          <button className="add error"value="ADD">ADD</button>
        </div>
        </form>
        <hr />

        <button className="submit" onClick={this.change}>Save Survey</button>
        </div>
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
    <Route  path="/profile" component={this.usersAndSurveys}/>
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
  if(current_logged_in_user_id=== false){
    return<div className="userName">
    {/* <h1 className="h1-userName"   style={{color:"#0074d9"}}>SUDO</h1> */}
     <button className="createSurveybtn-signin" onClick={auth0Client.signIn}>sign in</button>
    </div>
  }else{
    return <div className="userName"> 
  
    {this.state.user_list.map(x => (
      <UserName
        key={x.id}
        auth0_sub={x.auth0_sub}
        user_name={x.user_name}
        createSurvey={this.createSurvey}
        getAllSurveys={this.getAllSurveys}
        survey_name={this.state.survey_name}
        UNState={this.state.user_name}
        
       
      />
      
    ))}
   </div>
  }
}
usersAndSurveys = ()=>{
  const  survey = this.state.surveysUsers;

  return(
    <div className="row  main-profile" >

    

       <br />
      {survey.map(user => (
        <Profile
          key={user.id}
          user_name={user.user_name}
          survey_name={user.survey_name}
          survey_id={user.survey_id}
         
          
        />
        
      ))}

    </div>
  )
}
groupAnswersByQuestion = ()=> {
  const {inner} = this.state
  const questions = {}

  for(let i; i < inner.length; i++){
    const answer = inner[i]
    const { question_id, question_text,question_title } = answer
    if(!questions[question_id]){
      questions[question_id] = {
        question_id,
        question_text,
        question_title,

        answers:[]
      }
    }
    questions[question_id].answers.push(inner)
  }
  const questions_array = Object.values(questions)
  //[ 
  //  { question_id, question_text, answers:[
  //    { answer_id, answer_text },
  //    { answer_id, answer_text },
  //    { answer_id, answer_text }
  //  ]},
  // ]
  /**
   * const questions = this.groupAnswersByQuestion(answers)
   * questions.map( ({ question_text, answers }) => {
   *  return <div>
   *    <h2>{question_text}</h2>
   *    <ul>
   *      { answers.map (({ answer_text })=>{
   *      })}
   *    </ul>
   * </div>
   * })
   */
  console.log('wowo',questions_array)
  
  return questions_array
};
  render() {
    return (
      <div className="App">
     
      <NavBar />
     <br />
          {this.renderContent()}
<br />
{this.groupAnswersByQuestion()}
        <br />
      </div>
    );
  }
}

export default withRouter(App);

