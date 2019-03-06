import React from 'react';


export default class QuestionList extends React.Component {
  state = {
    editMode: false,
    answer_text:''
  };
  toggleEditMode = () => {
    const editMode = !this.state.editMode;
    this.setState({ editMode });
  };
  
  
  renderViewMode() {
    const { question_id, question_title,question_data, question_type } = this.props;
    
    return (
      <div>

        <div>
        <span>
          {question_id} - {question_title} - {question_data}-{question_type}
        </span>
          <form >
          <input
          type="text"
          placeholder="answer"
          name="answer_text"
          onChange={evt => this.setState({ answer: evt.target.value })}
          value={this.state.answer}
        />
          <button onClick={this.onSave}>save</button>

          </form>
        
       
        </div>
        
      </div>
    );
  }
  
   
  onSave = evt => {
    // stop the page from refreshing
    evt.preventDefault();
    console.log(this.props)

    const user_id =1
    // target the form
    // const form = evt.target;
   
    // const answer_text_input = form.answer_text_input;
    
    // const answer_text_ = answer_text_input.value;
    const { answer_text } = this.state;
    const { question_id, createAnswer } = this.props;
    // run the update question function
    createAnswer( answer_text,{ question_id,user_id });
    // toggle back view mode
    console.log('er',this.props)
    this.toggleEditMode();
  };

  render() {
    
    const { editMode } = this.state;
    if (editMode) {
      return this.renderViewMode();
    } else {
      return this.renderViewMode();
      
    }
  }
}
