import React from 'react';
import { pause, makeRequestUrl } from "../utils.js";


const makeUrl = (path, params) =>
  makeRequestUrl(`http://localhost:8080/${path}`, params);


export default class QuestionList extends React.Component {
  state = {
    editMode: false,
    answer_text:'',
    answer_list:[],
    user_id:1
  };
  async componentDidMount() {
    await this.getAllAnswers();
    
   }
  getAllAnswers = async order => {
    try {
      const url = makeUrl=(`answers/list`)
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
  createAnswer = async props => {
    try {
      if (!props || !(props.answer_text && props.question_id )) {
        throw new Error(
          `errrrrrrrrrrrrrrrrrrrrror `
        );
      }
      const { answer_text,question_id } = props;
      const url = makeUrl(`answer/add`,{
        answer_text:props.answer_text,
        question_id:props.question_id,
        user_id:this.state.user_id
      })
      const response = await fetch(url);

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
          <form onSubmit={this.onSave}>
          <input
          type="text"
          placeholder="answer"
          name="answer_text"
          onChange={evt => this.setState({ answer_text: evt.target.value })}
          value={this.state.answer_text}
        />
          <button  onClick={this.onSave}>save</button>
          
          </form>
       
        </div>
        
      </div>
    );
  }
  
   
  onSave = evt => {
    evt.preventDefault();

    const user_id =1
    
    const { question_id } = this.props;
    const answer_text = this.state.answer_text;

    this.createAnswer({answer_text , question_id,user_id });
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
