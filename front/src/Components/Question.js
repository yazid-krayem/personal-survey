import React from 'react';
import './questions.css'

export default class Question extends React.Component {
  state = {
    editMode: false
  };
  toggleEditMode = () => {
    const editMode = !this.state.editMode;
    this.setState({ editMode });
  };
  renderEditMode() {
    // const { question_id, question_title, question_type, updateQuestion, deleteQuestion } = this.props;
    return <div> edit mode</div>;
    
  }
  
  renderViewMode() {
    const { question_id, question_title,question_data, question_type, deleteQuestion } = this.props;
    
    return (
      <div>

        <div className="questions">
        <span>
          {question_id} - {question_title} - {question_data}-{question_type}
        </span>
        <button onClick={this.toggleEditMode} className="success">
          edit
        </button>
        <button onClick={() => deleteQuestion(question_id)} className="warning">
          x
        </button>
        </div>
        <div>
        </div>
        
      </div>
    );
  }
  
   renderEditMode() {
    const { question_title, question_type,question_data } = this.props;
    return (
      
      <form
        className="third"
        onSubmit={this.onSubmit}
        onReset={this.toggleEditMode}
      >
        <input
          type="text"
          placeholder="question"
          name="question_title_input"
          defaultValue={question_title}
        />
        <input
          type="text"
          placeholder="question_data"
          name="question_data_input"
          defaultValue={question_data}
        />
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
    const question_data = question_data_input.value;
    const question_type = question_type_input.value;
    // get the question_id and the update function from the props
    const { question_id, updateQuestion } = this.props;
    // run the update question function
    updateQuestion(question_id, { question_title,question_type,question_data });
    // toggle back view mode
    console.log(updateQuestion)
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
