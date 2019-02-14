import sqlite from 'sqlite'
import SQL from 'sql-template-strings';

const initializeDatabaseAnswer = async () =>{

    const db = await sqlite.open("./personal.sqlite");


    /**
   * creates a question
   * @param {object} props an object with keys `answer_id` and `question_questrion_id`
   * @returns {number} the id of the created question (or an error if things went wrong) 
   */

  const createAnswer = async (props) => {
    if(!props || !props.question ){
      throw new Error(`you must provide a answer`)
    }
    const { answer } = props
    try{
      const result = await db.run(SQL`INSERT INTO answer (answer_id,answer_text) VALUES (${answer})`);
      const id = result.stmt.lastID
      return id
    }catch(e){
      throw new Error(`couldn't insert this combination: `+e.message)
    }
  }

/**
   * deletes an answer
   * @param {number} id the id of the answer to delete
   * @returns {boolean} `true` if the answer was deleted, an error otherwise 
   */
        const deleteAnswer = async (id) =>{
            try{
                const result = await db.run(SQL `DELETE FROM answer WHERE answer_id =${id}`)
                if(result.stmt.changes === 0){
                 throw new Error (`answer "${id}" does not exist`)
                }
                return true    
            }catch(e){
                throw new Error (`couldn't delete the answer "${id}": `+e.message)
            }
        }

        /**
   * Edits a answer
   * @param {number} id the id of the answer to edit
   * @param {object} props an object with at least one of `answer_text`
   */

        const updateAnswer = async (id,props) =>{
            if(!props || !props.answer){
                throw new Error (`you must provide an answer`);
            }
            const {answer} = props
            try{
                let statement = '';
                if(answer){
                    statement = SQL`UPDATE answer SET answer_text${answer}, WHERE answer_id =${id}`
                }
                const result = await db.run(statement)
                if(result.stmt.changes === 0 ){
                    throw new Error(`no changes were made`)
                }
                return true
            }catch(e) {
                throw new Error (`couldn't update the answer ${id}:` + e.message)
            }
        }
        /**
   * Retrieves a answer
   * @param {number} id the id of the answer
   * @returns {object} an object with `answer_text`, and `answer_id`, representing an answer, or an error 
   */
  const getAnswer = async (id) => {
    try{
      const answerList = await db.all(SQL`SELECT answer_id AS id, answer_text FROM answer WHERE answer_id = ${id}`);
      const answer = answerList[0]
      if(!answer){
        throw new Error(`answer ${id} not found`)
      }
      return answer
    }catch(e){
      throw new Error(`couldn't get the answer ${id}: `+e.message)
    }
  }
     /**
   * retrieves the answers from the database
   * @param {string} orderBy an optional string that is either "answer"
   * @returns {array} the list of answers
   */

   const getAnswerList = async(orderBy) =>{
       try{
           let statement = `SELECT answer_id AS id , question_text FROM answer `
           switch(orderBy){
            case 'answer_text': statement+= ` ORDER BY answer_text`; break;
            default: break
        }
        const rows = await db.all(statement)
      if(!rows.length){
        throw new Error(`no rows found`)
       }
       return rows
    }catch(e){
      throw new Error(`couldn't retrieve answer: `+e.message)
   }
   }
   
const controllerAnswer = {
    getAnswerList,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    getAnswer
}
return controllerAnswer
}

export default initializeDatabase