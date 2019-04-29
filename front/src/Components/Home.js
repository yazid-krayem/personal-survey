import React, { Component} from 'react';

class Home extends Component {
 
render() {
return(
    <div>
  <form className="third" onSubmit={this.props.onSubmit}>
          <input
            type="text"
            placeholder="question"
            onChange={evt => this.setState({ question_title: evt.target.value })}
            value={this.question_title}
          />
          <select onChange={evt => this.setState({ question_type: evt.target.value })}
            value={this.question_type}>
            <option></option>
            <option>radio</option>
            <option>text</option>
          </select>
         
          <div>
            <input type="submit" value="ok" />
            <input type="reset" value="cancel" className="button" />
          </div>
        </form>

  </div>
);
}
}
export default Home;













