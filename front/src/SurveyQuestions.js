import React from 'react';
import * as auth0Client from "./auth";
import './surveyQuestions.css'



export default class SurveyQuestions extends React.Component {
  state = {
    editMode: false
  };
 
  toggleEditMode = () => {
    const editMode = !this.state.editMode;
    this.setState({ editMode });
  };
  renderEditMode() {
    const { question_id, question_title, question_type, updateQuestion, deleteQuestion } = this.props;
    return <div> edit mode</div>;
    
  }
  deleteQuestions(e){
    const {deleteQuestion,question_id}=this.props
    e.preventDefault();
    deleteQuestion(question_id)
    //do something...


}
  
  renderViewMode() {
    const { question_id, question_title,question_data, question_type, deleteQuestion,author_id ,question_test} = this.props;
    const isLoggedIn = auth0Client.isAuthenticated();
    const current_logged_in_user_id = isLoggedIn && auth0Client.getProfile().sub
    const is_author = author_id === current_logged_in_user_id
    
    
    return (
      <div >

        <div >
      

          <h3> {question_title}</h3> 
    <footer className="footer">
        <button onClick={this.toggleEditMode} className="success">
                edit
              </button>
              <button  onClick={(e) => {this.deleteQuestions(e)}} className="error">
                x
              </button>
              </footer>
          </div>
        

       
   </div>
    );
  }
  
   renderEditMode() {
    const { question_title, question_type,question_data } = this.props;
    return (
      
      <form
        onSubmit={this.onSubmit}
        onReset={this.toggleEditMode}
      >
        <input
          type="text"
          placeholder="question"
          name="question_title_input"
          defaultValue={question_title}
        />
        {/* <input
          type="text"
          placeholder="question_data"
          name="question_data_input"
          defaultValue={question_data}
        /> */}
        <select name="question_type_input"
        defaultValue={question_type}
        >
          <option></option>
          <option>text</option>
          <option>radio</option>

          </select>
        
          
        <div>
          <input type="submit" value="ok" />
          <input type="reset" value="cancel" className="button" />
        </div>
      </form>
    );
  } 
  onSubmit = evt => {
    // stop the page from refreshing
    evt.preventDefault();
    // target the form
    const form = evt.target;
    // extract the two inputs from the form
    const question_title_input = form.question_title_input;
    const question_data_input = form.question_data_input;
    const question_type_input = form.question_type_input;
    // extract the values
    const question_title = question_title_input.value;
    // const question_data = question_data_input.value;
    const question_data = 23

    const question_type = question_type_input.value;
    // get the question_id and the update function from the props
    const { question_id, updateQuestion } = this.props;
    // run the update question function
    updateQuestion(question_id, { question_title,question_type,question_data });
    // toggle back view mode
    this.toggleEditMode();
  };

  render() {
    const { editMode } = this.state;
    if (editMode) {
      return this.renderEditMode();
    } else {
      return this.renderViewMode();
              

      
    }
  }
}
